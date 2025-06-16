# Expense Tracker - MERN Stack Application

## Overview
A full-stack expense tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) that helps users monitor their spending habits across different categories.

## Features

### Frontend
- **Expense Distribution Visualization**:
  - Category-Wise tracking (Grocery, Vehicle, Shopping, Travel, Food, Fun, Other)
  - Visual indicators (checkboxes) for active categories
  - Chart with expenditure percentage 
- **Transaction Management**:
  - Add new expenses with category selection
  - Date selection for transactions
- **Expense Summary**:
  - Total expense calculation
  - Individual transaction listing

### Backend
- MongoDB for data store
- User authentication (login/signup)

## Technologies Used

### Frontend
- React.js
- Tailwind css

### Backend
- Node.js
- Express.js

### Database
- MongoDb
- Deploy : Render, vercel
  
### Setup Instructions

1. Clone the repository:
   - git clone https://github.com/SakshiVats27/Expense-Tracker.git
   - cd expense-tracker-mern
  
2. Install backend dependencies:
   - cd backend
   - npm install

3. Install frontend dependencies:
   - cd..
   - cd frontend
   - npm install

4. Set up environment variables:
    - Create a `.env` file in the backend directory with your MongoDB connection string:
    - MONGO_URI=your_mongodb_connection_string
    - EMAIL_PASS=
    - EMAIL_USER=
    - PORT=4000
    - Create a `.env` file in the frontend directory with your backend url:
    - REACT_APP_BACKEND_URL=

5. Run the application:
   - In one terminal (for backend):
     - cd backend
     - npm start
     
   - In another terminal (for frontend):
     - cd frontend
     - npm start


