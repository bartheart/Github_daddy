# backend/routes.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
import os
from dotenv import load_dotenv

# import the github OAuth fucntons 
from services import get_github_access_token, fetch_github_email, fetch_github_user



# Load environment variables from the .env file
load_dotenv()

# Initialize the APIRouter
router = APIRouter()

# Load GitHub clienst credentials from environment variables
CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")  # Optional: specify redirect URI explicitly

# Ensure credentials are present
if not CLIENT_ID:
    raise ValueError("Missing GITHUB_CLIENT_ID in environment variables.")

# GitHub authorization API URLs
GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"


@router.get("/")
async def test():
    return ("shush")


@router.get("/login")
async def login():
    """
    Redirect user to GitHub's OAuth login page.
    """
    # Build the redirect URL
    redirect_url = f"{GITHUB_AUTHORIZE_URL}?client_id={CLIENT_ID}&scope=read:user,user:email&redirect_uri={REDIRECT_URI}"
    return RedirectResponse(redirect_url)


@router.get("/callback")
async def callback(code: str):
    """
    Handle GitHub OAuth callback, exchange code for access token,
    and fetch user information.
    """
    if not code:
        raise HTTPException(status_code=400, detail="Missing 'code' parameter from GitHub.")

    print("Received code:", code)

    # Exchange code for access token
    access_token = get_github_access_token(code)

    # Fetch user information
    user_data = fetch_github_user(access_token)

    # Fetch user's email (optional)
    user_email = fetch_github_email(access_token)

    return RedirectResponse(f"http://localhost:3000/home?username={user_data['login']}&avatar={user_data['avatar_url']}&email={user_email}")

    # # Return essential user info
    # return JSONResponse({
    #     "username": user_data["login"],
    #     "avatar": user_data["avatar_url"],
    #     "email": user_email,
    # })