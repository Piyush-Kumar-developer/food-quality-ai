from pathlib import Path
from io import BytesIO
from datetime import datetime, timezone
import hashlib
import hmac
import secrets

import numpy as np
import tensorflow as tf

from PIL import Image

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from pymongo import MongoClient
from bson import ObjectId

from ai.visual_quality import extract_visual_features


# ============================================================
# PATHS
# ============================================================

AI_DIR = Path(__file__).resolve().parent

RECOGNITION_MODEL_PATH = (
    AI_DIR
    / "models"
    / "food_recognition_stage1.keras"
)

QUALITY_MODEL_PATH = (
    AI_DIR
    / "models"
    / "food_quality_stage1.keras"
)


# ============================================================
# MODEL CLASSES
# ============================================================

FOOD_CLASSES = [
    "apple",
    "banana",
    "orange",
    "papaya",
    "tomato",
    "onion",
    "carrot",
]

QUALITY_CLASSES = [
    "freshapples",
    "freshbanana",
    "freshoranges",
    "rottenapples",
    "rottenbanana",
    "rottenoranges",
]

IMAGE_SIZE = (224, 224)

CONFIDENCE_THRESHOLD = 0.75

QUALITY_CONFIDENCE_THRESHOLD = 0.55


# ============================================================
# MONGODB
# ============================================================

MONGO_URI = "mongodb://127.0.0.1:27017"

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

db = client["foodai"]

scans_collection = db["scans"]
users_collection = db["users"]

try:
    client.admin.command("ping")
    print("✓ MongoDB connected")
except Exception as error:
    print("⚠ MongoDB connection failed:", error)


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="FoodAI",
    description="AI-based food recognition and visual quality API",
    version="2.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOAD MODELS
# ============================================================

print("=" * 60)
print("FOODAI AI SERVER")
print("=" * 60)

if not RECOGNITION_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"""
Recognition model not found:

{RECOGNITION_MODEL_PATH}

Make sure food_recognition_stage1.keras
is inside ai/models/
"""
    )

if not QUALITY_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"""
Quality model not found:

{QUALITY_MODEL_PATH}

Make sure food_quality_stage1.keras
is inside ai/models/
"""
    )

print("\nLoading recognition model...")

recognition_model = tf.keras.models.load_model(
    RECOGNITION_MODEL_PATH
)

print("✓ Recognition model loaded")

print("\nLoading quality model...")

quality_model = tf.keras.models.load_model(
    QUALITY_MODEL_PATH
)

print("✓ Quality model loaded")

print("\nRecognition classes:")

for index, food in enumerate(FOOD_CLASSES):
    print(f"  {index} -> {food}")

print("\nQuality classes:")

for index, quality in enumerate(QUALITY_CLASSES):
    print(f"  {index} -> {quality}")

print("\n" + "=" * 60)


# ============================================================
# HELPER - CONVERT NUMPY VALUES
# ============================================================

def make_json_safe(value):

    if isinstance(value, np.integer):
        return int(value)

    if isinstance(value, np.floating):
        return float(value)

    if isinstance(value, np.ndarray):
        return value.tolist()

    if isinstance(value, dict):
        return {
            key: make_json_safe(val)
            for key, val in value.items()
        }

    if isinstance(value, list):
        return [
            make_json_safe(item)
            for item in value
        ]

    return value


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "FoodAI AI server is running",
        "recognition_model": "FoodRecognition_MobileNetV3",
        "quality_model": "FoodQuality_MobileNetV3",
        "food_classes": FOOD_CLASSES,
        "quality_classes": QUALITY_CLASSES,
        "database": "MongoDB",
    }


# ============================================================
# AUTHENTICATION
# ============================================================

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


PASSWORD_ITERATIONS = 310000


def hash_password(password: str) -> str:

    salt = secrets.token_bytes(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PASSWORD_ITERATIONS,
    )

    return (
        f"pbkdf2_sha256${PASSWORD_ITERATIONS}$"
        f"{salt.hex()}${password_hash.hex()}"
    )


def verify_password(
    password: str,
    stored_hash: str
) -> bool:

    try:

        algorithm, iterations, salt_hex, hash_hex = (
            stored_hash.split("$")
        )

        if algorithm != "pbkdf2_sha256":
            return False

        password_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt_hex),
            int(iterations),
        )

        return hmac.compare_digest(
            password_hash.hex(),
            hash_hex,
        )

    except Exception:
        return False


@app.post("/auth/signup")
def signup(data: SignupRequest):

    name = data.name.strip()
    email = data.email.strip().lower()
    password = data.password

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required.",
        )

    if (
        "@" not in email
        or "." not in email.split("@")[-1]
    ):
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid email address.",
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters.",
        )

    existing_user = users_collection.find_one({
        "email": email
    })

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

        user_document = {
         "name": name,
         "email": email,
         "password_hash": hash_password(password),
         "photo": None,
         "created_at": datetime.now(timezone.utc),
        }

    try:

        insert_result = users_collection.insert_one(
            user_document
        )

        return {
            "success": True,
            "message": "Account created successfully.",
            "user": {
                "id": str(insert_result.inserted_id),
                "name": name,
                "email": email,
            },
        }

    except Exception as error:

        print("Signup error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to create account.",
        )


@app.post("/auth/login")
def login(data: LoginRequest):

    email = data.email.strip().lower()
    password = data.password

    if not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Email and password are required.",
        )

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    password_hash = user.get("password_hash")

    if not password_hash or not verify_password(
        password,
        password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    return {
        "success": True,
        "message": "Login successful.",
        "user": {
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
        },
    }


# ============================================================
# MODEL INFO
# ============================================================

@app.get("/model-info")
def model_info():

    return {
        "recognition_model": "FoodRecognition_MobileNetV3",
        "quality_model": "FoodQuality_MobileNetV3",
        "food_classes": FOOD_CLASSES,
        "quality_classes": QUALITY_CLASSES,
        "image_size": IMAGE_SIZE,
        "food_confidence_threshold": CONFIDENCE_THRESHOLD,
        "quality_confidence_threshold":
            QUALITY_CONFIDENCE_THRESHOLD,
    }


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

def preprocess_image(image: Image.Image):

    image = image.convert("RGB")

    image = image.resize(IMAGE_SIZE)

    image_array = np.array(
        image,
        dtype=np.float32
    )

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    return image_array


# ============================================================
# FOOD RECOGNITION
# ============================================================

def predict_food(image: Image.Image):

    image_array = preprocess_image(image)

    predictions = recognition_model.predict(
        image_array,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(predictions)
    )

    confidence = float(
        predictions[predicted_index]
    )

    predicted_food = FOOD_CLASSES[
        predicted_index
    ]

    confidence_percent = round(
        confidence * 100,
        2
    )

    if confidence < CONFIDENCE_THRESHOLD:

        return {
            "food": "Unknown",
            "confidence": confidence_percent,
            "status": "Unable to Analyze",
        }

    return {
        "food": predicted_food,
        "confidence": confidence_percent,
        "status": "Recognized",
    }


# ============================================================
# DEBUG FOOD PREDICTIONS
# ============================================================

def get_food_prediction_details(
    image: Image.Image
):

    image_array = preprocess_image(image)

    predictions = recognition_model.predict(
        image_array,
        verbose=0
    )[0]

    ranked_indices = np.argsort(
        predictions
    )[::-1]

    results = []

    for index in ranked_indices:

        results.append({
            "food": FOOD_CLASSES[int(index)],
            "confidence": round(
                float(predictions[index]) * 100,
                2
            )
        })

    top_confidence = float(
        predictions[ranked_indices[0]]
    )

    second_confidence = float(
        predictions[ranked_indices[1]]
    )

    margin = (
        top_confidence -
        second_confidence
    )

    return {
        "predictions": results,

        "top_prediction": FOOD_CLASSES[
            int(ranked_indices[0])
        ],

        "top_confidence": round(
            top_confidence * 100,
            2
        ),

        "second_prediction": FOOD_CLASSES[
            int(ranked_indices[1])
        ],

        "second_confidence": round(
            second_confidence * 100,
            2
        ),

        "prediction_margin": round(
            margin * 100,
            2
        ),
    }


# ============================================================
# DEBUG PREDICTION API
# ============================================================

@app.post("/predict-debug")
async def predict_debug(
    file: UploadFile = File(...)
):

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file.",
        )

    try:

        image_bytes = await file.read()

        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty.",
            )

        image = Image.open(
            BytesIO(image_bytes)
        )

        debug_result = get_food_prediction_details(
            image
        )

        return {
            "success": True,
            "filename": file.filename,
            "model": "FoodRecognition_MobileNetV3",
            "supported_classes": FOOD_CLASSES,
            **debug_result,
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Debug prediction error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to debug prediction.",
        )


# ============================================================
# QUALITY DEBUG API
# ============================================================

@app.post("/quality-debug")
async def quality_debug(
    file: UploadFile = File(...)
):

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file.",
        )

    try:

        image_bytes = await file.read()

        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty.",
            )

        image = Image.open(
            BytesIO(image_bytes)
        ).convert("RGB")

        image_array = preprocess_image(
            image
        )

        predictions = quality_model.predict(
            image_array,
            verbose=0
        )[0]

        ranked_indices = np.argsort(
            predictions
        )[::-1]

        results = []

        for index in ranked_indices:

            results.append({
                "quality_class":
                    QUALITY_CLASSES[int(index)],

                "confidence":
                    round(
                        float(
                            predictions[index]
                        ) * 100,
                        2
                    )
            })

        top_index = int(
            ranked_indices[0]
        )

        top_class = QUALITY_CLASSES[
            top_index
        ]

        top_confidence = round(
            float(
                predictions[top_index]
            ) * 100,
            2
        )

        return {
            "success": True,
            "filename": file.filename,
            "model": "FoodQuality_MobileNetV3",
            "quality_predictions": results,
            "top_prediction": top_class,
            "top_confidence": top_confidence,
            "threshold": QUALITY_CONFIDENCE_THRESHOLD,
            "supported_classes": QUALITY_CLASSES,
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Quality debug error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ============================================================
# QUALITY RECOGNITION
# ============================================================

def predict_quality(
    image: Image.Image,
    recognized_food: str
):

    supported_foods = {

        "apple": [
            "freshapples",
            "rottenapples"
        ],

        "banana": [
            "freshbanana",
            "rottenbanana"
        ],

        "orange": [
            "freshoranges",
            "rottenoranges"
        ],
    }

    if recognized_food not in supported_foods:

        return {
            "quality": "Unavailable",
            "confidence": None,
            "status": "Unable to Analyze",
            "reason": (
                f"Quality analysis is not available "
                f"for {recognized_food}."
            ),
        }

    image_array = preprocess_image(
        image
    )

    predictions = quality_model.predict(
        image_array,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(predictions)
    )

    confidence = float(
        predictions[predicted_index]
    )

    predicted_quality_class = (
        QUALITY_CLASSES[predicted_index]
    )

    confidence_percent = round(
        confidence * 100,
        2
    )

    expected_classes = supported_foods[
        recognized_food
    ]

    if predicted_quality_class not in expected_classes:

        return {
            "quality": "Unknown",
            "confidence": confidence_percent,
            "status": "Unable to Analyze",
            "reason": (
                "The quality model prediction "
                "does not match the recognized food."
            ),
        }

    if confidence < QUALITY_CONFIDENCE_THRESHOLD:

        return {
            "quality": "Unknown",
            "confidence": confidence_percent,
            "status": "Unable to Analyze",
            "reason": (
                "The quality model could not "
                "provide a reliable assessment."
            ),
        }

    if predicted_quality_class.startswith(
        "fresh"
    ):

        quality = "Fresh"

    elif predicted_quality_class.startswith(
        "rotten"
    ):

        quality = "Rotten"

    else:

        quality = "Unknown"

    return {
        "quality": quality,
        "confidence": confidence_percent,
        "status": "Analyzed",
        "reason": (
            f"Quality classified as {quality}."
        ),
    }


# ============================================================
# VISUAL QUALITY
# ============================================================

def analyze_visual_quality(
    image: Image.Image
):

    try:

        features = extract_visual_features(
            image
        )

        return features

    except Exception as error:

        print(
            "Visual feature extraction error:",
            error
        )

        return {}


# ============================================================
# MAIN PREDICTION API
# ============================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file.",
        )

    try:

        image_bytes = await file.read()

        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty.",
            )

        image = Image.open(
            BytesIO(image_bytes)
        )

        # STEP 1 - FOOD RECOGNITION

        food_result = predict_food(
            image
        )

        # STEP 2 - QUALITY ASSESSMENT

        if food_result["food"] == "Unknown":

            quality_result = {
                "quality": "Unknown",
                "confidence": None,
                "status": "Unable to Analyze",
                "reason": (
                    "Food could not be recognized "
                    "with sufficient confidence."
                ),
            }

        else:

            quality_result = predict_quality(
                image,
                food_result["food"]
            )

        # STEP 3 - VISUAL FEATURES

        visual_features = (
            analyze_visual_quality(image)
        )

        # FINAL RESULT

        result = {
            "success": True,
            "filename": file.filename,

            "food":
                food_result["food"],

            "food_confidence":
                food_result["confidence"],

            "food_status":
                food_result["status"],

            "quality":
                quality_result["quality"],

            "quality_confidence":
                quality_result["confidence"],

            "quality_status":
                quality_result["status"],

            "quality_reason":
                quality_result["reason"],

            "visual_analysis":
                make_json_safe(
                    visual_features
                ),
        }

        # SAVE SCAN TO MONGODB

        scan_document = {

            "filename":
                file.filename,

            "food":
                food_result["food"],

            "food_confidence":
                food_result["confidence"],

            "food_status":
                food_result["status"],

            "quality":
                quality_result["quality"],

            "quality_confidence":
                quality_result["confidence"],

            "quality_status":
                quality_result["status"],

            "quality_reason":
                quality_result["reason"],

            "visual_analysis":
                make_json_safe(
                    visual_features
                ),

            "created_at":
                datetime.now(timezone.utc),
        }

        try:

            insert_result = (
                scans_collection.insert_one(
                    scan_document
                )
            )

            result["scan_id"] = str(
                insert_result.inserted_id
            )

            print(
                f"✓ Scan saved to MongoDB: "
                f"{insert_result.inserted_id}"
            )

        except Exception as db_error:

            print(
                "⚠ MongoDB save error:",
                db_error
            )

            result["scan_id"] = None

        return result

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Prediction error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to process the image.",
        )


# ============================================================
# HISTORY API
# ============================================================

@app.get("/history")
def get_history():

    try:

        scans = list(
            scans_collection
            .find()
            .sort("created_at", -1)
        )

        history = []

        for scan in scans:

            history.append({

                "id": str(
                    scan["_id"]
                ),

                "filename":
                    scan.get("filename"),

                "food":
                    scan.get("food"),

                "food_confidence":
                    scan.get("food_confidence"),

                "food_status":
                    scan.get("food_status"),

                "quality":
                    scan.get("quality"),

                "quality_confidence":
                    scan.get(
                        "quality_confidence"
                    ),

                "quality_status":
                    scan.get(
                        "quality_status"
                    ),

                "quality_reason":
                    scan.get(
                        "quality_reason"
                    ),

                "visual_analysis":
                    scan.get(
                        "visual_analysis",
                        {}
                    ),

                "created_at":
                    scan.get("created_at"),
            })

        return {
            "success": True,
            "count": len(history),
            "scans": history,
        }

    except Exception as error:

        print(
            "History error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch scan history.",
        )


# ============================================================
# DELETE HISTORY ITEM
# ============================================================

@app.delete("/history/{scan_id}")
def delete_history(
    scan_id: str
):

    try:

        if not ObjectId.is_valid(scan_id):

            raise HTTPException(
                status_code=400,
                detail="Invalid scan ID.",
            )

        result = (
            scans_collection.delete_one({
                "_id":
                    ObjectId(scan_id)
            })
        )

        if result.deleted_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Scan not found.",
            )

        return {
            "success": True,
            "message":
                "Scan deleted successfully.",
            "id":
                scan_id,
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Delete history error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to delete scan.",
        )


# ============================================================
# DASHBOARD STATS
# ============================================================

@app.get("/dashboard-stats")
def dashboard_stats():

    try:

        total_scans = (
            scans_collection.count_documents({})
        )

        fresh_food = (
            scans_collection.count_documents({
                "quality": "Fresh"
            })
        )

        needs_attention = (
            scans_collection.count_documents({
                "quality": {
                    "$in": [
                        "Rotten",
                        "Unknown",
                        "Unavailable"
                    ]
                }
            })
        )

        recognized_scans = list(
            scans_collection.find(
                {
                    "food_confidence": {
                        "$ne": None
                    }
                },
                {
                    "food_confidence": 1
                }
            )
        )

        if recognized_scans:

            average_confidence = round(

                sum(
                    scan.get(
                        "food_confidence",
                        0
                    )

                    for scan in recognized_scans
                )

                /

                len(recognized_scans),

                2
            )

        else:

            average_confidence = 0

        return {
            "success": True,

            "total_scans":
                total_scans,

            "fresh_food":
                fresh_food,

            "needs_attention":
                needs_attention,

            "average_confidence":
                average_confidence,
        }

    except Exception as error:

        print(
            "Dashboard stats error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch dashboard statistics.",
        )


# ============================================================
# VISUAL ANALYSIS ONLY
# ============================================================

@app.post("/visual-analysis")
async def visual_analysis(
    file: UploadFile = File(...)
):

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file.",
        )

    try:

        image_bytes = await file.read()

        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty.",
            )

        image = Image.open(
            BytesIO(image_bytes)
        )

        features = (
            analyze_visual_quality(image)
        )

        return {
            "success": True,
            "filename":
                file.filename,
            "visual_analysis":
                make_json_safe(features),
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Visual analysis error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to analyze the image.",
        )


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "ai.app:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )