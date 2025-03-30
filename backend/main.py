from fastapi import FastAPI
from app.routers import products
from app.routers.recipes import router as recipes_router
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api")
app.include_router(recipes_router, prefix="/api")

logging.info("Routers included: /api/products, /api/recipes")