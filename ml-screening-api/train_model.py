from __future__ import annotations

import argparse
from pathlib import Path

from model import MODEL_PATH, train_and_save_model


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train and save the screening model bundle.")
    parser.add_argument(
        "--output",
        type=Path,
        default=MODEL_PATH,
        help="Output path for model bundle (default: model.joblib).",
    )
    parser.add_argument(
        "--sample-size",
        type=int,
        default=5000,
        help="Number of synthetic training samples to generate.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for synthetic data generation.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    bundle = train_and_save_model(
        model_path=args.output,
        sample_size=args.sample_size,
        seed=args.seed,
    )
    print(
        "Saved model bundle to {path} (version={version}, threshold={threshold}).".format(
            path=args.output,
            version=bundle.model_version,
            threshold=bundle.threshold,
        )
    )


if __name__ == "__main__":
    main()

