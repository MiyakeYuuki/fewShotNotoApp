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
 * バックエンドに送信するリクエスト型
 */
type typeSendData = {
    method: string;
    headers: {
        'Content-Type': string,
    },
    body: string,
}

/**
 * ユーザーの質問から回答を取得する
 * 
 * @param messages 会話内容
 * @param keywordData 観光地に関わる全てのキーワード
 * @returns 成功：GPTからの回答(json)、失敗：null
 */
export const feachAnswerFromEndpoint = async (
    messages: { role: string; content: string; }[],
    keywordData: string
): Promise<typeResponseChatGPTAPI | null> => {
    console.log('▼----- Start ChatGptFunction feachAnswerFromEndpoint -----▼');
    console.log('Input', JSON.stringify({ content: messages }));
    try {
        // postで送るデータ
        const sendData: typeSendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation: messages, keyword: keywordData }),
        };

        // エンドポイントにリクエスト送信
        const response = await fetch(baseUrl + '/gpt/ask', sendData);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 回答の取得
        console.log('▲----- Finish ChatGptFunction feachAnswerFromEndpoint -----▲');
        return await response.json();

    } catch (error) {
        if (error === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Fetch error:', error);
        }
        console.log('▲----- Error ChatGptFunction feachAnswerFromEndpoint -----▲');
        return null;
    }
}

/**
 * 会話内容からユーザーの観光テーマを推測する
 * 
 * @param messages 会話内容
 * @returns 成功：観光テーマ(json)、失敗：null
 */
export const inferTourismThemeFromEndpoint = async (
    messages: { role: string; content: string; }[],
): Promise<typeResponseChatGPTAPI | null> => {
    console.log('▼----- Start ChatGptFunction inferTourismThemeFromEndpoint -----▼');
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

        // エンドポイントにリクエスト送信
        const response = await fetch(baseUrl + '/gpt/askfortheme', sendData);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 回答の取得
        console.log('▲----- Finish ChatGptFunction inferTourismThemeFromEndpoint -----▲');
        return await response.json();

    } catch (error) {
        console.log('▲----- Error ChatGptFunction inferTourismThemeFromEndpoint -----▲');
        if (error === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Fetch error:', error);
        }
        return null;
    }
}

/**
 * 会話からキーワードが抽出できたか判断する
 * 
 * @param message GPTからの返答
 * @return 成功：キーワード、失敗：null 
 */
export const extractKeywordsFromEndpoint = async (
    message: string
): Promise<typeResponseFunctionCalling | null> => {
    console.log('▼----- Start ChatGptFunction extractKeywordsFromEndpoint -----▼');
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

        // FunctionCallingを呼び出し(エンドポイント)
        const response = await fetch(baseUrl + '/gpt/func', sendData);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log('▲----- Finish ChatGptFunction extractKeywordsFromEndpoint -----▲');
        return await response.json();

    } catch (error) {
        console.log('▲----- Error ChatGptFunction extractKeywordsFromEndpoint -----▲');
        if (error === 'AbortError') {
            console.log('Fetch aborted');
        } else {
            console.error('Fetch error:', error);
        }
        return null;
    }
}