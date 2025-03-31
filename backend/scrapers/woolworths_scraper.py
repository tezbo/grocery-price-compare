import httpx
from bs4 import BeautifulSoup

BASE_URL = "https://www.woolworths.com.au/shop/search/products"

async def get_woolworths_products(query: str):
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(f"{BASE_URL}?searchTerm={query}")
        if response.status_code != 200:
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        products = []

        for product_tile in soup.select("div.shelfProductTile"):
            title = product_tile.select_one("span.shelfProductTile-description").text.strip()
            price_el = product_tile.select_one("span.price-dollars")
            cents_el = product_tile.select_one("span.price-cents")

            price = None
            if price_el:
                price = price_el.text.strip()
                if cents_el:
                    price += "." + cents_el.text.strip()

            if title and price:
                products.append({
                    "name": title,
                    "price": f"${price}"
                })

        return products