import { useEffect } from 'react';
//import { getKeywords } from '../api/GetFireStoreData';

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
    conversation: { role: string; content: string; }[],
    setConversation: React.Dispatch<React.SetStateAction<{ role: string; content: string; }[]>>,
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
 * 読込アニメーションの表示
 * @param loading 読込中か否か
 * @param setLoading 
 */
export const useLoadingEffect = (
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    useEffect(() => {
        setLoading(loading);
    }, [loading]);
};

/**
 * inputTextからjson配列を切り出し，必要なメッセージを取り出す
 * 
 * @param inputText 
 * @return 
 */
export const extractCategoryFromConversation =
    ((inputText: string): {
        'beforeJson': string,
        'jsonObject': string[],
        'afterJson': string,
    } | null => {
        // 不要なメッセージを削除
        inputText = inputText.replace(/あなたの会話からおすすめの観光スポットのカテゴリを絞り込みました。/, '');
        inputText = inputText.replace(/：/, '');
        console.log(inputText);

        const jsonStart = '```json';
        const jsonEnd = '```';

        const jsonStartIndex = inputText.indexOf(jsonStart);
        const jsonEndIndex = inputText.indexOf(jsonEnd, jsonStartIndex + jsonStart.length);

        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            const jsonString = inputText.substring(jsonStartIndex + jsonStart.length, jsonEndIndex);
            const beforeJson = inputText.substring(0, jsonStartIndex);
            const afterJson = inputText.substring(jsonEndIndex + jsonEnd.length);
            console.log('jsonString', jsonString);

            // JSON文字列をパースしてJavaScriptオブジェクトに変換
            let jsonObject: string[];
            try {
                jsonObject = JSON.parse(jsonString);
                jsonObject = jsonObject.map(item => item.toLowerCase());
            } catch (error) {
                console.error('JSONのパース中にエラーが発生しました:', error);
                return null;
            }

            // 連想配列に格納
            const result = {
                'beforeJson': beforeJson,
                'jsonObject': jsonObject,
                'afterJson': afterJson,
            };
            console.log('パージした配列：', jsonObject);
            return result;

        } else {
            console.log('分解失敗');
            return null;
        }
    });


/**
 * ```json[string,string,...]```を配列に変換する
 * @param response ChatGPTからの回答
 * @returns string配列
 */
export const parseGptResponse = ((GptResponse: string): string[] | unknown => {
    let jsonString: string;

    // GptResponse に '```json' が含まれているかを確認
    if (GptResponse.includes('```json')) {
        // 文字列からJSON文字列部分を抽出
        const jsonStartIndex: number = GptResponse.indexOf('```json') + '```json'.length;
        const jsonEndIndex: number = GptResponse.lastIndexOf('```');
        jsonString = GptResponse.slice(jsonStartIndex, jsonEndIndex);
    } else {
        // '```json' が含まれていない場合、GptResponse 自体を JSON 文字列として扱う
        jsonString = GptResponse;
    }

    try {
        // JSON文字列をパースして配列に変換
        const jsonArray: string[] = JSON.parse(jsonString);
        const stringArray: string[] = jsonArray.map(item => item.toLowerCase());
        return stringArray;
    }
    catch (error) {
        throw error;
    }

});