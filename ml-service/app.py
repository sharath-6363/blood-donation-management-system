from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from typing import List, Optional

app = FastAPI(title="Blood Donation Prediction API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and preprocessing objects
try:
    model = joblib.load('model.joblib')
    scaler = joblib.load('scaler.joblib')
    feature_columns = joblib.load('feature_columns.joblib')
    le_fitness = joblib.load('label_encoder_fitness.joblib')
    le_gender = joblib.load('label_encoder_gender.joblib')
    print("Model and preprocessing objects loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = scaler = feature_columns = le_fitness = le_gender = None

# Request models
class DonorFeatures(BaseModel):
    months_since_last: int
    total_donations: int
    age: int
    hemoglobin_level: float
    weight: float
    height: float
    has_chronic_disease: bool
    on_medication: bool
    is_smoker: bool
    is_alcoholic: bool
    fitness_level: str
    gender: str
    blood_pressure_systolic: Optional[int] = 120
    blood_pressure_diastolic: Optional[int] = 80

class BatchPredictionRequest(BaseModel):
    donors: List[DonorFeatures]

class PredictionResponse(BaseModel):
    probability: float
    label: bool
    message: str

@app.get("/")
def read_root():
    return {"message": "Blood Donation Prediction API", "status": "active"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_donation(features: DonorFeatures):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please run TRAIN_MODEL.bat first")
    
    try:
        # Normalize fitness level and gender
        fitness_map = {'LOW': 'LOW', 'MEDIUM': 'MEDIUM', 'HIGH': 'HIGH', 'low': 'LOW', 'medium': 'MEDIUM', 'high': 'HIGH'}
        gender_map = {'MALE': 'MALE', 'FEMALE': 'FEMALE', 'male': 'MALE', 'female': 'FEMALE'}
        
        fitness = fitness_map.get(features.fitness_level, 'MEDIUM')
        gender = gender_map.get(features.gender, 'MALE')
        
        # Prepare features for prediction
        input_data = {
            'age': features.age,
            'weight': features.weight,
            'height': features.height,
            'total_donations': features.total_donations,
            'months_since_last': features.months_since_last,
            'hemoglobin_level': features.hemoglobin_level,
            'blood_pressure_systolic': features.blood_pressure_systolic,
            'blood_pressure_diastolic': features.blood_pressure_diastolic,
            'has_chronic_disease': int(features.has_chronic_disease),
            'on_medication': int(features.on_medication),
            'is_smoker': int(features.is_smoker),
            'is_alcoholic': int(features.is_alcoholic),
            'fitness_level_encoded': le_fitness.transform([fitness])[0],
            'gender_encoded': le_gender.transform([gender])[0]
        }
        
        # Create feature array in correct order
        feature_array = np.array([[input_data[col] for col in feature_columns]])
        
        # Scale features and predict
        scaled_features = scaler.transform(feature_array)
        probability = model.predict_proba(scaled_features)[0][1]
        label = probability >= 0.5
        
        # Generate message based on prediction
        if label:
            message = "This donor is likely eligible for blood donation"
        else:
            message = "This donor may not be eligible for blood donation"
        
        return PredictionResponse(
            probability=round(probability, 4),
            label=bool(label),
            message=message
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict-batch")
async def predict_batch_donation(batch_request: BatchPredictionRequest):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        predictions = []
        
        for donor in batch_request.donors:
            # Prepare features for each donor
            input_data = {
                'age': donor.age,
                'weight': donor.weight,
                'height': donor.height,
                'total_donations': donor.total_donations,
                'months_since_last': donor.months_since_last,
                'hemoglobin_level': donor.hemoglobin_level,
                'blood_pressure_systolic': donor.blood_pressure_systolic or 120,
                'blood_pressure_diastolic': donor.blood_pressure_diastolic or 80,
                'has_chronic_disease': int(donor.has_chronic_disease),
                'on_medication': int(donor.on_medication),
                'is_smoker': int(donor.is_smoker),
                'is_alcoholic': int(donor.is_alcoholic),
                'fitness_level_encoded': le_fitness.transform([donor.fitness_level])[0],
                'gender_encoded': le_gender.transform([donor.gender])[0]
            }
            
            # Create feature array
            feature_array = np.array([[input_data[col] for col in feature_columns]])
            scaled_features = scaler.transform(feature_array)
            probability = model.predict_proba(scaled_features)[0][1]
            label = probability >= 0.5
            
            predictions.append({
                'probability': round(probability, 4),
                'label': bool(label),
                'message': "Eligible" if label else "Not Eligible"
            })
        
        return {
            "predictions": predictions,
            "total_donors": len(predictions),
            "eligible_count": sum(1 for p in predictions if p['label'])
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Batch prediction error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)