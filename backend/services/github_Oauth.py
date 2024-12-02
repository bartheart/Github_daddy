# backend/services/github_Oauth.py
from fastapi import HTTPException
import requests
import os 
from dotenv import load_dotenv

# load eviroment variables from .env 
load_dotenv()

# load github client credentials from the env
CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")

# check if the github credentails are missing in the .env
if not CLIENT_ID or not CLIENT_SECRET:
    raise ValueError("Missing CLIENT_ID or CLIENT_SECRET in the enviroment variables!")

# GitHub API URLs
GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
GITHUB_EMAIL_URL = "https://api.github.com/user/emails"



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
