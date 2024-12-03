# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from routes import router as api_router
from dotenv import load_dotenv
import os

# load the enviroment varialbles
load_dotenv()

# get the session secret key 
SECRET_KEY = os.getenv("SESSION_SECRET_KEY")

# Initialize FastAPI app
app = FastAPI()

# Configure CORS to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add a session middleware for server side session mangement 
app.add_middleware(
    SessionMiddleware, SECRET_KEY
)

# Include the router that holds all the routes
app.include_router(api_router)



