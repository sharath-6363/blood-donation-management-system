# Blood Donation Management System

A comprehensive full-stack application for managing blood donation events, donors, and predictions using Machine Learning. The system consists of a Spring Boot backend, React frontend, and a FastAPI ML service for donor prediction.

## 🌟 Features

- **Donor Management**: Register, view, and manage blood donors with detailed profiles
- **Event Management**: Create and manage blood donation events
- **ML-Powered Predictions**: Predict donor availability using machine learning algorithms
- **User Authentication**: Secure login and registration system
- **Notification System**: Automated notifications for donors and events
- **Bulk Operations**: Perform bulk operations on donor data
- **Responsive UI**: Modern React-based user interface with Bootstrap styling

## 🏗️ Architecture

The project follows a microservices architecture with three main components:

```
├── backend-spring/     # Spring Boot REST API
├── frontend-react/     # React.js Frontend
└── ml-service/         # FastAPI ML Service
```

## 🛠️ Technologies Used

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Java Version**: 17
- **Database**: MySQL
- **Dependencies**:
  - Spring Data JPA
  - Spring Web
  - Spring Mail
  - Spring Security (Crypto)
  - MySQL Connector

### Frontend (React)
- **Framework**: React 19.2.0
- **UI Library**: Bootstrap 5.3.8
- **HTTP Client**: Axios 1.12.2
- **Routing**: React Router DOM 7.9.4
- **Testing**: React Testing Library

### ML Service (FastAPI)
- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn 0.24.0
- **ML Libraries**: 
  - scikit-learn 1.3.2
  - pandas 2.1.3
  - numpy 1.25.2
  - joblib 1.3.2

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Java JDK 17** or higher
- **Node.js 16+** and npm
- **Python 3.8+**
- **MySQL 8.0+**
- **Maven 3.6+** (or use the Maven wrapper included)

## 🚀 Installation & Setup

### 1. Database Setup

First, create the MySQL database:

```bash
mysql -u root -p
```

Then run the database setup scripts:

```sql
source database_setup.sql
-- If needed, run the fix script
source fix_database.sql
```

### 2. Backend Setup (Spring Boot)

Navigate to the backend directory:

```bash
cd backend-spring
```

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blood_donation
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Build and run the Spring Boot application:

```bash
# Using Maven wrapper (recommended)
./mvnw clean install
./mvnw spring-boot:run

# OR using Maven
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup (React)

Navigate to the frontend directory:

```bash
cd frontend-react
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will start on `http://localhost:3000`

### 4. ML Service Setup (FastAPI)

Navigate to the ML service directory:

```bash
cd ml-service
```

Create a virtual environment (recommended):

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Train the model (if not already trained):

```bash
python train.py
```

Start the FastAPI server:

```bash
uvicorn app:app --reload --port 8000
```

The ML service will start on `http://localhost:8000`

## 📂 Project Structure

```
5thMiniPro/
├── backend-spring/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/backend_spring/
│   │   │   │   ├── config/          # Application configuration
│   │   │   │   ├── controller/      # REST API controllers
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   └── service/         # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # Unit tests
│   └── pom.xml
│
├── frontend-react/
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── context/                 # React context providers
│   │   ├── pages/                   # Application pages
│   │   ├── services/                # API service layer
│   │   └── App.js                   # Main app component
│   └── package.json
│
├── ml-service/
│   ├── app.py                       # FastAPI application
│   ├── train.py                     # Model training script
│   ├── generate_donor_data.py       # Data generation
│   ├── requirements.txt             # Python dependencies
│   └── *.joblib                     # Trained models & encoders
│
├── database_setup.sql               # Database schema
├── fix_database.sql                 # Database fixes
└── README.md                        # This file
```

## 🔌 API Endpoints

### Backend (Spring Boot) - Port 8080

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### Donors
- `GET /api/donors` - Get all donors
- `GET /api/donors/{id}` - Get donor by ID
- `POST /api/donors` - Create new donor
- `PUT /api/donors/{id}` - Update donor
- `DELETE /api/donors/{id}` - Delete donor

#### Events
- `GET /api/events` - Get all events
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID

### ML Service (FastAPI) - Port 8000

- `POST /predict` - Predict donor availability
- `POST /predict-event` - Predict donors for an event
- `GET /docs` - Interactive API documentation (Swagger UI)

## 🧪 Running Tests

### Backend Tests
```bash
cd backend-spring
./mvnw test
```

### Frontend Tests
```bash
cd frontend-react
npm test
```

## 🎨 Key Features Explained

### 1. Donor Management
- Complete CRUD operations for donor profiles
- Track donor information including blood type, fitness level, and donation history
- Bulk operations support for efficient data management

### 2. Event Management
- Create and manage blood donation events
- Associate donors with events
- Track event details including date, location, and requirements

### 3. ML-Based Prediction
- Predicts donor availability based on historical data
- Uses scikit-learn models for accurate predictions
- Features include gender, age, fitness level, and donation history

### 4. User Authentication
- Secure password hashing using Spring Security
- Role-based access control
- Session management

## 🔧 Configuration

### Backend Configuration
Edit `backend-spring/src/main/resources/application.properties`:

```properties
# Server port
server.port=8080

# Database configuration
spring.datasource.url=jdbc:mysql://localhost:3306/blood_donation
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend Configuration
Edit `frontend-react/src/services/api.js` to update API endpoints if needed.

### ML Service Configuration
Edit `ml-service/app.py` to configure CORS origins or model parameters.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Verify credentials in `application.properties`
   - Check if database `blood_donation` exists

2. **Port Already in Use**
   - Backend: Change port in `application.properties`
   - Frontend: Set PORT environment variable
   - ML Service: Use `--port` flag with uvicorn

3. **Model Loading Error**
   - Ensure all `.joblib` files are present
   - Run `train.py` to generate models

4. **CORS Issues**
   - Check CORS configuration in both backend and ML service
   - Ensure frontend origin is allowed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work

## 🙏 Acknowledgments

- Spring Boot documentation
- React documentation
- FastAPI documentation
- scikit-learn documentation

## 📧 Contact

For any queries or support, please reach out to [your-email@example.com]

---

**Note**: This is an educational project for learning purposes. Please ensure proper security measures are implemented before using in production.
