# backend/routes.py
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
import os
from dotenv import load_dotenv

# import the github OAuth fucntons 
from services import get_github_access_token, fetch_github_email, fetch_github_user

# import functions to process repo data 
from services import get_user_info_link, get_repo_data, get_issues, get_contributors, get_commit_history

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


@router.get("/login")
async def login():
    """
    Redirect user to GitHub's OAuth login page.
    """
    # Build the redirect URL
    redirect_url = f"{GITHUB_AUTHORIZE_URL}?client_id={CLIENT_ID}&scope=read:user,user:email&redirect_uri={REDIRECT_URI}"
    return RedirectResponse(redirect_url)


@router.get("/callback")
async def callback(code: str, request: Request):
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


    # store the user data in the server side session
    request.session["user"] = {
        "username": user_data["login"],
        "avatar": user_data['avatar_url'],
        "email": user_email
    }

    return RedirectResponse(f"http://localhost:3000/home")


@router.get("/user")
async def get_user(request: Request):
    # get the user data from the session 
    user = request.session.get("user")
    # check if not user 
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated.")
    return user



# define a route to handle the the processing the repo link 
@router.post('/process_repo')
async def process_repo(request: Request):
    body = await request.json()
    repo_url = body.get("repo_url")
    if not repo_url:
        raise HTTPException(status_code=400, detail="Missing 'repo_url' in request body.")
    # call function to save the repos data to the sesssion 
    
    owner, repo_name = get_user_info_link(repo_url)
    

    # Fetch data
    repo_data = get_repo_data(owner, repo_name)
    print(repo_data)
    commit_history = get_commit_history(owner, repo_name)
    contributors = get_contributors(owner, repo_name)
    issues = get_issues(owner, repo_name)

    request.session["all_repo_data"] = {
        "repo_data": repo_data,
        "commit_history": commit_history,
        "contributors": contributors,
        "issues": issues
    }

    return RedirectResponse(f"http://localhost/3000/match")


@router.get('/repo_data')
async def get_all_repo_data(request: Request):
    all_repo_data = request.session['all_repo_data']

    # check if not user 
    if not all_repo_data:
        raise HTTPException(status_code=401, detail="No repo data returned.")
    return all_repo_data
