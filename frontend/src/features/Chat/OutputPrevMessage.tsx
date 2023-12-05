import type { RefObject } from 'react';
import {
    MyCard,
    MyCardHeader,
    MyDivContainer
} from '../../styles/styles';
import { Grid } from "@mui/material";

type OutputPrevMessageProps = {
    loadingFlg: boolean,
    prevMessage: string,
}

/**
 * 直前の質問出力コンポーネント
 * 
 * @param loadingFlg
 * @param prevMessage
 * @returns 直前の質問
 */
const OutputPrevMessage: React.FC<OutputPrevMessageProps> = ({ loadingFlg, prevMessage }) => {
    return (
        <MyDivContainer>
            <Grid container direction="column" alignItems="center">
                {!loadingFlg && prevMessage &&
                    <MyCard >
                        <MyCardHeader title="Your Question" />
                        <p>{prevMessage}</p>
                    </MyCard>
                }
            </Grid>
        </MyDivContainer>
    );
};

export default OutputPrevMessage;