from fastapi import APIRouter, HTTPException, Query
from scrapers.coles_scraper import scrape_coles_product
# from scrapers.woolworths_scraper import scrape_woolies_product (future use)
import requests
from bs4 import BeautifulSoup
import logging
logger = logging.getLogger(__name__)

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
from utils.query_cleaner import clean_query

@router.get("/scrape_coles_price")
async def get_coles_prices(query: str = Query(...)):
    try:
        cleaned_queries = clean_query(query)

        for q in cleaned_queries:
            logger.info(f"🔍 Scraping Coles for: {q}")
            results = await scrape_coles_product(q)

            if not results:
                logger.warning(f"⚠️ No response for query: {q}")
                continue

            page_props = results.get("pageProps")
            if not page_props:
                logger.warning(f"⚠️ No 'pageProps' in Coles response for: {q}")
                continue

            search_results = page_props.get("results")
            if not search_results:
                logger.warning(f"⚠️ No 'results' in Coles response for: {q}")
                continue

            products = search_results.get("products")
            if not products or not isinstance(products, list):
                logger.warning(f"⚠️ No valid products in response for: {q}")
                continue

            product = products[0]
            return {
                "title": product.get("name"),
                "price": product.get("pricing", {}).get("now"),
                "unit": product.get("pricing", {}).get("unitOfMeasure"),
            }

        raise HTTPException(status_code=404, detail="No matching Coles products found.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

from scrapers.woolworths_scraper import get_woolworths_products

@router.get("/api/scrape_woolworths_price")
async def get_woolworths_prices(query: str):
    print(f"🔍 Scraping Woolworths for: {query}")
    results = await get_woolworths_products(query)
    if not results:
        raise HTTPException(status_code=404, detail="No matching Woolworths products found.")
    return results