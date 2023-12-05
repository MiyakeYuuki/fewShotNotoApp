import React, { useState, FormEvent, useRef, createContext } from 'react';
import { pushConversation, ArrayToLowerCase, getGptResponse, getCategoryFC } from './ChatUtil';
import { getSpots, typeSpots } from '../../functions/FirestoreFunction';

import InputChat, { typeMessage } from '../../features/Chat/InputChat';
import Answer from '../../features/Chat/Answer';
import OutputPrevMessage from '../../features/Chat/OutputPrevMessage';
import Loading from '../../components/Loading';
import OutputSpots from '../../features/Chat/OutputSpots';

type typeMessageContext = {
    message: string;
    setMessage: (value: string) => void;
}

export const MessageContext = createContext<typeMessageContext>({} as typeMessageContext);

const Chat: React.FC = () => {

    const [loadingFlg, setLoadingFlg] = useState<boolean>(false);       // ローディング中フラグ
    const [startChatFlg, setStartChatFlg] = useState<boolean>(false);   // チャット開始フラグ
    const [restartChatFlg, setRestartChat] = useState<boolean>(false);  // チャット再スタートフラグ

    const [message, setMessage] = useState<string>('');                 // ユーザーからの質問
    const [answer, setAnswer] = useState<string>('');                   // GPTからの回答
    const [conversation, setConversation] = useState<typeMessage[]>([]); // 会話内容
    const prevMessageRef = useRef<string>('');                          // 前回のユーザーからの質問

    const [spots, setSpots] = useState<typeSpots[]>([]);                // FireStoreから取得する観光地ドキュメント

    const maxMessageLength: number = 50;                                // 質問の最大入力文字数
    const maxConversationTimes: number = 5;                             // 最大会話回数
    const fcCallConversationTimes: number = 3;                          // FunctionCalling呼出回数

    /**
     * チャットを開始するボタン押下時処理
     */
    const handleStartChat = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // チャット開始フラグを立てる
        setStartChatFlg(true);

        setLoadingFlg(true);

        // ChatGPTから回答取得
        let responseText: string | null = "";
        try {
            responseText = await getGptResponse(message, conversation);
            if (responseText == null) {
                throw new Error();
            }
            // 会話を保存
            pushConversation(responseText, message, conversation, setConversation, setMessage);
        } catch (error) {
            catchNetworkError(error);
            return false;
        }

        setAnswer(responseText);
        setLoadingFlg(false);
    }

    /**
     * 質問するボタン押下時処理
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 最大会話数チェック
        if (conversation.length > maxConversationTimes) {
            alert("会話の上限に達しました。チャット開始画面に戻ります。");
            window.location.reload();
        }

        // 未入力チェック
        if (!message) {
            alert('メッセージがありません。');
            return;
        }

        // 入力文字数チェック
        if (message.length > maxMessageLength) {
            alert(maxMessageLength + '文字以内で入力してください。');
            return;
        }

        // ローディング中チェック
        if (loadingFlg) return;
        setLoadingFlg(true);

        // ChatGPTから回答取得
        let responseText: string | null = "";
        try {
            responseText = await getGptResponse(message, conversation);
            if (responseText == null) {
                throw new Error();
            }
            // 会話を保存
            pushConversation(responseText, message, conversation, setConversation, setMessage);
        } catch (error) {
            catchNetworkError(error);
            return false;
        }

        // Function Calling呼び出し(チャットの往復が3回以上の場合のみ)
        let response: string[] | string | null | undefined = '';
        if (conversation.length >= fcCallConversationTimes) {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待つ
                response = await getCategoryFC(responseText);
                if (response == null) {
                    throw new Error();
                }
            } catch (error) {
                catchNetworkError(error);
                return false;
            }
        }

        // 最終的な出力かチェック
        if (response !== 'stop' && typeof response === 'object') {
            try {
                // ChatGPTの回答を配列にパージ
                const keywordArray: string[] = ArrayToLowerCase(response);
                console.log('keywordArray', keywordArray);

                // keyword配列から観光地を取得
                const spotsArray: typeSpots[] | null = await getSpots(keywordArray as string[]);

                // 観光地が得られた場合
                if (spotsArray?.length !== 0) {
                    console.log('spotsArray', spotsArray);
                    setSpots(spotsArray as typeSpots[]);
                    // チャットを終了する
                    setAnswer(responseText);
                    setRestartChat(true);
                    setLoadingFlg(false);
                    return;
                }
                // 観光地が得られなかった場合
                else {
                    throw new Error();
                }
            } catch (error) {
                worningCategory();
                return false;
            }
        }
        // 抽出カテゴリが日本語の場合
        else if (response === 'NG') {
            worningCategory();
            return false;
        }

        setAnswer(responseText);
        setLoadingFlg(false);
        // 今回の質問を格納
        prevMessageRef.current = message;

    };

    /**
     * チャット再開始処理
     */
    const handleChatRestart = () => {
        window.location.reload();
    }

    /**
     * ネットワークエラー時の処理
     * 
     * @param error 
     */
    const catchNetworkError = (error: unknown) => {
        alert("ネットワークエラーが発生しました。再度時間を空けてお試しください。" + error);
        alert("チャット開始画面に戻ります。");
        window.location.reload();
    }

    /**
     * 不適切なカテゴリーを抽出した場合の処理
     */
    const worningCategory = () => {
        setLoadingFlg(false);
        alert("申し訳ございません。正常な回答が得られませんでした。質問内容を変えて再度お試しください。チャット開始画面に戻ります。");
        window.location.reload();
    }

    return (
        <div>
            <MessageContext.Provider value={{ message, setMessage }}>
                <InputChat
                    loadingFlg={loadingFlg}
                    startChatFlg={startChatFlg}
                    restartChatFlg={restartChatFlg}
                    maxMessageLength={maxMessageLength}
                    handleStartChat={handleStartChat}
                    handleSubmit={handleSubmit}
                    handleChatRestart={handleChatRestart}
                />
            </MessageContext.Provider>
            <OutputPrevMessage loadingFlg={loadingFlg} prevMessage={prevMessageRef.current} />
            <Answer loadingFlg={loadingFlg} answer={answer} />
            <OutputSpots loadingFlg={loadingFlg} startChatFlg={startChatFlg} spots={spots} /><br />
            <Loading loadingFlg={loadingFlg} />
        </div >
    );
};

export default Chat;