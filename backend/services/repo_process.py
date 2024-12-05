#  backend/services/repo_process.py
from fastapi import HTTPException
import requests


# Github API url for fetching repository data
GITHUB_API_URL = "https://api.github.com/repos/{owner}/{repo_name}"

# define a function to get the user information from link
def get_user_info_link (repo_url: str):
    # check if there is no url 
    if not repo_url:
        raise HTTPException(status_code=400, detail="Repo link/url is required")
    
    # exteact the owner and repo name from the URL
    parts = repo_url.rstrip("/").split("/")
    # check if the link is not the right size 
    if len(parts) < 2:
        raise HTTPException(status_code=400, detail="Invalid repo url")
    
    owner, repo_name = parts[-2], parts[-1]

    return owner, repo_name


# define the funtion to get the github data
def get_repo_data( owner:str, repo_name:str ) -> dict:
    # create the github api url 
    url = GITHUB_API_URL.format(owner=owner, repo_name=repo_name)

    # get the respinse from the api endpoint 
    response = requests.get(url)

    # check if status code is not sucessful  
    if response.status_code != 200:
        raise HTTPException (
            status_code=response.status_code,
            detail=f"Failed to fetch data for {repo_name} repository."
        )
    
    # repository data response 
    # Repository data response
    repo_data = response.json()
    return repo_data
    # {
    #     "name": repo_data.get("name"),
    #     "description": repo_data.get("description"),
    #     "owner": repo_data.get("owner", {}).get("login"),
    #     "stars": repo_data.get("stargazers_count"),
    #     "forks": repo_data.get("forks_count"),
    #     "open_issues": repo_data.get("open_issues_count"),
    #     "url": repo_data.get("html_url"),
    #     "created_at": repo_data.get("created_at"),
    # }


# define a function to fecth commit history  
def get_commit_history( owner: str, repo_name: str) -> list:
    # define the url for the github commit api
    commits_url = f"https://api.github.com/repos/{owner}/{repo_name}/commits"

    # fetch the response from the api endpoint 
    response = requests.get(commits_url)

    # check if the status code not sucessful 
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch commit history."
        )
    
    return response.json()


# define a function to fetch the contributors 
def get_contributors (owner: str, repo_name: str) -> list:
    # define a url to fectch contirbutors 
    contributors_url = f"https://api.github.com/repos/{owner}/{repo_name}/contributors"

    # fetch the response from the api endpoint 
    response = requests.get(contributors_url)

    # check if the stauts code was not sucessful
    if response.status_code != 200:
        raise HTTPException (
            status_code=response.status_code,
            detail="Failed to fetch contributors."
        )
    return response.json()

# define a function to fetch the issues
def get_issues( owner: str, repo_name: str ) -> list:
    # define a url to fecth issues 
    issues_url = f"https://api.github.com/repos/{owner}/{repo_name}/issues"

    # fecth the response from the api endpoint 
    response = requests.get(issues_url)

    # check if the respnse status code is unsucessful 
    if response.status_code != 200:
        raise HTTPException(
            status_code= response.status_code,
            detail="Failed to fetch issues."
        )
    
    return response.json()



