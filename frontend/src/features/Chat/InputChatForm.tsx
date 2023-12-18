import React from "react";
import { CardActions, TextField } from "@mui/material";
import {
    MyButton,
} from "../../styles/styles";
import { useAppState } from "../../pages/Chat/ChatProvider";
import { maxMessageLength } from "../../pages/Chat/constants";

type InputChatFormProps = {
    handleSubmit: React.FormEventHandler<HTMLFormElement>;
};

const InputChatForm: React.FC<InputChatFormProps> = ({
    handleSubmit,
}) => {
    const { state, dispatch } = useAppState();
    const { message, loadingFlg } = state;
    const setMessage = (message: string) => dispatch({ type: 'setMessage', payload: message });
    return (
        <form onSubmit={handleSubmit}>
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
            <p
                style={{
                    textAlign: "right",
                    ...(message.length > maxMessageLength ? { color: "red" } : {}),
                }}
            >
                入力文字数:{message.length}/{maxMessageLength}
            </p>
            <CardActions>
                <MyButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={
                        loadingFlg || message.length === 0 || message.length > maxMessageLength
                    }
                >
                    質問する
                </MyButton>
            </CardActions>
        </form>
    );
};

export default InputChatForm;