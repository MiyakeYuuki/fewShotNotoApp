import React from "react";
import { Grid } from "@mui/material";
import {
    MyCard,
    MyCardHeader,
    MyDivContainer
} from '../../styles/styles';

type AnswerProps = {
    loadingFlg: boolean,
    answer: string,
}

/**
 * チャットからの回答出力コンポーネント
 * 
 * @param answer 回答
 * @returns 回答出力フィールド
 */
const Answer: React.FC<AnswerProps> = ({ loadingFlg, answer }) => {
    return (
        < MyDivContainer>
            <Grid container direction="column" alignItems="center">
                {!loadingFlg && answer &&
                    <MyCard >
                        <MyCardHeader title="Answer" />
                        <p>{answer.split(/\n/)
                            .map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        {item}
                                        <br />
                                    </React.Fragment>
                                );
                            })
                        }
                        </p>
                    </MyCard>
                }
            </Grid>
        </MyDivContainer>
    );
};

export default Answer;