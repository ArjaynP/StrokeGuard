# StrokeGuard

StrokeGuard is a stroke risk prediction project with:
- `ml/` for training and evaluation
- `backend/` for the FastAPI prediction API
- `frontend-ui/` for the Next.js TypeScript UI

## Backend Setup (FastAPI)

From the project root:

1. Create and activate backend virtual environment:
	- `cd backend`
	- `/opt/anaconda3/bin/python3.9 -m venv .venv`
	- `source .venv/bin/activate`

2. Install dependencies:
	- `pip install -r requirements.txt`

3. Ensure model artifacts exist in `backend/model/`:
	- `stroke_model.pt`
	- `model_metadata.pkl`
	- `scaler.pkl`
	- `feature_columns.pkl`

4. Run the API:
	- `python -m uvicorn main:app --reload --port 8000`

5. Verify health endpoint:
	- `curl http://127.0.0.1:8000/health`

Expected response:
- `{"status":"ok","model":"StrokeGuard v1.0"}`

## Notes

- If port 8000 is busy, stop the old process and restart.
- Use `python -m uvicorn ...` (not global `uvicorn`) to ensure the backend venv is used.
