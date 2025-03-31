from fastapi import APIRouter, HTTPException, Query
from scrapers.coles_scraper import scrape_coles_product
# from scrapers.woolworths_scraper import scrape_woolies_product (future use)
import requests
from bs4 import BeautifulSoup
import logging

router = APIRouter()
logging.basicConfig(level=logging.INFO)

# ——— RECIPE SCRAPER ———
@router.get("/scrape_recipe")
async def scrape_recipe(url: str = Query(...)):
    try:
        # Placeholder, you can enhance this logic or call your more advanced recipe scraper
        response = requests.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Recipe not found")

        return {
            "title": "Sample Recipe",
            "ingredients": ["1 cup flour", "2 eggs", "1/2 cup sugar"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ——— COLES SCRAPER ———
@router.get("/scrape_coles_price")
async def get_coles_prices(query: str = Query(...)):
    try:
        print(f"🔍 Scraping Coles for: {query}")
        results = await scrape_coles_product(query)
        print(f"✅ Got results: {results}")
        if not results:
            raise HTTPException(status_code=404, detail="No matching Coles products found.")
        return results
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))