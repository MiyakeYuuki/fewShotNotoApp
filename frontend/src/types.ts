import {
    DocumentData,
} from "firebase/firestore";

/**
 * axiosデータ型
 */
export interface AxiosResponse {
    data: string,
    status: number,
    statusText: string,
}

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

type FunctionParameterProperty = {
    type: string;
    description: string;
    enum?: string[];
};

type FunctionParameters = {
    type: string;
    properties: {
        [key: string]: FunctionParameterProperty;
    };
    required: string[];
};

/**
 * 関数オブジェクト
 * 
 * @property name - 関数の名前
 * @property description - 関数の説明
 * @property parameters - パラメータ
 * @property function_call
 */
export type FunctionObject = {
    name: string;
    description: string;
    parameters: FunctionParameters;
    function_call?: string;
};

export type FCResponse = {
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
};

export type MyError = {
    name: string;
}