import { getKeywords } from '../model/GetFirestoreModel';
import { fetchExtractingCategory, feachGptResponse } from '../model/GetGptResponseModel';
import { systemStartContents, systemEndContents } from "../contents";
import { ResponseFunctionCalling, ResponseChatGPTAPI } from "../types";
import app from './axiosSetting';

/**
 * 質問内容からチャットを行う
 * 
 * @param message 質問
 * @param conversation 前回の会話
 * @returns ChatGPTからの回答
 */
export const getGptResponse = async (message: string, conversation: { role: string; content: string; }[]) => {
    console.log('▼----- Start ChatController getGptResponse -----▼');
    console.log('Input', message);

    try {
        // firestoreからkeywordsを取得
        const keywordData: string[] = await getKeywords() as string[];

        // リクエスト作成
        const messages = [
            ...conversation,
            { 'role': 'user', 'content': message },
        ];

        // ChatGPTAPIモデルの呼び出し
        const response: ResponseChatGPTAPI = await feachGptResponse(messages, keywordData.join(','));

        // 回答の出力
        console.log('GPTレスポンス', response);
        console.log('GPTステータス', response['status']);
        console.log('GPT回答', response['response']);

        if (response['status'] === 'success') {
            console.log('▲----- Finish ChatController getGptResponse -----▲');
            return response['response'];
        } else {
            throw new Error('ChatGPTAPIとの接続でエラーが発生しました。');
        }

    } catch (error) {
        console.error(error);
        console.log('▲----- Error ChatController getGptResponse -----▲');
        return null;
    }
}

/**
 * カテゴリが抽出できたか判断
 * 
 * @param message - GPTからの回答
 * @return カテゴリが抽出できた場合：array、カテゴリが抽出できなかった場合：'stop'、エラー：null
 */
export const getCategoryFC = async (message: string) => {
    try {
        console.log('▼----- Start ChatController getCategoryFC -----▼');
        console.log('Input', message);

        // Function Callingの呼び出し
        const response: ResponseFunctionCalling = await fetchExtractingCategory(message);

        // 回答の出力
        console.log('FCレスポンス', response);
        console.log('FCステータス', response['status']);
        console.log('FC回答1', response['response']['finish_reason']);

        if (response['status'] === 'success') {
            // カテゴリが抽出できた場合
            if (response['response']['finish_reason'] === 'function_call') {
                const FCcontents = response['response']['message']['function_call']['arguments']
                console.log('カテゴリ：', FCcontents);
                console.log('▲----- Finish ChatController getCategoryFC -----▲');
                return JSON.parse(FCcontents);
            }
            // カテゴリが抽出できなかった場合
            else if (response['response']['finish_reason'] === 'stop') {
                console.log('▲----- Finish ChatController getCategoryFC -----▲');
                return 'stop';
            }
        } else {
            throw new Error('FunctionCallingでエラーが発生しました。');
        }
    } catch (error) {
        console.error(error);
        console.log('▲----- Error ChatController getCategoryFC -----▲');
        return null;
    }
};

/**
 * (テスト)CharGPTAPIから回答を取得する
 * 
 * @param message 質問
 * @param conversation 以前の会話配列
 * @returns テスト回答
 */
export const getTestResponse = async (message: string, conversation: { role: string; content: string; }[]) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 3秒待つ
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