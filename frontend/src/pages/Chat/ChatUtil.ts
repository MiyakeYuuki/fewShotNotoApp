import {
    extractKeywordsFromEndpoint,
    feachAnswerFromEndpoint,
    typeResponseFunctionCalling,
    typeResponseChatGPTAPI,
    inferTourismThemeFromEndpoint
} from '../../functions/ChatGptFunction';
import { isEnglish } from '../../functions/CommonFunction';
import { typeMessage } from '../../features/Chat/InputChat';

/**
 * 会話内容を保存
 * @param answer 回答
 * @param message 質問
 * @param conversation チャット内容
 * @param setConversation 
 */
export const addConversation = (
    answer: string,
    message: string,
    conversation: typeMessage[],
    setConversation: React.Dispatch<typeMessage[]>,
) => {
    const newConversation = message ?
        [{ role: 'user', content: message },
        { role: 'assistant', content: answer }]
        :
        [{ role: 'assistant', content: answer, }];
    setConversation([...conversation, ...newConversation]);
};

/**
 * 文字列配列の中身をローワーケースに変換する
 * @param stringArray 文字列配列
 * @returns 成功：ローワーケースの文字列配列、失敗：null
 */
export const ArrayToLowerCase = ((stringArray: string[]): string[] | null => {
    console.log('▼----- Start ChatUtil ArrayToLowerCase -----▼');
    console.log('Input', stringArray);
    try {
        // 配列の中身をローワーケースに変換
        const LowerCaseStringArray: string[] = stringArray.map(item => item.toLowerCase());
        console.log('Keywords', LowerCaseStringArray);
        console.log('▲----- Finish ChatUtil ArrayToLowerCase -----▲');
        return LowerCaseStringArray;
    }
    catch (error) {
        console.error(error);
        console.log('▲----- Error ChatUtil ArrayToLowerCase -----▲');
        return null;
    }

});

/**
 * ユーザーの質問から回答を取得する
 * 
 * @param message ユーザーからの質問
 * @param conversation 前回の会話
 * @param keywordData 観光地に関わる全てのキーワード
 * @returns 成功：回答、失敗：null
 */
export const fetchAnswer = async (
    message: string,
    conversation: typeMessage[],
    keywordData: string[],
): Promise<string | null> => {
    console.log('▼----- Start ChatUtil fetchAnswer -----▼');
    // リクエスト作成
    const messages = [
        ...conversation,
        { role: 'user', content: message },
    ];
    console.log('Input', messages);
    try {
        // 回答の取得
        const response: typeResponseChatGPTAPI | null = await feachAnswerFromEndpoint(messages, keywordData.join(','));

        if (response !== null && response['status'] === 'success') {
            // 回答の出力
            console.log('レスポンス', response);
            console.log('ステータス', response['status']);
            console.log('回答', response['response']);
            console.log('▲----- Finish ChatUtil fetchAnswer -----▲');
            return response['response'];
        } else {
            throw new Error('エンドポイントとの接続でエラーが発生しました。');
        }

    } catch (error) {
        console.error(error);
        console.log('▲----- Error ChatUtil fetchAnswer -----▲');
        return null;
    }
}

/**
 * 会話内容からユーザーの観光テーマを推測する
 * 
 * @param message 質問
 * @param conversation 前回の会話
 * @returns 成功：ユーザーの観光テーマ、失敗：null
 */
export const inferTourismTheme = async (
    message: string,
    conversation: typeMessage[],
    responseText: string,
): Promise<string | null> => {
    console.log('▼----- Start ChatUtil inferTourismTheme -----▼');
    // リクエスト作成
    const messages = [
        ...conversation,
        { role: 'user', content: message },
        { role: 'assistant', content: responseText },
    ];
    console.log('Input', messages);

    try {
        // 観光のテーマ取得
        const response: typeResponseChatGPTAPI | null = await inferTourismThemeFromEndpoint(messages);

        if (response !== null && response['status'] === 'success') {
            // 回答の出力
            console.log('レスポンス', response);
            console.log('ステータス', response['status']);
            console.log('ユーザーの観光テーマ', response['response']);
            console.log('▲----- Finish ChatUtil inferTourismTheme -----▲');
            return response['response'];
        } else {
            throw new Error('エンドポイントとの接続でエラーが発生しました。');
        }

    } catch (error) {
        console.error(error);
        console.log('▲----- Error ChatUtil inferTourismTheme -----▲');
        return null;
    }
}

/**
 * キーワードが抽出できたか判断
 * 
 * @param gptAnswer - GPTからの回答
 * @return キーワードが抽出できた場合：string[]、キーワードが抽出できなかった場合：'stop'、抽出したキーワードが日本語の場合：'NG'、エラー：null
 */
export const extractKeywords = async (
    gptAnswer: string
): Promise<string[] | "stop" | null> => {

    console.log('▼----- Start ChatUtil extractKeywords -----▼');
    console.log('Input', gptAnswer);
    try {
        // Function Callingの呼び出し
        const response: typeResponseFunctionCalling | null = await extractKeywordsFromEndpoint(gptAnswer);

        // キーワードが抽出できた場合
        if (response !== null && response['status'] === 'success' &&
            response['response']['finish_reason'] === 'function_call') {
            // 回答の出力
            console.log('レスポンス', response);
            console.log('ステータス', response['status']);
            console.log('回答', response['response']['finish_reason']);

            const contents = response['response']['message']['function_call']['arguments'];
            const keywords = JSON.parse(contents)['keywords'];
            console.log('キーワード：', keywords);

            // キーワードの中身がすべて英語の場合
            if (isEnglish(keywords) && keywords.length !== 0) {
                console.log('▲----- Finish ChatUtil extractKeywords return Json -----▲');
                return JSON.parse(contents)['keywords'] as string[];
            }
            // キーワードの中身が英語以外の場合
            else {
                console.log('▲----- Finish ChatUtil extractKeywords return stop -----▲');
                return 'stop';
            }
        }
        // キーワードが抽出できなかった場合
        else if (response !== null && response['response']['finish_reason'] === 'stop') {
            console.log('▲----- Finish ChatUtil extractKeywords return stop -----▲');
            return 'stop';
        }
        else {
            throw new Error('エンドポイントとの接続でエラーが発生しました。');
        }
    } catch (error) {
        console.error(error);
        console.log('▲----- Error ChatUtil extractKeywords -----▲');
        return null;
    }
};