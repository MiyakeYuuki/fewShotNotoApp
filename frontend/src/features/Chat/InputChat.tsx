import React, { FormEventHandler } from "react";
import Button from "../../components/Button";
import InputChatForm from "./InputChatForm";
import { MyCard, MyDivContainer, MyCardHeader } from '../../styles/styles';
import {
    Grid,
} from "@mui/material";
import { useAppState } from '../../pages/Chat/ChatProvider';

export type typeMessage = { role: string; content: string; name?: string };

type InputChatProps = {
    handleStartChat: FormEventHandler<HTMLFormElement>,
    handleSubmit: FormEventHandler<HTMLFormElement>,
    handleRestartChat: FormEventHandler<HTMLFormElement>,
}

/**
 * チャット入力コンポーネント
 * 
 * @param handleStartChat
 * @param handleSubmit
 * @param handleChatRestart
 * @return チャット入力フィールド
 */
const InputChat: React.FC<InputChatProps> = ({
    handleStartChat,
    handleSubmit,
    handleRestartChat,
}) => {
    const { state } = useAppState();
    const { startChatFlg, restartChatFlg } = state;

    return (
        <MyDivContainer>
            <Grid container direction="column" alignItems="center">
                {!startChatFlg ? (
                    <MyCard>
                        <MyCardHeader title="Let's chat for your travel" /><br />
                        <Button
                            buttonDisplayName="チャットを開始する" formHandler={handleStartChat}
                        />
                    </MyCard>
                ) : (
                    <MyCard>
                        <MyCardHeader title="Input your question" /><br />
                        {!restartChatFlg ?
                            (
                                <InputChatForm handleSubmit={handleSubmit} />
                            ) : (
                                <Button
                                    buttonDisplayName="もう一度チャットを開始する" formHandler={handleRestartChat}
                                />
                            )}
                    </MyCard>
                )}

            </Grid>
        </MyDivContainer>

    );
};

export default InputChat;