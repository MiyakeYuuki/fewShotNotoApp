import React, { useState, FormEvent, useRef } from 'react';
import { getGptResponse, getTestResponse, getCategoryFC } from '../controller/ChatController';
import { pushConversation as pushConversation, useLoadingEffect, extractCategoryFromConversation } from './ChatUtil';
import { getSpots } from '../model/GetFirestoreModel';
import ChatMemo from './ChatMemo';
import { Results } from "../types";
import {
    TextField,
    Grid,
    CardActions,
} from "@mui/material";
import { MyButton, MyCard, MyDivContainer, MyCardHeader } from './../styles/Styles';
import ReactLoading from "react-loading";

const App: React.FC = () => {

    const [message, setMessage] = useState<string>('');             // ユーザーからの質問
    const [answer, setAnswer] = useState<string>('');               // GPTからの回答
    const [conversation, setConversation] = useState<{ role: string; content: string; }[]>([]); // 会話内容
    const [loading, setLoading] = useState<boolean>(false);         // ローディング中フラグ
    const prevMessageRef = useRef<string>('');                      // 前回のユーザーからの質問
    const [spots, setSpots] = useState<Results[]>([]);              // FireStoreから取得する観光地ドキュメント
    const [startChat, setStartChat] = useState<boolean>(false);     // チャット開始フラグ
    const [restartChat, setRestartChat] = useState<boolean>(false); // チャット再スタートフラグ
    const maxMessageLength: number = 50;                            // 質問の最大入力文字数
    useLoadingEffect(loading, setLoading);

    /**
     * チャットを開始するボタン押下時処理
     */
    const handleStartChat = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // チャット開始フラグを立てる
        setStartChat(true);

        setLoading(true);

        // ChatGPTから回答取得
        const message = ''; // 空の質問を設定
        let responseText: string | null = "";
        try {
            // ChatGPTから回答取得
            responseText = await getTestResponse(message, conversation);
            if (responseText == null) {
                throw new Error();
            }
            // 会話を保存
            pushConversation(responseText, message, conversation, setConversation, setMessage);
        } catch (error) {
            alert("ネットワークエラーが発生しました。再度時間を空けてお試しください。" + error);
            alert("チャット開始画面に戻ります。");
            setLoading(false);
            setStartChat(false);
            return;
        }

        // Function Calling呼び出し
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待つ
            const response = await getCategoryFC(responseText);
            if (response == null) {
                throw new Error();
            }
        } catch (error) {
            alert("ネットワークエラーが発生しました。再度時間を空けてお試しください。" + error);
            alert("チャット開始画面に戻ります。");
            setLoading(false);
            setStartChat(false);
            return false;
        }

        // 会話の保存
        pushConversation(responseText, message, conversation, setConversation, setMessage);

        setAnswer(responseText);
        setLoading(false);
    }

    const handleChatRestart = () => {
        window.location.reload();
    }

    /**
     * 質問するボタン押下時処理
     * 
     * @param event 
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

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
        if (loading) return;
        setLoading(true);
        let responseText: string | null = "";
        try {
            // ChatGPTから回答取得
            responseText = await getGptResponse(message, conversation) as string;
            if (responseText == null) {
                throw new Error();
            }
            // 会話を保存
            pushConversation(responseText, message, conversation, setConversation, setMessage);
        } catch (error) {
            alert("ネットワークエラーが発生しました。再度時間を空けてお試しください。" + error);
            alert("チャット開始画面に戻ります。");
            setLoading(false);
            setStartChat(false);
            return;
        }

        // Function Calling呼び出し
        // try {
        //     await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待つ
        //     const response = await getCategoryFC(responseText);
        //     if (response == null) {
        //         throw new Error();
        //     }
        // } catch (error) {
        //     alert("ネットワークエラーが発生しました。再度時間を空けてお試しください。" + error);
        //     alert("チャット開始画面に戻ります。");
        //     setLoading(false);
        //     setStartChat(false);
        //     return false;
        // }

        // 最終的な出力かチェック
        if (responseText.indexOf('あなたの会話からおすすめの観光スポットのカテゴリを絞り込みました') !== -1) {
            try {
                // ChatGPTの回答を配列にパージ
                const purgeMessage: {
                    'beforeJson': string,
                    'jsonObject': string[],
                    'afterJson': string,
                } | null = extractCategoryFromConversation(responseText);

                // パージできた場合の処理
                if (purgeMessage) {
                    const keywordArray: string[] = purgeMessage['jsonObject'] as string[];
                    console.log('keywordArray', keywordArray);
                    // keyword配列から観光地を取得
                    const spotsArray: Results[] | undefined = await getSpots(keywordArray);
                    console.log('spotsArray', spotsArray);
                    setSpots(spotsArray as Results[]);
                    responseText = purgeMessage['beforeJson'] + purgeMessage['afterJson'];
                    // チャットを終了する
                    setAnswer(responseText);
                    setRestartChat(true);
                    setLoading(false);
                }
                else {
                    throw new Error();
                }

            } catch (error) {
                setLoading(false);
                alert("申し訳ございません。正常な回答が得られませんでした。質問内容を変えて再度お試しください。チャット開始画面に戻ります。");
                window.location.reload();
            }
        }
        else {
            setAnswer(responseText);
            setLoading(false);
            // 今回の質問を格納
            prevMessageRef.current = message;
        }

    };

    return (
        <div>
            <MyDivContainer>
                <Grid container direction="column" alignItems="center">
                    {!startChat ? (
                        <MyCard>
                            <MyCardHeader title="Let's Chat for your travel" /><br />
                            <form onSubmit={handleStartChat}>
                                <MyButton
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                >
                                    チャットを開始する
                                </MyButton>
                            </form>
                        </MyCard>
                    ) : (
                        <MyCard>
                            <MyCardHeader title="Enter your question" /><br />
                            {!restartChat ?
                                (<form onSubmit={handleSubmit}>
                                    <TextField
                                        rows={5}
                                        placeholder="例：家族旅行でおしゃれで海の見えるところに行きたいです。帰りにお土産も購入できる観光地を教えてください。"
                                        value={message}
                                        multiline
                                        variant="outlined"
                                        fullWidth
                                        disabled={loading}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setMessage(e.target.value);
                                        }}
                                    />
                                    <p style={{ textAlign: 'right', ...(message.length > maxMessageLength ? { color: 'red' } : {}) }}>
                                        入力文字数:{message.length}/{maxMessageLength}
                                    </p>

                                    <CardActions>
                                        <MyButton
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                            size="large"
                                            disabled={loading}
                                        >
                                            質問する
                                        </MyButton>
                                    </CardActions>
                                </form>
                                ) : (
                                    <form onSubmit={handleChatRestart}>
                                        <CardActions>
                                            <MyButton
                                                type="submit"
                                                color="primary"
                                                variant="contained"
                                                size="large"
                                            >
                                                もう一度チャットを開始する
                                            </MyButton>
                                        </CardActions>
                                    </form>
                                )}
                        </MyCard>
                    )}

                    {loading && (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div>
                                <br />
                                <ReactLoading
                                    type="spin"
                                    color="black"
                                    height={20}
                                    width={20}
                                />
                            </div>
                        </div>
                    )}
                </Grid>
            </MyDivContainer>

            {answer && !loading && <ChatMemo prevMessage={prevMessageRef.current} answer={answer} spots={spots} />}

        </div >
    );
};

export default App;





