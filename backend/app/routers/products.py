import json
from fastapi import APIRouter
from pathlib import Path

router = APIRouter()

@router.get("/products")
async def get_products():
    # Load product data from products.json
    products_path = Path(__file__).resolve().parent.parent / "data" / "products.json"
    with open(products_path, "r") as f:
        return json.load(f)