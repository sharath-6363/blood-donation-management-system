import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_synthetic_donor_data(num_samples=1000):
    np.random.seed(42)
    random.seed(42)
    
    data = []
    
    blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    genders = ['MALE', 'FEMALE']
    fitness_levels = ['LOW', 'MEDIUM', 'HIGH']
    
    for i in range(num_samples):
        age = np.random.randint(18, 66)
        gender = random.choice(genders)
        blood_group = random.choice(blood_groups)
        
        # Generate realistic donor data
        weight = np.random.normal(70, 15) if gender == 'MALE' else np.random.normal(60, 12)
        weight = max(45, min(weight, 120))  # Reasonable weight range
        
        height = np.random.normal(175, 8) if gender == 'MALE' else np.random.normal(162, 7)
        height = max(150, min(height, 200))
        
        total_donations = np.random.poisson(3)  # Most donors have few donations
        months_since_last = np.random.exponential(12)  # Most recent within a year
        
        # Medical parameters
        hemoglobin_level = np.random.normal(14.5, 1.5) if gender == 'MALE' else np.random.normal(13.5, 1.5)
        hemoglobin_level = max(10, min(hemoglobin_level, 18))
        
        bp_systolic = np.random.normal(120, 15)
        bp_diastolic = np.random.normal(80, 10)
        
        # Health conditions (realistic probabilities)
        has_chronic_disease = np.random.random() < 0.15
        on_medication = np.random.random() < 0.25
        is_smoker = np.random.random() < 0.2
        is_alcoholic = np.random.random() < 0.1
        
        fitness_level = random.choice(fitness_levels)
        
        # Eligibility criteria (real medical rules)
        eligible = True
        
        # Medical disqualifications
        if hemoglobin_level < 12.5 or hemoglobin_level > 17.5:
            eligible = False
        if bp_systolic > 180 or bp_systolic < 90 or bp_diastolic > 100 or bp_diastolic < 50:
            eligible = False
        if weight < 50:  # Minimum weight requirement
            eligible = False
        if age < 18 or age > 65:
            eligible = False
        if months_since_last < 3:  # Minimum gap between donations
            eligible = False
        if has_chronic_disease and np.random.random() < 0.7:  # Most chronic diseases disqualify
            eligible = False
        if is_smoker and np.random.random() < 0.3:  # Smoking can affect eligibility
            eligible = False
            
        donor = {
            'name': f'Donor_{i+1}',
            'age': age,
            'gender': gender,
            'blood_group': blood_group,
            'weight': round(weight, 1),
            'height': round(height, 1),
            'total_donations': total_donations,
            'months_since_last': int(months_since_last),
            'hemoglobin_level': round(hemoglobin_level, 1),
            'blood_pressure_systolic': int(bp_systolic),
            'blood_pressure_diastolic': int(bp_diastolic),
            'has_chronic_disease': has_chronic_disease,
            'on_medication': on_medication,
            'is_smoker': is_smoker,
            'is_alcoholic': is_alcoholic,
            'fitness_level': fitness_level,
            'eligible': eligible
        }
        
        data.append(donor)
    
    return pd.DataFrame(data)

# Generate and save data
if __name__ == "__main__":
    df = generate_synthetic_donor_data(1000)
    df.to_csv('synthetic_donor_data.csv', index=False)
    print(f"Generated {len(df)} synthetic donor records")
    print(f"Eligible donors: {df['eligible'].sum()} ({df['eligible'].mean()*100:.1f}%)")
    print("\nSample data:")
    print(df.head())