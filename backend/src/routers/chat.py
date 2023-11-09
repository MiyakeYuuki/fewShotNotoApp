from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
import os
import json
import asyncio

router = APIRouter()

class ChatInput(BaseModel):
    content: str

class FuncCallingInput(BaseModel):
    content: str

# set apikey
openai.api_key = os.environ['GPT_API_KEY']

# ChatGPTAPIへのリクエスト送信
@router.post("/ask")
async def chat_api(input: ChatInput):
    print("Input:", input.content)

    messages = json.loads(input.content)

    response = openai.ChatCompletion.create(
        model = os.environ['GPT_MODEL'],
        max_tokens=400,
        temperature=0.2,
        messages=messages,
    )

    print("Output:", response["choices"][0]["message"]["content"])
    return response["choices"][0]["message"]["content"]

# Function Calling Setting
getCategoryFunctions = [
    {
        "name": "get_category",
        "description": "会話の文脈からユーザーが求める観光のカテゴリーが絞り込めたか判断し，カテゴリを抽出する関数\
        絞りこめたかどうかは「あなたの会話からカテゴリを抽出しました」など完了の会話が含まれている場合\
        メッセージの中にあるカテゴリー(複数)をカンマ区切りで出力する\
        カテゴリの出力は英語で，次のフォーマットに従う：[ String,String,String,...]",
        "parameters": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "descriptio": "カテゴリー",
                },
            },
            "required": ["category"]
        }
    }
]
@router.post("/func")
async def chat_api(input: FuncCallingInput):
    print("Input:", input.content)

    try:
        await asyncio.sleep(7)  # 時間のかかる処理
        response = openai.ChatCompletion.create(
            model = "gpt-3.5-turbo-0613",
            messages = [
                {"role": "user", "content": input.content},
            ],
            functions = getCategoryFunctions
        )
        print("Output:", response["choices"][0])
        return {"status": "success", "ressponse":response["choices"][0]}
    
    except asyncio.CancelledError:
        raise HTTPException(status_code=400, detail="Request cancelled by client.")