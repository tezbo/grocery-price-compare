import json
import logging
from pathlib import Path
from fastapi import APIRouter, HTTPException, Query, Body
import requests
from bs4 import BeautifulSoup

router = APIRouter()
logging.basicConfig(level=logging.INFO)

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "saved_recipes.json"

def convert_to_print_url(url: str) -> str:
    if "wprm_print" in url:
        return url
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
            amount_el = el.select_one(".wprm-recipe-ingredient-amount")
            unit_el = el.select_one(".wprm-recipe-ingredient-unit")
            name_el = el.select_one(".wprm-recipe-ingredient-name")
            notes_el = el.select_one(".wprm-recipe-ingredient-notes")

            ingredient_data = {
                "quantity": amount_el.get_text(strip=True) if amount_el else "",
                "unit": unit_el.get_text(strip=True) if unit_el else "",
                "name": name_el.get_text(strip=True) if name_el else "",
                "notes": notes_el.get_text(strip=True) if notes_el else ""
            }

            if ingredient_data["name"]:
                ingredients.append(ingredient_data)

        return {
            "title": title,
            "ingredients": ingredients
        }

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        logging.error(f"Error scraping recipe: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# NEW ROUTES FOR PERSISTENT STORAGE
@router.get("/recipes")
async def get_saved_recipes():
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

@router.post("/recipes")
async def save_recipe(recipe: dict = Body(...)):
    try:
        if not recipe or not recipe.get("title") or not recipe.get("ingredients"):
            raise HTTPException(status_code=400, detail="Invalid recipe format.")

        existing = []
        if DATA_FILE.exists():
            with open(DATA_FILE, "r") as f:
                existing = json.load(f)

        # Avoid duplicates
        existing = [r for r in existing if r.get("title") != recipe.get("title")]
        existing.append(recipe)

        with open(DATA_FILE, "w") as f:
            json.dump(existing, f, indent=2)

        return {"message": "Recipe saved successfully"}
    except Exception as e:
        logging.error(f"Failed to save recipe: {e}")
        raise HTTPException(status_code=500, detail="Failed to save recipe")

@router.delete("/recipes/{title}")
async def delete_recipe(title: str, delete_mode: str = "cancel"):
    try:
        recipes_path = Path(__file__).resolve().parent.parent / "data" / "saved_recipes.json"
        products_path = Path(__file__).resolve().parent.parent / "data" / "products.json"

        with open(recipes_path, "r") as f:
            recipes = json.load(f)

        with open(products_path, "r") as f:
            products = json.load(f)

        # Remove the recipe from saved_recipes.json
        updated_recipes = [r for r in recipes if r["title"] != title]

        if delete_mode == "yes":
            updated_products = []
            for product in products:
                if "sourceRecipes" in product and title in product["sourceRecipes"]:
                    if len(product["sourceRecipes"]) == 1:
                        continue  # Delete this product entirely
                    else:
                        product["sourceRecipes"] = [r for r in product["sourceRecipes"] if r != title]
                updated_products.append(product)
        elif delete_mode == "no":
            # Only remove tag from sourceRecipes
            for product in products:
                if "sourceRecipes" in product and title in product["sourceRecipes"]:
                    product["sourceRecipes"] = [r for r in product["sourceRecipes"] if r != title]
            updated_products = products
        else:
            raise HTTPException(status_code=400, detail="Deletion cancelled.")

        with open(recipes_path, "w") as f:
            json.dump(updated_recipes, f, indent=2)

        with open(products_path, "w") as f:
            json.dump(updated_products, f, indent=2)

        with open(recipes_path, "r") as f:
            updated_recipes_after_delete = json.load(f)

        return updated_recipes_after_delete
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting recipe: {e}")
        