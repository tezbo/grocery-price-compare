import httpx
import logging
from difflib import get_close_matches
from utils.coles_build_id import get_coles_build_id

logger = logging.getLogger(__name__)

async def scrape_coles_product(query: str):
    build_id = get_coles_build_id()
    url = f"https://www.coles.com.au/_next/data/{build_id}/en/search/products.json?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "Accept": "application/json",
        "Referer": f"https://www.coles.com.au/search?q={query}",
    }

    logger.info(f"📦 Trying query: {query}")
    async with httpx.AsyncClient(headers=headers, timeout=10.0) as client:
        response = await client.get(url)

    logger.info(f"🧪 Status: {response.status_code}")
    logger.info(f"🧪 Content-Type: {response.headers.get('content-type')}")

    try:
        data = response.json()
    except Exception:
        logger.error("❌ JSON parsing failed — likely bot-blocked.")
        logger.debug(response.text[:1000])
        return None

    # Check if data structure is present
    try:
        page_props = data.get("pageProps", {})
        results = page_props.get("results", {})
        products = results.get("products", [])
    except Exception as e:
        logger.warning(f"⚠️ Unexpected structure. Keys: {list(data.keys())}")
        return None

    if not products:
        logger.warning(f"⚠️ No products found for query: {query}")
        logger.debug(f"🧪 Raw results object: {results}")
        return None

    names = [p.get("name", "") for p in products]
    logger.debug(f"🔍 Product names: {names}")

    close = get_close_matches(query.lower(), [n.lower() for n in names], n=1, cutoff=0.4)
    best_match = None
    if close:
        match_index = [n.lower() for n in names].index(close[0])
        best_match = products[match_index]
    else:
        best_match = products[0]

    return {
        "title": best_match.get("name"),
        "price": best_match.get("pricing", {}).get("now"),
        "unit": best_match.get("pricing", {}).get("unitOfMeasure"),
        "category": best_match.get("category", {}).get("name", "Uncategorised"),
    }