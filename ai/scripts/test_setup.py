from pathlib import Path
import sys


# --------------------------------------------------
# ADD AI DIRECTORY TO PYTHON PATH
# --------------------------------------------------

AI_DIR = Path(__file__).resolve().parent.parent

if str(AI_DIR) not in sys.path:
    sys.path.insert(0, str(AI_DIR))


# --------------------------------------------------
# IMPORT PROJECT CONFIG
# --------------------------------------------------

from config import (
    DATASET_DIR,
    MODELS_DIR,
    IMAGE_SIZE,
    FOOD_CONFIDENCE_THRESHOLD,
    QUALITY_CONFIDENCE_THRESHOLD,
    FOOD_CATEGORIES,
    QUALITY_STATES,
)


def main():
    print("=" * 60)
    print("FOOD QUALITY AI - SETUP TEST")
    print("=" * 60)

    print(f"AI Directory       : {AI_DIR}")
    print(f"Dataset Directory  : {DATASET_DIR}")
    print(f"Models Directory   : {MODELS_DIR}")
    print(f"Image Size         : {IMAGE_SIZE}")
    print(f"Food Threshold     : {FOOD_CONFIDENCE_THRESHOLD}")
    print(f"Quality Threshold  : {QUALITY_CONFIDENCE_THRESHOLD}")

    print("\nFood Categories:")

    for category in FOOD_CATEGORIES:
        print(f"  - {category}")

    print("\nQuality States:")

    for state in QUALITY_STATES:
        print(f"  - {state}")

    print("\nChecking folders...")

    required_folders = [
        DATASET_DIR,
        MODELS_DIR,
    ]

    for folder in required_folders:
        if Path(folder).exists():
            print(f"  ✓ {folder}")
        else:
            print(f"  ✗ Missing: {folder}")

    print("\nSetup test completed successfully.")
    print("=" * 60)


if __name__ == "__main__":
    main()