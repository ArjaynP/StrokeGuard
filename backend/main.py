from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
import torch
from model_loader import model, scaler, feature_columns

app = FastAPI(title="StrokeGuard API", version="1.0.0")

# ── CORS — allow Next.js frontend to talk to this server ─────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Input Schema ──────────────────────────────────────────────────────
class PatientData(BaseModel):
    gender: str             = Field(..., example="Male")
    age: float              = Field(..., example=67.0)
    hypertension: int       = Field(..., example=0)
    heart_disease: int      = Field(..., example=1)
    ever_married: str       = Field(..., example="Yes")
    work_type: str          = Field(..., example="Private")
    Residence_type: str     = Field(..., example="Urban")
    avg_glucose_level: float = Field(..., example=228.69)
    bmi: float              = Field(..., example=36.6)
    smoking_status: str     = Field(..., example="formerly smoked")

# ── Helper: preprocess input to match training pipeline ──────────────
def preprocess(data: PatientData) -> np.ndarray:
    # Build a single-row dataframe
    row = {
        "gender":            1 if data.gender == "Male" else 0,
        "age":               data.age,
        "hypertension":      data.hypertension,
        "heart_disease":     data.heart_disease,
        "ever_married":      1 if data.ever_married == "Yes" else 0,
        "Residence_type":    1 if data.Residence_type == "Urban" else 0,
        "avg_glucose_level": data.avg_glucose_level,
        "bmi":               data.bmi,
        # work_type one-hot
        "work_type_Govt_job":      1 if data.work_type == "Govt_job" else 0,
        "work_type_Never_worked":  1 if data.work_type == "Never_worked" else 0,
        "work_type_Private":       1 if data.work_type == "Private" else 0,
        "work_type_Self-employed": 1 if data.work_type == "Self-employed" else 0,
        "work_type_children":      1 if data.work_type == "children" else 0,
        # smoking_status one-hot
        "smoking_status_Unknown":         1 if data.smoking_status == "Unknown" else 0,
        "smoking_status_formerly smoked": 1 if data.smoking_status == "formerly smoked" else 0,
        "smoking_status_never smoked":    1 if data.smoking_status == "never smoked" else 0,
        "smoking_status_smokes":          1 if data.smoking_status == "smokes" else 0,
    }

    df = pd.DataFrame([row])

    # Reorder columns to exactly match training
    df = df.reindex(columns=feature_columns, fill_value=0)

    # Scale numerical columns
    num_cols = ["age", "avg_glucose_level", "bmi"]
    df[num_cols] = scaler.transform(df[num_cols])

    return df.values.astype(np.float32)

# ── Routes ────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "model": "StrokeGuard v1.0"}


@app.post("/predict")
def predict(data: PatientData):
    try:
        features = preprocess(data)
        tensor   = torch.FloatTensor(features)

        with torch.no_grad():
            prob = model(tensor).item()

        risk_percent = round(prob * 100, 2)

        if risk_percent < 30:
            risk_level = "Low"
        elif risk_percent < 60:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        return {
            # v0 frontend expects these field names
            "riskPercentage": round(prob * 100),
            "riskLevel": risk_level.upper(),
            "contributingFactors": [
                {"name": "Age", "value": round(prob * 100), "impact": 25},
                {"name": "Glucose Level", "value": round(prob * 100), "impact": 20},
                {"name": "BMI", "value": round(prob * 100), "impact": 15},
                {"name": "Hypertension", "value": round(prob * 100), "impact": 13},
                {"name": "Heart Disease", "value": round(prob * 100), "impact": 13},
                {"name": "Smoking", "value": round(prob * 100), "impact": 10},
            ],
            # Keep originals too
            "risk_score": risk_percent,
            "risk_level": risk_level,
            "probability": prob,
            "message": f"Estimated stroke risk: {risk_percent}%"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))