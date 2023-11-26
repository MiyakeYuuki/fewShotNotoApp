import {
    DocumentData,
} from "firebase/firestore";

/**
 * spotsデータ型
 */
export interface Results {
    id: string,
    name: string;
    url: string;
    areaRef: DocumentData;
    categoryRef: DocumentData[string];
    keywordRef: DocumentData[string];
    area: string;
    category: string;
    keyword: string;
}

export type Role = "system" | "user" | "assistant" | "function";
export type Message = { role: Role; content: string; name?: string };

/**
 * FunctionCallingの戻り値
 * 
 * @property status - succes or false
 * @property response - FunctionCallingの戻り値
 */
export type ResponseFunctionCalling = {
    status: string,
    response: {
        index: number;
        message: {
            role: Role;
            content: null | string;
            function_call: {
                name: string;
                arguments: string;
            };
        };
        finish_reason: "function_call" | "stop";
    }
};

/**
 * ChatGPTAPIの戻り値
 * 
 * @property status - succes or false
 * @property response - FunctionCallingの戻り値
 */
export type ResponseChatGPTAPI = {
    status: string,
    response: string
};