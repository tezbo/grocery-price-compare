from fastapi import APIRouter, HTTPException, Query
import requests
from bs4 import BeautifulSoup
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)

def convert_to_print_url(url: str) -> str:
    # If it's already a print-friendly URL, return as is
    if "wprm_print" in url:
        return url
    # Extract slug and return print-friendly URL
    try:
        slug = url.rstrip("/").split("/")[-1]
        return f"https://www.recipetineats.com/wprm_print/{slug}"
    except Exception as e:
        logging.error(f"Error converting to print-friendly URL: {e}")
        raise HTTPException(status_code=400, detail="Invalid recipe URL")

@router.get("/scrape_recipe")
@router.get("/scrape_recipe/")
async def scrape_recipe(url: str = Query(..., description="The URL of the recipe to scrape")):
    try:
        # Convert to print-friendly version
        url = convert_to_print_url(url)

        response = requests.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Recipe page not found")

        soup = BeautifulSoup(response.content, 'html.parser')

        title_el = soup.find("h2", class_="wprm-recipe-name")
        title = title_el.get_text(strip=True) if title_el else "Untitled Recipe"
        logging.info(f"Recipe title: {title}")

        ingredient_elements = soup.select(".wprm-recipe-ingredient")
        if not ingredient_elements:
            raise HTTPException(status_code=404, detail="Ingredients not found")

        ingredients = []
        for el in ingredient_elements:
            amount = el.select_one(".wprm-recipe-ingredient-amount")
            unit = el.select_one(".wprm-recipe-ingredient-unit")
            name = el.select_one(".wprm-recipe-ingredient-name")
            notes = el.select_one(".wprm-recipe-ingredient-notes")

            ingredient_text = " ".join(
                part.get_text(strip=True)
                for part in [amount, unit, name, notes]
                if part
            )
            ingredients.append(ingredient_text)

        return {
            "title": title,
            "ingredients": ingredients
        }

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        logging.error(f"Error scraping recipe: {e}")
        raise HTTPException(status_code=500, detail=str(e))
