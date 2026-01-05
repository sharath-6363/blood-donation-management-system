-- Blood Donation Management System Database Setup
-- Run this script in MySQL to recreate the database

-- Create database
DROP DATABASE IF EXISTS blood_donation;
CREATE DATABASE blood_donation;
USE blood_donation;

-- Donors table
CREATE TABLE donors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(20),
    blood_group VARCHAR(20),
    weight DOUBLE,
    height DOUBLE,
    contact_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    total_donations INT DEFAULT 0,
    last_donation_date DATE,
    months_since_last INT DEFAULT 0,
    hemoglobin_level DOUBLE,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    has_chronic_disease BOOLEAN DEFAULT FALSE,
    chronic_disease_details TEXT,
    on_medication BOOLEAN DEFAULT FALSE,
    medication_details TEXT,
    last_travel_date DATE,
    travel_history TEXT,
    is_smoker BOOLEAN DEFAULT FALSE,
    is_alcoholic BOOLEAN DEFAULT FALSE,
    fitness_level VARCHAR(20) DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    event_date DATE,
    start_time TIME,
    end_time TIME,
    target_donors INT DEFAULT 0,
    registered_donors INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data for testing
INSERT INTO donors (name, age, gender, blood_group, weight, height, contact_number, email, address, 
                    total_donations, months_since_last, hemoglobin_level, blood_pressure_systolic, 
                    blood_pressure_diastolic, has_chronic_disease, on_medication, is_smoker, 
                    is_alcoholic, fitness_level) 
VALUES 
('Sachin N', 25, 'MALE', 'O_POSITIVE', 65.0, 170.0, '6360775360', 'sachinsachinn648@gmail.com', 
 'mysore,nanjanagudu', 5, 5, 14.7, 130, 80, FALSE, FALSE, FALSE, FALSE, 'MEDIUM'),

('Sharath HN', 28, 'MALE', 'A_POSITIVE', 70.0, 175.0, '9876543210', 'sharathhn613@gmail.com', 
 'mysore', 3, 4, 15.2, 120, 75, FALSE, FALSE, FALSE, FALSE, 'HIGH'),

('Vishu', 24, 'MALE', 'B_POSITIVE', 68.0, 172.0, '9988776655', 'vishu13.krn@gmail.com', 
 'nanjangudu', 2, 6, 14.0, 125, 78, FALSE, FALSE, TRUE, FALSE, 'MEDIUM');

-- Sample events
INSERT INTO events (name, description, location, event_date, start_time, end_time, target_donors, status)
VALUES 
('Blood Donation Camp - Mysore', 'Annual blood donation drive', 'mysore,nanjangudu,kadakola,thandavapura', 
 '2025-02-15', '09:00:00', '17:00:00', 50, 'UPCOMING'),

('Emergency Blood Drive', 'Urgent blood requirement', 'mysore', 
 '2025-02-01', '10:00:00', '16:00:00', 30, 'UPCOMING');

-- Display created tables
SHOW TABLES;

-- Display sample data
SELECT * FROM donors;
SELECT * FROM events;

-- Success message
SELECT 'Database setup completed successfully!' AS Status;
