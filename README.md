# techni_assess

Full-Stack Application

This project is a full-stack web application that utilizes React for the frontend and Django REST Framework for the backend. The application processes files, applies regex patterns to data, and provides the results through a RESTful API.
Project Structure


1. Backend Setup (Django)

Create and Activate a Virtual Environment (Optional but recommended) You can create a virtual environment to isolate your project dependencies:
bash
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows
Install Django and Django REST Framework Run the following commands to install Django and Django REST framework:

bash
pip install django
pip install djangorestframework
Start a New Django Project To create a new Django project, run:

bash
django-admin startproject backend
Create a New Django App Navigate to the backend folder and create a new Django app:

bash
cd backend
python manage.py startapp regex_processor
Set Up the Backend Project
Configure Django settings (e.g., settings.py).
Add 'rest_framework' to the INSTALLED_APPS list in settings.py.
Set up URL routing, create models, views, and serializers as needed.
Set up CORS headers and any necessary environment variables (e.g., .env).
Run the Backend Server After configuring your backend, run the following to start the Django development server:

bash
python manage.py runserver





2. Frontend Setup (React)

Install Node.js (if not already installed) Ensure that you have Node.js installed on your machine.
Create a React App with Vite To create a new React app using Vite (which is a faster build tool than Create React App), run:

bash
npm create vite@latest
This will prompt you for the project name and framework. Choose:
Project name: full_stake_ass
Framework: React
Variant: JavaScript
Install Dependencies After the React app is created, navigate into the frontend directory and install the required dependencies:

bash
cd full_stake_ass
npm install
Run the Frontend App After installation, run the frontend development server with:

bash
npm run dev
This will start the React app on http://localhost:5173 (or the port shown in your terminal).

3. Running the Application

Backend: The Django backend will be running on http://localhost:8000.
Frontend: The React frontend will be running on http://localhost:5173.

Make sure the backend is up and running before you test the frontend. You can use axios or fetch from React to communicate with the backend API.

API Endpoints

1. POST /api/process/

This endpoint accepts a file and a user input for regex processing.
Request:

File: A file to be processed (CSV, Excel, etc.).
user_input: The regex pattern or other user input for processing.

Response:

processed_data: The data after applying the regex pattern.


Additional Notes

CORS: If you're running the frontend and backend on different ports (e.g., React on port 5173 and Django on port 8000), make sure to handle CORS (Cross-Origin Resource Sharing) in the backend using django-cors-headers. The backend may block requests from different origins unless allowed.
Environment Variables: Use .env files to securely store sensitive information like API keys.
Deployment: When deploying, make sure to update the ALLOWED_HOSTS in settings.py and configure the backend to handle production-ready static files.


Contributing

Feel free to fork this project and make contributions! If you find any bugs or have suggestions for improvement, please open an issue or pull request.

License

This project is licensed under the MIT License - see the LICENSE file for details.

This README provides a comprehensive overview of how to set up and run both the frontend and backend parts of the project, along with relevant notes for handling CORS and environment variables. Adjust the instructions based on any additional details or changes specific to your project!
