import axios, { AxiosResponse } from 'axios';
import { getKeywords } from './GetFireStoreData';
import { systemStartContents, systemEndContents } from "./contents";

const API_URL = process.env.REACT_APP_GPTURL;
const MODEL = process.env.REACT_APP_GPTMODEL;
const API_KEY = process.env.REACT_APP_GPTAPIKEY;

interface ResponseData {
    choices: [{ message: { content: string } }];
}
/**
 * 質問内容からキーワードを抽出
 * 
 * @param message 質問
 * @param conversation 前回の会話
 * @returns keywordArray キーワード配列
 */
const getGptResponse = async (message: string, conversation: { role: string; content: string; }[], timeout: number) => {
    try {
        // firestoreからkeywordsを取得
        const keywordData: string[] = await getKeywords() as string[];
        const systemContents = systemStartContents + keywordData.join(',') + systemEndContents

        // リクエスト作成
        let messages = [{ 'role': 'system', 'content': systemContents }];
        messages.push(...conversation, { 'role': 'user', 'content': message });
        console.log('messages', ...messages);

        // axios.post(URL,request)をawaitする
        const response = await axios.post(API_URL as string,
            {
                // モデル、詳細指定
                'model': MODEL,
                'max_tokens': 400,
                'temperature': 1.0,
                'top_p': 1,

                // 質問内容
                'messages': messages,
            },
            {
                // 送信する HTTP ヘッダー(認証情報)
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

        // 回答の取得
        return response.data.choices[0].message.content.trim();

    } catch (error) {
        console.error(error);
        return null;
    }
}

export default getGptResponse;

/**
 * CharGPTAPIから回答を取得する
 * 
 * @param message 質問
 * @param conversation 以前の会話配列
 * @returns テスト回答
 */
export const getTestResponse = async (message: string, conversation: { role: string; content: string; }[]) => {
    await new Promise((resolve) => setTimeout(resolve, 6000)); // 3秒待つ
    // const response: string = '```json\n[\n"Scenery",\n"Sea",\n"Fashionable",\n"Cafes",\n"Gifts"\n]\n```';
    const response: string = '素晴らしいです！彼女が喜ぶこと間違いなしですね。\
        \n海や景色を楽しみながら、海鮮料理を味わい、さらに水族館で海の生き物たちと触れ合うことができます。\
        \nこれらの観光スポットを訪れると、素敵な思い出が作れることでしょう。あなたの会話からおすすめの観光スポットのカテゴリを絞り込みました。\
        \n\
        \n```json\
        \n[\
        \n"Scenery",\
        \n"Sea",\
        \n"Seafood",\
        \n"Aquarium"\
        \n]\
        \n```\
        \n\
        \n彼女とのデートを楽しまれてください！';
    // const response: string = "テスト回答です．";
    // const keywordData: string[] = await getKeywords() as string[];
    // const systemContents = systemStartContents + keywordData.join(',') + systemEndContents
    //console.log('直前の会話', ...conversation);
    //let messages = [{ 'role': 'system', 'content': systemContents }];
    //messages.push(...conversation, { 'role': 'user', 'content': message });
    console.log('getTestResponse');
    return response;
}