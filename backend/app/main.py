from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
import json
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

app = FastAPI()

# ReactのURLを記載
origins = [
    os.environ['ORIGIN_URL'],
]

# 権限の設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.environ['GPT_API_KEY']

# リクエストボディ定義
class ChatInput(BaseModel):
    content: str

# CHATGPTAPIへのリクエスト送信
@app.post("/chat")
async def chat_api(input: ChatInput):
    print("Input:",input.content)

    # user_message = {"role": "user", "content": input.content}
    messages = json.loads(input.content)

    response = openai.ChatCompletion.create(
        model=os.environ['GPT_MODEL'], 
        max_tokens = 400,
        temperature=0.2,
        messages=messages,
    )

    print("Output:",response["choices"][0]["message"]["content"])
    return response["choices"][0]["message"]["content"]
