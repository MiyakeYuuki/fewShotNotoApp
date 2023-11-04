import { FunctionObject, Message } from "../types"

const API_URL: string = process.env.REACT_APP_GPTURL as string;
const MODEL: string = process.env.REACT_APP_GPTMODEL as string;
const API_KEY: string = process.env.REACT_APP_GPTAPIKEY as string;

const functions: FunctionObject[] = [
    {
        name: "get_kategory",
        description: "会話の文脈からユーザーが求める観光のカテゴリーが絞り込めたか判断し，カテゴリを抽出する関数\
        絞りこめたかどうかは「あなたの会話からカテゴリを抽出しました」など完了の会話が含まれている場合\
        メッセージの中にあるカテゴリー(複数)をカンマ区切りで出力する\
        カテゴリの出力は英語で，次のフォーマットに従う：[ String,String,String,...]\
        ",
        parameters: {
            type: "object",
            properties: {
                category: {
                    type: "string",
                    description: "カテゴリー",
                },
            },
            required: ["category"],
        },
    },
];

export async function chatCompletionRequest(
    messages: { role: string; content: string; }[],
    function_call: "auto" | { name: string } = "auto"
) {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
    }

    const jsonData = {
        model: "gpt-3.5-turbo-0613",
        messages,
        functions,
        function_call,
    }

    console.log("Req: jsonData", jsonData)
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers,
            body: JSON.stringify(jsonData),
        })

        console.log(response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json()
    } catch (error) {
        console.log("Unable to generate ChatCompletion response");
        console.log(`Exception: ${error}`);
        throw error;
    }
}