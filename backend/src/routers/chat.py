from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import openai
import os
import asyncio

router = APIRouter()

# set apikey
openai.api_key = os.environ['GPT_API_KEY']

class ChatInput(BaseModel):
    conversation: List[Dict[str, str]]
    keyword: str

class ChatForThemeInput(BaseModel):
    conversation: List[Dict[str, str]]

class FuncCallingInput(BaseModel):
    content: str

# systemロールのcontents
# あなた(ChatGPT)は優秀な石川県の能登地方の観光コンシェルジュで、ユーザーとの会話をもとにユーザーが求める観光スポットのキーワードをJSONフォーマットで5個抽出します。
# ユーザーに質問を3~5回行い，以下のキーワードから5個抽出してください．キーワード:
systemStartContents = "You (ChatGPT) are an excellent tourist concierge for the Noto region of Ishikawa Prefecture, and based on conversations with users, you extract 5 keywords of tourist spots in JSON format that users are looking for.\
    \nYou (ChatGPT) can bring out the travel keywords that the user is looking for.\
    \nAsk the user 3~5 questions and make 5 suggestions, and extract 5 from the following categories. keywords:"

# # 遵守事項
# ## 最終的なキーワードの出力は英語で，次のJSONフォーマットに従う：```json[ Aquarium,Child,Enjoyment,...]```
# ## ユーザーへの質問は日本語で行う．
# ## 1回目の質問は「あなたの旅の目的は何ですか？」と聞き，ユーザーからの回答を待つ．
# ## 2~4回目の質問はあなた(ChatGPT)からの提案も含める．
# 質問例：
# ・「どのような場所に行きたいですか？候補などがあれば教えてください。」
# ・「素晴らしい選択です！続けて、具体的な場所(例：海が見える場所，おしゃれな場所)やアクティビティについて教えてください。」
# ・「海などが見える観光スポットがおすすめですが、いかがですか？」
# ・「どのような場所に行きたいですか？候補などがあれば教えてください。」
# ## ユーザーからの回答に対してキーワードが絞り込めたらJSONフォーマット：```json[ Aquarium,Child,Enjoyment,...]```でキーワードを返却する．
# ## 具体的な観光スポットを提案しない。最終的な観光スポットの提案は外部のアプリで行うため．
# ## 最終的なあなた(ChatGPT)の回答例
# 「あなたの会話からおすすめの観光スポットのキーワードを絞り込みました。：```json[ String,String,String,...]```」
# ※String文字列にはユーザーとの会話で得られたキーワードを入れる。
systemEndContents = "\n\n# Compliance\
    \n## The final keywords output is in English and follows the JSON format:```json[\"Aquarium\",\"Child\",\"Enjoyment\",...]```\
    \n## Questions to users are asked in Japanese.\
    \n## The first question asks こんにちは！今回はどのような目的で旅行に行かれるのですか？ and waits for the user's response.\
    \n## The 2nd~4th questions should also include suggestions for destinations and categories from you (ChatGPT). \
    \nIf you include a suggestion, indicate the reason along with the suggestion.\
    \nQuestion Examples:\
    \n・どのような場所に行きたいですか？海が見える場所やおしゃれな場所など抽象的なものでも構いません！\
    \n・いいですね！これは絶対にしたいアクティビティや食べたい料理などはありますか？\
    \n※Do not ask questions that force the user to choose a specific keywords during the conversation.\
    \n## JSON format once categories have been narrowed down for responses from users:```json[\"Aquarium\",\"Child\",\"Enjoyment\",...]```\
    \n## No specific sightseeing spots are proposed. The final sightseeing spots will be proposed by an external application.\
    \n## Final You (ChatGPT) Sample Responses\
    \n「あなたの会話からおすすめの観光スポットのキーワードを絞り込みました。：```json[ String,String,String,...]```」\
    \n※The String string contains keywords thought to be based on conversations with the user (including responses from the user)."

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

systemContentsForTheme = "ユーザーとあなた(ChatGPT)の会話から、ユーザーの観光テーマを1文で教えてください。\
    1文でテーマを表現した後に、「それでは観光を楽しんでください！」などねぎらいの言葉を加えてください。"

# ChatGPTAPIへのリクエスト送信
@router.post("/askfortheme")
async def chat_api_for_theme(input: ChatForThemeInput):
    # postデータの出力
    print("conversation:", input.conversation)

    # ChatGPTAPIに送信するリクエスト作成
    messages = [{ 'role': 'system', 'content': systemContentsForTheme },*input.conversation]
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
fetchKeywordsFunctions = [
    {
        "name": "fetch_keywords",
        "description": "文章からユーザーが求める観光のキーワードが絞り込めたか判断し，キーワードを抽出する関数",
        "parameters": {
            "type": "object",
            "properties": {
                "keywords": {"type": "array", "items": {"type": "string"}}
                },
            "required": ["keywords"]
        },
    }
]
@router.post("/func")
async def chat_api(input: FuncCallingInput):
    # postデータの出力
    print("Input:", input.content)

    # ChatGPTAPIに送信するリクエスト作成
    userMessage = "以下の文章においてキーワードを抽出できている('function_call')か判断してください。\
    キーワードが抽出できている('function_call')かは、「キーワードを抽出しました」などの文言が含まれている場合です。\
    「～を選んでいただけますか？」、「どのような場所に行きたいですか？」、「どのキーワードが気になりますか？」などの文言が含まれている場合は'stop'と判断してください。\
    \n```\n" + input.content + "\n```"
    contents = [{"role": "user", "content": userMessage}]
    try:
        response = openai.ChatCompletion.create(
            model = "gpt-3.5-turbo-0613",
            messages = contents,
            functions = fetchKeywordsFunctions
        )
        print("Output:", response["choices"][0])
        # キーワードの出力
        if(response["choices"][0]["finish_reason"] == "function_call"):
            print("keywords:", response["choices"][0]["message"]["function_call"]["arguments"])

        return {"status": "success", "response":response["choices"][0]}
    
    except asyncio.CancelledError:
        raise HTTPException(status_code=400, detail="Request cancelled by client.")