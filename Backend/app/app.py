from decouple import config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from routers.users import router as users_router
from routers.sentiment import router as senti_router

DB_URL = config("DB_URL", cast=str)
DB_NAME = config("DB_NAME", cast=str)

origins = ["*"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(DB_URL)
    app.mongodb = app.mongodb_client[DB_NAME]


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()


app.include_router(users_router, prefix="/auth", tags=["Auth"])
app.include_router(
    senti_router, prefix="/analyze", tags=["Sentiment Analysis"]
)
