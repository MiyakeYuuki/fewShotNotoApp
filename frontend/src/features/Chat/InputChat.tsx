import React, { FormEventHandler, useContext } from "react";
import { TextField } from "@mui/material";
import { MyCard, MyDivContainer, MyCardHeader, MyButton } from '../../styles/styles';
import {
    CardActions,
    Grid,
} from "@mui/material";
import { MessageContext } from "../../pages/Chat/Chat";

export type typeMessage = { role: string; content: string; name?: string };

type InputChatProps = {
    loadingFlg: boolean,
    startChatFlg: boolean,
    restartChatFlg: boolean,
    maxMessageLength: number,
    handleStartChat: FormEventHandler<HTMLFormElement>,
    handleSubmit: FormEventHandler<HTMLFormElement>,
    handleChatRestart: FormEventHandler<HTMLFormElement>,
}

/**
 * チャット入力コンポーネント
 * 
 * @param loadingFlg  ローディングフラグ
 * @param startChatFlg チャット開始フラグ
 * @param restartChatFlg チャット再スタートフラグ
 * @param maxMessageLength 入力文字数上限
 * @param handleStartChat
 * @param handleSubmit
 * @param handleChatRestart
 * @return チャット入力フィールド
 */
const InputChat: React.FC<InputChatProps> = ({
    loadingFlg,
    startChatFlg,
    restartChatFlg,
    maxMessageLength,
    handleStartChat,
    handleSubmit,
    handleChatRestart,
}) => {
    const { message, setMessage } = useContext(MessageContext);
    return (
        <MyDivContainer>
            <Grid container direction="column" alignItems="center">
                {!startChatFlg ? (
                    <MyCard>
                        <MyCardHeader title="Let's chat for your travel" /><br />
                        <form onSubmit={handleStartChat}>
                            <CardActions>
                                <MyButton
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                >
                                    チャットを開始する
                                </MyButton>
                            </CardActions>
                        </form>
                    </MyCard>
                ) : (
                    <MyCard>
                        <MyCardHeader title="Enter your question" /><br />
                        {!restartChatFlg ?
                            (<form onSubmit={handleSubmit}>
                                <TextField
                                    rows={3}
                                    placeholder="例：家族旅行でおしゃれで海の見えるところに行きたいです。帰りにお土産も購入できる観光地を教えてください。"
                                    value={message}
                                    multiline
                                    variant="outlined"
                                    fullWidth
                                    disabled={loadingFlg}
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
                                        disabled={loadingFlg}
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
                                        >
                                            もう一度チャットを開始する
                                        </MyButton>
                                    </CardActions>
                                </form>
                            )}
                    </MyCard>
                )}

            </Grid>
        </MyDivContainer>

    );
};

export default InputChat;