import { getKeywords } from '../model/GetFirestoreModel';
import { fetchExtractingCategory, feachGptResponse } from '../model/GetGptResponseModel';
import { isEnglish } from '../model/CommonModel';
import { ResponseFunctionCalling, ResponseChatGPTAPI } from "../types";

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

        if (response['status'] === 'success' && response !== undefined) {
            // カテゴリが抽出できた場合
            if (response['response']['finish_reason'] === 'function_call') {
                const FCcontents = response['response']['message']['function_call']['arguments'];
                const category = JSON.parse(FCcontents)['category'];
                console.log('カテゴリ：', category);

                // カテゴリの中身がすべて英語の場合
                if (isEnglish(category) || category.length !== 0) {
                    console.log('▲----- Finish ChatController getCategoryFC -----▲');
                    return JSON.parse(FCcontents)['category'] as string[];
                }
                // カテゴリの中身が英語以外の場合
                else {
                    console.log('▲----- Finish ChatController getCategoryFC -----▲');
                    return 'stop';
                }
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