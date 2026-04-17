# StrokeGuard

StrokeGuard is a full-stack stroke risk assessment application. It combines a machine learning model trained on stroke-related health data, a FastAPI inference service that exposes the model through an HTTP API, and a Next.js frontend that guides a user through an assessment and presents the result in a readable way.

The project is organized into three main parts:

- `frontend-ui/` provides the user interface and assessment flow.
- `backend/` serves predictions from the trained model.
- `ml/` contains the training and evaluation workflow used to produce the model artifacts.

## Project Structure

### Frontend (`frontend-ui/`)

The frontend is a Next.js application built with TypeScript. Its job is to collect patient information, submit it for inference, and present the risk score and contributing factors.

Key responsibilities:

- Renders the landing page, multi-step assessment form, and results screen.
- Validates user inputs before submission.
- Sends assessment data to the local prediction endpoint at `app/api/predict/route.ts`.
- Displays a risk percentage, risk level, and supporting factors in the results view.
- Falls back to a mock prediction if the backend is unavailable, which keeps the UI usable during frontend-only development.

In practice, the user journey is:

1. Open the landing page.
2. Complete the assessment form at `/assess`.
3. Submit the form.
4. View the generated risk summary at `/results`.

### Backend (`backend/`)

The backend is a FastAPI service that loads the trained PyTorch model and exposes prediction endpoints for the frontend.

Key responsibilities:

- Accepts structured patient data through the `/predict` endpoint.
- Converts incoming values into the same feature layout used during model training.
- Applies saved preprocessing artifacts such as the scaler and feature column ordering.
- Runs inference with the trained neural network.
- Returns a frontend-friendly response containing risk percentage, risk level, and contributing-factor placeholders.
- Exposes a `/health` endpoint for service checks.

The backend depends on model artifacts stored in `backend/model/`, including:

- `stroke_model.pt`
- `model_metadata.pkl`
- `scaler.pkl`
- `feature_columns.pkl`

### Machine Learning (`ml/`)

The `ml/` directory contains the offline workflow used to train and assess the prediction model.

Key responsibilities:

- Loads the stroke dataset from `ml/data/`.
- Uses preprocessed training and test arrays stored in `ml/model/`.
- Trains a PyTorch neural network in `train.py`.
- Saves the trained weights and metadata needed by the backend.
- Evaluates model quality in `evaluate.py` using classification metrics, threshold tuning, a confusion matrix, and an ROC curve.
- Includes exploratory analysis in `ml/notebooks/eda.ipynb`.

This part of the project is not served directly to end users. Its output is the trained model and supporting preprocessing artifacts that the backend loads for real-time inference.

## How The Parts Work Together

StrokeGuard works as a simple three-stage pipeline:

1. The ML workflow trains a model and produces artifacts.
2. The backend loads those artifacts and exposes them through a prediction API.
3. The frontend collects user input and calls that API to display results.

Request flow:

1. A user fills out the assessment form in the Next.js frontend.
2. The frontend posts the data to `frontend-ui/app/api/predict/route.ts`.
3. That route proxies the request to the FastAPI backend at `http://localhost:8000/predict`.
4. The backend preprocesses the input, runs the PyTorch model, and returns a prediction.
5. The frontend stores the response and renders the results page.

This separation keeps the interface, inference service, and model development workflow independent, which makes the project easier to develop and maintain.

## Local Development

### 1. Start the backend

From the project root:

```bash
cd backend
/opt/anaconda3/bin/python3.9 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Optional health check:

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok","model":"StrokeGuard v1.0"}
```

### 2. Start the frontend

In a new terminal:

```bash
cd frontend-ui
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

### 3. Train or evaluate the model

If you need to work on the ML pipeline:

```bash
cd ml
pip install -r requirements.txt
python train.py
python evaluate.py
```

If you retrain the model, copy the generated artifacts needed for inference into `backend/model/` before starting the API.

## Notes

- The frontend can still function with mock results if the backend is down, but real predictions require the FastAPI service.
- The backend model architecture must stay aligned with the artifacts produced by the ML pipeline.
- This project is for educational or demonstration use and should not be treated as a medical diagnosis tool.
