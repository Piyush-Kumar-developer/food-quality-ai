from pathlib import Path


# --------------------------------------------------
# PROJECT PATHS
# --------------------------------------------------

AI_DIR = Path(__file__).resolve().parent

DATASET_DIR = AI_DIR / "dataset"
RAW_DATA_DIR = DATASET_DIR / "raw"
PROCESSED_DATA_DIR = DATASET_DIR / "processed"
TEST_DATA_DIR = DATASET_DIR / "test"

MODELS_DIR = AI_DIR / "models"
SCRIPTS_DIR = AI_DIR / "scripts"


# --------------------------------------------------
# MODEL SETTINGS
# --------------------------------------------------

IMAGE_SIZE = (224, 224)

BATCH_SIZE = 32

RANDOM_SEED = 42


# --------------------------------------------------
# CONFIDENCE SETTINGS
# --------------------------------------------------

# Below this confidence, the system should prefer
# UNKNOWN instead of forcing a prediction.

FOOD_CONFIDENCE_THRESHOLD = 0.75
QUALITY_CONFIDENCE_THRESHOLD = 0.75


# --------------------------------------------------
# SUPPORTED FOOD CATEGORIES
# --------------------------------------------------

FOOD_CATEGORIES = [
    "fruits_vegetables",
    "dairy_eggs",
    "bakery",
    "biscuits_snacks",
    "grains_pulses",
    "packaged_food",
    "beverages",
    "spices_condiments",
    "street_food",
    "restaurant_food",
    "fast_food",
    "desserts",
]


# --------------------------------------------------
# QUALITY STATES
# --------------------------------------------------

QUALITY_STATES = [
    "fresh",
    "good",
    "needs_attention",
    "defective",
    "rotten",
    "unknown",
]