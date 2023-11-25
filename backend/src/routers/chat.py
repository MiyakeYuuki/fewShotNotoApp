from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import openai
import os
import asyncio

router = APIRouter()

class ChatInput(BaseModel):
    conversation: List[Dict[str, str]]
    keyword: str

class FuncCallingInput(BaseModel):
    content: str

# set apikey
openai.api_key = os.environ['GPT_API_KEY']

# systemロールのcontents
systemStartContents = "You (ChatGPT) are an excellent tourist concierge for the Noto region of Ishikawa Prefecture, and based on conversations with users, you extract 5 categories of tourist spots in JSON format that users are looking for.\
    \nYou (ChatGPT) can bring out the travel category that the user is looking for.\
    \nAsk the user 3~5 questions and make 5 suggestions, and extract 5 from the following categories. Category:"

systemEndContents = "\n\n# Compliance\
    \n## The final category output is in English and follows the JSON format:```json[\"Aquarium\",\"Child\",\"Enjoyment\",...]```\
    \n## Questions to users are asked in Japanese.\
    \n## The first question asks こんにちは！今回はどのような目的で旅行に行かれるのですか？ and waits for the user's response.\
    \n## The 2nd~4th questions should also include suggestions for destinations and categories from you (ChatGPT). \
    \nIf you include a suggestion, indicate the reason along with the suggestion.\
    \nQuestion Examples:\
    \n・どのような場所に行きたいですか？海が見える場所やおしゃれな場所など抽象的なものでも構いません！\
    \n・いいですね！これは絶対にしたいアクティビティや食べたい料理などはありますか？\
    \n※Do not ask questions that force the user to choose a specific category during the conversation.\
    \n## JSON format once categories have been narrowed down for responses from users:```json[\"Aquarium\",\"Child\",\"Enjoyment\",...]```でカテゴリを返却する．\
    \n## No specific sightseeing spots are proposed. The final sightseeing spots will be proposed by an external application.\
    \n## Final You (ChatGPT) Sample Responses\
    \n「あなたの会話からおすすめの観光スポットのカテゴリを絞り込みました。：```json[ String,String,String,...]```」\
    \n※The String string contains categories thought to be based on conversations with the user (including responses from the user)."

# ChatGPTAPIへのリクエスト送信
@router.post("/ask")
async def chat_api(input: ChatInput):
    # postデータの出力
    print("conversation:", input.conversation)
    print("keyword:", input.keyword)

    # systemロールのcontents作成
    systemContents = systemStartContents + input.keyword + systemEndContents

    # ChatGPTAPIに送信するリクエスト作成
    messages = [{ 'role': 'system', 'content': systemContents },*input.conversation]
    try:
        response = openai.ChatCompletion.create(
            model = os.environ['GPT_MODEL'],
            max_tokens=400,
            temperature=0.2,
            messages=messages,
        )
        print("Output:", response["choices"][0]["message"]["content"])
        return {"status": "success", "response": response["choices"][0]["message"]["content"]}
    
    except asyncio.CancelledError:
        raise HTTPException(status_code=400, detail="Request cancelled by client.")
    
# Function Calling Setting
getCategoryFunctions = [
    {
        "name": "get_category",
        "description": "文章からユーザーが求める観光のカテゴリが絞り込めたか判断し，カテゴリを抽出する関数\
        絞りこめたかどうかは「あなたの会話からカテゴリを抽出しました」など完了の会話が含まれている場合\
        また、文章の中にSceneryやSeafoodなどのカテゴリーが含まれている場合\
        文章の中にある複数のカテゴリ(英語)をカンマ区切り(String,String,String,...)で出力する\
        出力は英語で，カテゴリのみを出力し、次のフォーマットに従う：[ String,String,String,...]",
        "parameters": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "descriptio": "カテゴリ",
                },
            },
            "required": ["category"]
        }
    }
]
@router.post("/func")
async def chat_api(input: FuncCallingInput):
    # postデータの出力
    print("Input:", input.content)

    # ChatGPTAPIに送信するリクエスト作成
    userMessage = "以下の文章がカテゴリを抽出しているか判断してください。\
    \n```\n" + input.content + "\n```"
    contents = [{"role": "user", "content": userMessage}]
    try:
        response = openai.ChatCompletion.create(
            model = "gpt-3.5-turbo-0613",
            messages = contents,
            functions = getCategoryFunctions
        )
        print("Output:", response["choices"][0])
        # カテゴリの出力
        if(response["choices"][0]["finish_reason"] == "function_call"):
            print("category:", response["choices"][0]["message"]["function_call"]["arguments"])

        return {"status": "success", "response":response["choices"][0]}
    
    except asyncio.CancelledError:
        raise HTTPException(status_code=400, detail="Request cancelled by client.")