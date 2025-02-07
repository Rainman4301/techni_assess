Full-Stack Application - Techni_Assess

Welcome to the Techni_Assess project! This is a full-stack web application that uses React for the frontend and Django REST Framework for the backend. The app processes files, applies regular expressions (regex) to data, and returns the processed results through a RESTful API.




========================================================================


Backend Setup (Django)

1. Set Up a Virtual Environment (Optional, but Recommended)

To keep your project dependencies isolated, you can set up a virtual environment:
bash
# Create the virtual environment
python -m venv venv

# Activate the virtual environment (macOS/Linux)
source venv/bin/activate

# Activate the virtual environment (Windows)
venv\Scripts\activate

2. Install Dependencies

Now, install Django and Django REST Framework with the following commands:
bash
pip install django
pip install djangorestframework

3. Create a New Django Project

Let’s start by creating a new Django project:
bash
django-admin startproject backend

4. Create a New Django App

Inside the backend directory, create a new Django app:
bash
cd backend
python manage.py startapp regex_processor

5. Set Up Your Backend Project

Update settings.py to include 'rest_framework' in the INSTALLED_APPS list.
Configure URL routing, and create models, views, and serializers as needed.
Don’t forget to set up CORS headers and environment variables (e.g., using a .env file).

7. Run the Django Server

Once you’ve set up everything, run the server:
bash
python manage.py runserver

Your Django backend will be up and running at http://localhost:8000.



========================================================================


Frontend Setup (React)

1. Install Node.js
   
Before you proceed, make sure you have Node.js installed on your machine. If you don’t have it yet, download it from here.


3. Create a React App with Vite
   
Instead of using create-react-app, we are using Vite, a faster build tool. To create your React app, run:

bash
npm create vite@latest

It will prompt you to provide some details like:
Project name: full_stake_ass
Framework: React
Variant: JavaScript

3. Install Dependencies

After setting up the React app, navigate into the frontend directory and install the necessary dependencies:
bash
cd full_stake_ass
npm install

4. Run the Frontend App

Once everything is installed, start the development server:

bash
npm run dev

This will launch your React app at http://localhost:5173.

Running the Application

Backend

The Django backend will be running at:

http://localhost:8000
Frontend

The React frontend will be running at:

http://localhost:5173
Make sure that the backend is running before interacting with the frontend. You can use Axios or fetch in React to communicate with the backend API.

API Endpoints

POST /api/process/

This endpoint handles file uploads and applies regex patterns to the data.
Request:

File: The file to be processed (e.g., CSV, Excel).
user_input: The regex pattern or user input for processing.

Response:

processed_data: The data after applying the regex pattern.


Additional Notes

CORS: If your frontend and backend are running on different ports (e.g., React on port 5173 and Django on port 8000), you need to handle CORS (Cross-Origin Resource Sharing) in the backend. You can do this with django-cors-headers. Otherwise, the backend might block requests from different origins.
Environment Variables: Store sensitive information like API keys securely in .env files.
Deployment: When deploying your application, make sure to update the ALLOWED_HOSTS in settings.py and configure Django to serve production-ready static files.


Contributing

Feel free to fork this project and contribute! If you encounter bugs or have any suggestions for improvement, don’t hesitate to open an issue or submit a pull request.

License

This project is licensed under the MIT License - see the LICENSE file for more details.

This version removes the project structure section and keeps the rest of the documentation clear, organized, and human-readable. Let me know if you need further adjustments!
