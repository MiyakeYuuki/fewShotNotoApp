import React, { FormEvent, useRef } from 'react';
import {
    addConversation,
    ArrayToLowerCase,
    fetchAnswer,
    extractKeywords,
    inferTourismTheme
} from './ChatUtil';
import { fetchSpots, typeSpots, fetchKeywords } from '../../functions/FirestoreFunction';
import { useAppState } from './ChatProvider';
import { maxConversationTimes, fcCallConversationTimes } from './constants';

import InputChat, { typeMessage } from '../../features/Chat/InputChat';
import Answer from '../../features/Chat/Answer';
import OutputPrevMessage from '../../features/Chat/OutputPrevMessage';
import Loading from '../../components/Loading';
import OutputSpots from '../../features/Chat/OutputSpots';

const Chat: React.FC = () => {
    // 自作フックを使用して ChatProvider から state と dispatch を取得
    const { state, dispatch } = useAppState();

    // ChatProvider で提供される state のプロパティを参照
    const { message, conversation, loadingFlg } = state;

    // ChatProvider で提供される dispatch を使用してアクションをディスパッチ
    const setMessage = (message: string) => dispatch({ type: 'setMessage', payload: message });
    const setAnswer = (answer: string) => dispatch({ type: 'setAnswer', payload: answer });
    const setConversation = (conversation: typeMessage[]) => dispatch({ type: 'setConversation', payload: conversation });
    const setSpots = (spots: typeSpots[]) => dispatch({ type: 'setSpots', payload: spots });
    const setLoadingFlg = (loadingFlg: boolean) => dispatch({ type: 'setLoadingFlg', payload: loadingFlg });
    const setStartChatFlg = (startChatFlg: boolean) => dispatch({ type: 'setStartChatFlg', payload: startChatFlg });
    const setRestartChat = (restartChatFlg: boolean) => dispatch({ type: 'setRestartChat', payload: restartChatFlg });

    // 前回のユーザーからの質問
    const prevMessageRef = useRef<string>('');

    /**
     * チャットを開始するボタン押下時処理
     */
    const handleStartChat = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // チャット開始フラグを立てる
        setStartChatFlg(true);
        setLoadingFlg(true);

        // 観光地に関わるキーワードを取得
        const keywordData: string[] = await fetchKeywords() as string[];

        // ユーザーへの最初の質問を取得
        const firstQuestion: string | null = await fetchAnswer(message, conversation, keywordData);
        if (firstQuestion === null) {
            catchNetworkError();
            return false;
        }

        addConversation(firstQuestion, message, conversation, setConversation);
        setMessage('');
        setAnswer(firstQuestion);
        setLoadingFlg(false);
    }

    /**
     * 質問するボタン押下時処理
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 最大会話数チェック
        if (conversation.length > maxConversationTimes) {
            alert("会話回数の上限に達しました。チャット開始画面に戻ります。");
            window.location.reload();
        }
        setLoadingFlg(true);

        // 観光地に関わるキーワードを取得
        const keywordData: string[] = await fetchKeywords() as string[];

        // ユーザーの質問から回答を取得する
        const answerToUser: string | null = await fetchAnswer(message, conversation, keywordData);
        if (answerToUser === null) {
            catchNetworkError();
            return false;
        }
        // 会話を保存
        addConversation(answerToUser, message, conversation, setConversation);
        setMessage('');

        // キーワードが抽出できたか判定(チャットの往復が3回以上の場合のみ)
        let spotsKeywords: string[] | string | null = '';
        if (conversation.length >= fcCallConversationTimes) {
            // 1秒待つ
            await new Promise((resolve) => setTimeout(resolve, 1000));
            spotsKeywords = await extractKeywords(answerToUser);
            if (spotsKeywords === null) {
                catchNetworkError();
                return false;
            }
        }

        // 最終的な出力かチェック
        if (spotsKeywords !== null && typeof spotsKeywords === 'object') {
            // 取得したキーワードをローワケースに変換
            const keywordArray: string[] | null = ArrayToLowerCase(spotsKeywords);
            if (keywordArray === null) {
                warningKeywords();
                return false;
            }
            console.log('keywordArray', keywordArray);

            // キーワードから観光地を取得
            const spotsArray: typeSpots[] | null = await fetchSpots(keywordArray as string[]);

            // 観光地が得られた場合
            if (spotsArray?.length !== 0) {
                console.log('spotsArray', spotsArray);
                setSpots(spotsArray as typeSpots[]);
                // ユーザの観光テーマを推測
                const tourismTheme = await inferTourismTheme(message, conversation, answerToUser);
                if (tourismTheme == null) {
                    catchNetworkError();
                    return false;
                }
                // チャットを終了する
                setAnswer(tourismTheme);
                setRestartChat(true);
                setLoadingFlg(false);
                return;
            }
            // 観光地が得られなかった場合
            else {
                warningKeywords();
                return false;
            }
        }
        // 抽出キーワードが日本語の場合
        else if (spotsKeywords === 'NG') {
            warningKeywords();
            return false;
        }
        // キーワードが抽出できなかった場合
        else if (spotsKeywords === 'stop' || spotsKeywords === '') {
            setAnswer(answerToUser);
            setLoadingFlg(false);
            // 今回の質問を格納
            prevMessageRef.current = message;
        } else {
            catchNetworkError();
            return false;
        }
    };

    /**
     * チャット再開始処理
     */
    const handleRestartChat = () => {
        window.location.reload();
    }

    /**
     * ネットワークエラー時の処理
     */
    const catchNetworkError = () => {
        alert("ネットワークエラーが発生しました。再度時間を空けてお試しください。");
        alert("チャット開始画面に戻ります。");
        window.location.reload();
    }

    /**
     * 不適切なキーワードを抽出した場合の処理
     */
    const warningKeywords = () => {
        setLoadingFlg(false);
        alert("申し訳ございません。正常な回答が得られませんでした。質問内容を変えて再度お試しください。チャット開始画面に戻ります。");
        window.location.reload();
    }

    return (
        <div>
            <InputChat
                handleStartChat={handleStartChat}
                handleSubmit={handleSubmit}
                handleRestartChat={handleRestartChat}
            />
            <OutputPrevMessage prevMessage={prevMessageRef.current} />
            <Answer />
            <OutputSpots /><br />
            <Loading loadingFlg={loadingFlg} />
        </div >
    );
};

export default Chat;