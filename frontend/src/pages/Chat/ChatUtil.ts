import { getKeywords } from '../../functions/FirestoreFunction';
import {
    fetchExtractingCategory,
    feachGptResponse,
    typeResponseFunctionCalling,
    typeResponseChatGPTAPI
} from '../../functions/ChatGptFunction';
import { isEnglish } from '../../functions/CommonFunction';
import { typeMessage } from '../../features/Chat/InputChat';

/**
 * チャット内容を保管し，フォームを消す
 * @param answer 回答
 * @param message 質問
 * @param conversation チャット内容
 * @param setMessage
 * @param setConversation 
 */
export const pushConversation = (
    answer: string,
    message: string,
    conversation: typeMessage[],
    setConversation: React.Dispatch<React.SetStateAction<typeMessage[]>>,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
    const newConversation = message ?
        [{
            role: 'user',
            content: message,
        },
        {
            role: 'assistant',
            content: answer,
        }]
        :
        [{
            role: 'assistant',
            content: answer,
        }];
    setConversation([...conversation, ...newConversation]);
    setMessage('');
};

/**
 * FunctionCallingから得られたカテゴリを配列に変換する
 * @param response ChatGPTからの回答
 * @returns string配列
 */
export const ArrayToLowerCase = ((FCResponse: string[]): string[] => {
    console.log('▼----- Start ChatUtil parseFCResponse -----▼');
    console.log('Input', FCResponse);
    try {
        // 配列を小文字に変換
        const stringArray: string[] = FCResponse.map(item => item.toLowerCase());
        console.log('Category', stringArray);
        console.log('▲----- Finish ChatController getGptResponse -----▲');
        return stringArray;
    }
    catch (error) {
        console.error(error);
        console.log('▲----- Error ChatUtil parseFCResponse -----▲');
        throw error;
    }

});

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
            { role: 'user', content: message },
        ];

        // ChatGPTAPIモデルの呼び出し
        const response: typeResponseChatGPTAPI = await feachGptResponse(messages, keywordData.join(','));

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
 * @return カテゴリが抽出できた場合：array、カテゴリが抽出できなかった場合：'stop'、抽出したカテゴリが日本語の場合：'NG'、エラー：null
 */
export const getCategoryFC = async (message: string) => {
    try {
        console.log('▼----- Start ChatController getCategoryFC -----▼');
        console.log('Input', message);

        // Function Callingの呼び出し
        const response: typeResponseFunctionCalling = await fetchExtractingCategory(message);

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
                if (isEnglish(category) && category.length !== 0) {
                    console.log('▲----- Finish ChatController getCategoryFC return Json -----▲');
                    return JSON.parse(FCcontents)['category'] as string[];
                }
                // カテゴリの中身が英語以外の場合
                else {
                    console.log('▲----- Finish ChatController getCategoryFC return stop -----▲');
                    return 'NG';
                }
            }
            // カテゴリが抽出できなかった場合
            else if (response['response']['finish_reason'] === 'stop') {
                console.log('▲----- Finish ChatController getCategoryFC return stop -----▲');
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