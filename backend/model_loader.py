import torch
import torch.nn as nn
import joblib
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / "model"

# ── Model Architecture (must match train.py exactly) ─────────────────
class StrokeNet(nn.Module):
    def __init__(self, input_dim):
        super(StrokeNet, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.4),

            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.4),

            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(64, 32),
            nn.ReLU(),

            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.network(x)


def load_model():
    metadata     = joblib.load(MODEL_DIR / "model_metadata.pkl")
    input_dim    = metadata["input_dim"]
    model        = StrokeNet(input_dim)
    model.load_state_dict(torch.load(
        MODEL_DIR / "stroke_model.pt",
        map_location="cpu",
        weights_only=True
    ))
    model.eval()
    return model


def load_artifacts():
    scaler          = joblib.load(MODEL_DIR / "scaler.pkl")
    feature_columns = joblib.load(MODEL_DIR / "feature_columns.pkl")
    return scaler, feature_columns


# Load once at startup — reused across all requests
model           = load_model()
scaler, feature_columns = load_artifacts()