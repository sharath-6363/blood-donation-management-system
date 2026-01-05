import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

def train_model():
    # Load synthetic data
    df = pd.read_csv('synthetic_donor_data.csv')
    
    # Prepare features and target
    feature_columns = [
        'age', 'weight', 'height', 'total_donations', 'months_since_last',
        'hemoglobin_level', 'blood_pressure_systolic', 'blood_pressure_diastolic',
        'has_chronic_disease', 'on_medication', 'is_smoker', 'is_alcoholic'
    ]
    
    # Encode categorical features
    df_encoded = df.copy()
    le_fitness = LabelEncoder()
    le_gender = LabelEncoder()
    
    df_encoded['fitness_level_encoded'] = le_fitness.fit_transform(df['fitness_level'])
    df_encoded['gender_encoded'] = le_gender.fit_transform(df['gender'])
    
    feature_columns.extend(['fitness_level_encoded', 'gender_encoded'])
    
    X = df_encoded[feature_columns]
    y = df_encoded['eligible']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    # Save model and scaler
    joblib.dump(model, 'model.joblib')
    joblib.dump(scaler, 'scaler.joblib')
    joblib.dump(feature_columns, 'feature_columns.joblib')
    joblib.dump(le_fitness, 'label_encoder_fitness.joblib')
    joblib.dump(le_gender, 'label_encoder_gender.joblib')
    
    print("\nModel and preprocessing objects saved successfully!")
    
    return model, scaler, accuracy

if __name__ == "__main__":
    train_model()