import httpx
import logging
from utils.coles_build_id import get_coles_build_id

logger = logging.getLogger(__name__)

async def scrape_coles_product(query: str):
    build_id = get_coles_build_id()
    url = f"https://www.coles.com.au/_next/data/{build_id}/en/search/products.json?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://www.coles.com.au/search?q=" + query,
    }

    logger.info(f"📦 Requesting: {url}")
    async with httpx.AsyncClient(headers=headers, timeout=10.0) as client:
        response = await client.get(url)

    logger.info(f"🧪 Status: {response.status_code}")
    logger.info(f"🧪 Content-Type: {response.headers.get('content-type')}")
    try:
        data = response.json()
    except Exception as e:
        logger.error("❌ Could not parse JSON, here's the raw response:")
        logger.debug(response.text[:1000])  # Just in case it's long
        raise Exception("❌ Coles returned non-JSON response. Likely bot-blocked.")

    return data