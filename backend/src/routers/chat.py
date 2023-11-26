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

class FuncCallingInput(BaseModel):
    content: str

# systemロールのcontents
# あなた(ChatGPT)は優秀な石川県の能登地方の観光コンシェルジュで、ユーザーとの会話をもとにユーザーが求める観光スポットのカテゴリをJSONフォーマットで5個抽出します。
# ユーザーに質問を3~5回行い，以下のカテゴリから5個抽出してください．カテゴリ:
systemStartContents = "You (ChatGPT) are an excellent tourist concierge for the Noto region of Ishikawa Prefecture, and based on conversations with users, you extract 5 categories of tourist spots in JSON format that users are looking for.\
    \nYou (ChatGPT) can bring out the travel category that the user is looking for.\
    \nAsk the user 3~5 questions and make 5 suggestions, and extract 5 from the following categories. Category:"

# # 遵守事項
# ## 最終的なカテゴリの出力は英語で，次のJSONフォーマットに従う：```json[ Aquarium,Child,Enjoyment,...]```
# ## ユーザーへの質問は日本語で行う．
# ## 1回目の質問は「あなたの旅の目的は何ですか？」と聞き，ユーザーからの回答を待つ．
# ## 2~4回目の質問はあなた(ChatGPT)からの提案も含める．
# 質問例：
# ・「どのような場所に行きたいですか？候補などがあれば教えてください。」
# ・「素晴らしい選択です！続けて、具体的な場所(例：海が見える場所，おしゃれな場所)やアクティビティについて教えてください。」
# ・「海などが見える観光スポットがおすすめですが、いかがですか？」
# ・「どのような場所に行きたいですか？候補などがあれば教えてください。」
# ## ユーザーからの回答に対してカテゴリが絞り込めたらJSONフォーマット：```json[ Aquarium,Child,Enjoyment,...]```でカテゴリを返却する．
# ## 具体的な観光スポットを提案しない。最終的な観光スポットの提案は外部のアプリで行うため．
# ## 最終的なあなた(ChatGPT)の回答例
# 「あなたの会話からおすすめの観光スポットのカテゴリを絞り込みました。：```json[ String,String,String,...]```」
# ※String文字列にはユーザーとの会話で得られたカテゴリを入れる。
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
        "description": "文章からユーザーが求める観光のカテゴリが絞り込めたか判断し，カテゴリを抽出する関数",
        "parameters": {
            "type": "object",
            "properties": {
                "category": {"type": "array", "items": {"type": "string"}}
                },
            "required": ["category"]
        },
    }
]
@router.post("/func")
async def chat_api(input: FuncCallingInput):
    # postデータの出力
    print("Input:", input.content)

    # ChatGPTAPIに送信するリクエスト作成
    userMessage = "以下の文章においてカテゴリを抽出できている('function_call')か判断してください。\
    カテゴリが抽出できている('function_call')かは、「カテゴリを抽出しました」などの文言が含まれている場合です。\
    「～を選んでいただけますか？」、「どのような場所に行きたいですか？」、「どのカテゴリが気になりますか？」などの文言が含まれている場合は'stop'と判断してください。\
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