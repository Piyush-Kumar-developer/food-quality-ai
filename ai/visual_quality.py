from pathlib import Path

import cv2
import numpy as np


IMAGE_SIZE = (224, 224)


def load_image(image_path: str):
    """
    Load an image from disk.
    """

    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    image = cv2.imread(str(path))

    if image is None:
        raise ValueError("Unable to read image.")

    return image


def extract_visual_features(image):
    """
    Extract basic visual features from an image.

    These features will later be used by the
    food quality assessment system.
    """

    # Resize
    resized = cv2.resize(image, IMAGE_SIZE)

    # Convert BGR -> RGB
    rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)

    # -----------------------------
    # 1. Brightness
    # -----------------------------
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

    brightness = float(np.mean(gray))

    # -----------------------------
    # 2. Contrast
    # -----------------------------
    contrast = float(np.std(gray))

    # -----------------------------
    # 3. Color statistics
    # -----------------------------
    mean_rgb = np.mean(rgb, axis=(0, 1))

    red_mean = float(mean_rgb[0])
    green_mean = float(mean_rgb[1])
    blue_mean = float(mean_rgb[2])

    # -----------------------------
    # 4. Saturation
    # -----------------------------
    hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)

    saturation = float(np.mean(hsv[:, :, 1]))

    # -----------------------------
    # 5. Sharpness
    # -----------------------------
    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # -----------------------------
    # 6. Edge density
    # -----------------------------
    edges = cv2.Canny(gray, 100, 200)

    edge_density = float(np.mean(edges > 0))

    return {
        "brightness": round(brightness, 2),
        "contrast": round(contrast, 2),
        "red_mean": round(red_mean, 2),
        "green_mean": round(green_mean, 2),
        "blue_mean": round(blue_mean, 2),
        "saturation": round(saturation, 2),
        "sharpness": round(sharpness, 2),
        "edge_density": round(edge_density, 4),
    }


def analyze_image(image_path: str):
    """
    Complete visual analysis.
    """

    image = load_image(image_path)

    features = extract_visual_features(image)

    return {
        "success": True,
        "features": features,
    }


if __name__ == "__main__":

    print("=" * 60)
    print("FOODAI VISUAL QUALITY ANALYZER")
    print("=" * 60)

    # Change this to any test image path
    TEST_IMAGE = "test.jpg"

    try:

        result = analyze_image(TEST_IMAGE)

        print("\nVisual analysis successful.\n")

        for key, value in result["features"].items():
            print(f"{key:15}: {value}")

    except Exception as error:

        print("\nERROR:")
        print(error)