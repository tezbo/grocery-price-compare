from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ShoppingListItem(BaseModel):
    name: str
    quantity: str
    price: float

shopping_list = []

@router.post("/shopping_list/")
async def add_to_shopping_list(item: ShoppingListItem):
    shopping_list.append(item.dict())
    return {"message": "Item added to shopping list", "item": item}

@router.get("/shopping_list/")
async def get_shopping_list():
    return shopping_list