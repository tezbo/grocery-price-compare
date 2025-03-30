from fastapi import APIRouter, HTTPException, Query
import requests

router = APIRouter()

@router.get("/scrape_recipe")
async def scrape_recipe(url: str = Query(..., description="The URL of the recipe to scrape")):
    try:
        response = requests.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Recipe not found")

        recipe_data = {
            "title": "Sample Recipe",
            "ingredients": ["1 cup flour", "2 eggs", "1/2 cup sugar"]
        }

        return recipe_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))