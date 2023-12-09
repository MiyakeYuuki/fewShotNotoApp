// ベースURL
const baseUrl = process.env.REACT_APP_BACKEND_SERVER_URL;

/**
 * FunctionCallingの戻り値
 * 
 * @property status - succes or false
 * @property response - FunctionCallingの戻り値
 */
export type typeResponseFunctionCalling = {
    status: string,
    response: {
        index: number;
        message: {
            role: string;
            content: null | string;
            function_call: {
                name: string;
                arguments: string;
            };
        };
        finish_reason: 'function_call' | 'stop';
    }
};

/**
 * ChatGPTAPIの戻り値
 * 
 * @property status - succes or false
 * @property response - FunctionCallingの回答
 */
export type typeResponseChatGPTAPI = {
    status: string,
    response: string,
};

/**
 * 
 */
type typeSendData = {
    method: string;
    headers: {
        'Content-Type': string,
    },
    body: string,
}

/**
 * 質問内容からチャットを行う
 * 
 * @param messages 前回の会話内容
 * @param keywordData FireStoreから得られたキーワード
 * @returns レスポンス(json)
 */
export const feachGptResponse = async (
    messages: { role: string; content: string; }[],
    keywordData: string
) => {
    console.log('▼----- Start GetGptResponseModel feachGptResponse -----▼');
    console.log(JSON.stringify({ content: messages }));
    try {
        // postで送るデータ
        const sendData: typeSendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation: messages, keyword: keywordData }),
        };

        // バックエンドサーバーにリクエスト送信
        const response = await fetch(baseUrl + '/gpt/ask', sendData);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 回答の取得
        console.log('▲----- Finish GetGptResponseModel feachGptResponse -----▲');
        return await response.json();

    } catch (error) {
        console.log('▲----- Error GetGptResponseModel feachGptResponse -----▲');
        if (error === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Fetch error:', error);
        }
    }
}

/**
 * 会話内容からユーザーの観光テーマを推測する
 * 
 * @param messages 会話内容
 * @returns レスポンス(json)
 */
export const feachGptResponseForTheme = async (
    messages: { role: string; content: string; }[],
) => {
    console.log('▼----- Start GetGptResponseModel feachGptResponse -----▼');
    console.log(JSON.stringify({ content: messages }));
    try {
        // postで送るデータ
        const sendData: typeSendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation: messages }),
        };

        // バックエンドサーバーにリクエスト送信
        const response = await fetch(baseUrl + '/gpt/askfortheme', sendData);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 回答の取得
        console.log('▲----- Finish GetGptResponseModel feachGptResponse -----▲');
        return await response.json();

    } catch (error) {
        console.log('▲----- Error GetGptResponseModel feachGptResponse -----▲');
        if (error === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Fetch error:', error);
        }
    }
}

/**
 * 会話からキーワードが抽出できたかFunctionCallingで判断
 * 
 * @param message GPTからの返答
 * @return カテゴリ 
 */
export const fetchExtractingCategory = async (message: string) => {
    console.log('▼----- Start GetGptResponseModel fetchExtractingCategory -----▼');
    console.log('Input', message);

    try {
        // postで送るデータ
        const sendData: typeSendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        };

        // FunctionCallingを呼び出し(バックエンドサーバ)
        const response = await fetch(baseUrl + '/gpt/func', sendData);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log('▲----- Finish GetGptResponseModel fetchExtractingCategory -----▲');
        return await response.json();

    } catch (error) {
        console.log('▲----- Error GetGptResponseModel fetchExtractingCategory -----▲');
        if (error === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Fetch error:', error);
        }
    }
}