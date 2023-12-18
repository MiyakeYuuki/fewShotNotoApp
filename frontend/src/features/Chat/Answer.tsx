import React from "react";
import { Grid } from "@mui/material";
import {
    MyCard,
    MyCardHeader,
    MyDivContainer
} from '../../styles/styles';
import { useAppState } from '../../pages/Chat/ChatProvider';
import AnswerText from '../../components/SplitText';

/**
 * チャットからの回答出力コンポーネント
 * 
 * @param answer 回答
 * @returns 回答出力フィールド
 */
const Answer: React.FC = () => {
    const { state } = useAppState();
    const { answer, loadingFlg } = state;
    return (
        < MyDivContainer>
            <Grid container direction="column" alignItems="center">
                {!loadingFlg && answer &&
                    <MyCard >
                        <MyCardHeader title="Answer" />
                        <AnswerText displayText={answer} />
                    </MyCard>
                }
            </Grid>
        </MyDivContainer>
    );
};

export default Answer;