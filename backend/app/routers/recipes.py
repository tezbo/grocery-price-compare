from fastapi import APIRouter
import requests
from bs4 import BeautifulSoup

router = APIRouter()

@router.get("/scrape_recipe/")
async def scrape_recipe(url: str):
    try:
        # Fetch the webpage
        response = requests.get(url)
        response.raise_for_status()

        # Parse the page using BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")

        # Example: Extracting recipe title and ingredients
        title = soup.find("h1").get_text()
        ingredients = []

        # Extracting ingredients (assuming they're in <li> tags for this example)
        for ingredient in soup.find_all("li", class_="ingredient"):
            ingredients.append(ingredient.get_text())

        return {"title": title, "ingredients": ingredients}

    except Exception as e:
        return {"error": f"Failed to scrape recipe: {e}"}