import React, { createContext, Dispatch, useReducer, ReactNode, useContext } from 'react';
import { typeMessage } from '../../features/Chat/InputChat';
import { typeSpots } from '../../functions/FirestoreFunction';

// アクションの型を定義
type Action =
    | { type: 'setMessage'; payload: string }
    | { type: 'setAnswer'; payload: string }
    | { type: 'setConversation'; payload: typeMessage[] }
    | { type: 'setSpots'; payload: typeSpots[] }
    | { type: 'setLoadingFlg'; payload: boolean }
    | { type: 'setStartChatFlg'; payload: boolean }
    | { type: 'setRestartChat'; payload: boolean };

// State の型を定義
interface State {
    message: string;
    answer: string;
    conversation: typeMessage[];
    spots: typeSpots[];
    loadingFlg: boolean;
    startChatFlg: boolean;
    restartChatFlg: boolean;
}

// 初期ステートの定義
const initialState: State = {
    message: '',
    answer: '',
    conversation: [],
    spots: [],
    loadingFlg: false,
    startChatFlg: false,
    restartChatFlg: false,
};

// コンテキストの作成
export const ChatContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined);

// リデューサーの定義
const chatReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setMessage':
            return { ...state, message: action.payload };
        case 'setAnswer':
            return { ...state, answer: action.payload };
        case 'setConversation':
            return { ...state, conversation: action.payload };
        case 'setSpots':
            return { ...state, spots: action.payload };
        case 'setLoadingFlg':
            return { ...state, loadingFlg: action.payload };
        case 'setStartChatFlg':
            return { ...state, startChatFlg: action.payload };
        case 'setRestartChat':
            return { ...state, restartChatFlg: action.payload };
        default:
            return state;
    }
}

// ChatProvider コンポーネント
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    return (
        <ChatContext.Provider value={{ state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};

// カスタムフックを作成
export const useAppState = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
};