from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import chat

app = FastAPI()

# 環境変数の読み込み
load_dotenv()

# ReactのURLを記載
origins = [os.environ['ORIGIN_URL']]

# 権限の設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/gpt", tags=["gpt"])