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