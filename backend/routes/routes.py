# backend/routes.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
import os
import requests
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Initialize the APIRouter
router = APIRouter()

# Load GitHub clienst credentials from environment variables
CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")  # Optional: specify redirect URI explicitly

# Ensure credentials are present
if not CLIENT_ID or not CLIENT_SECRET:
    raise ValueError("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in environment variables.")

# GitHub API URLs
GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
GITHUB_EMAIL_URL = "https://api.github.com/user/emails"


@router.get("/login")
async def login():
    """
    Redirect user to GitHub's OAuth login page.
    """
    # Build the redirect URL
    redirect_url = (
        f"{GITHUB_AUTHORIZE_URL}?client_id={CLIENT_ID}&scope=read:user,user:email"
        f"&redirect_uri={REDIRECT_URI}"
    )
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

    # Ensure the response is being sent back correctly
    print("User data:", user_data)
    print("User email:", user_email)

    # Return essential user info
    return JSONResponse({
        "username": user_data["login"],
        "avatar": user_data["avatar_url"],
        "email": user_email,
    })


def get_github_access_token(code: str) -> str:
    """
    Exchange the authorization code for an access token.
    """
    headers = {"Accept": "application/json"}
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI,  
    }

    response = requests.post(GITHUB_TOKEN_URL, headers=headers, data=data)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch access token from GitHub."
        )

    token_data = response.json()
    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Access token not received from GitHub.")

    return access_token


def fetch_github_user(access_token: str) -> dict:
    """
    Fetch authenticated user's information from GitHub.
    """
    headers = {"Authorization": f"token {access_token}"}
    response = requests.get(GITHUB_USER_URL, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch user data from GitHub."
        )

    return response.json()


def fetch_github_email(access_token: str) -> str:
    """
    Fetch authenticated user's primary email address.
    """
    headers = {"Authorization": f"token {access_token}"}
    response = requests.get(GITHUB_EMAIL_URL, headers=headers)

    if response.status_code == 200:
        email_data = response.json()
        primary_email = next((email["email"] for email in email_data if email.get("primary")), None)
        return primary_email
    return None
