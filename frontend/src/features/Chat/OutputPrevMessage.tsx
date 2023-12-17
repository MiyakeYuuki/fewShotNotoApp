import {
    MyCard,
    MyCardHeader, MyDivContainer
} from '../../styles/styles';
import { Grid } from "@mui/material";
import { useAppState } from '../../pages/Chat/ChatProvider';

type OutputPrevMessageProps = {
    prevMessage: string,
}

/**
 * 直前の質問出力コンポーネント
 * 
 * @param prevMessage 直前の質問
 * @returns 直前の質問フィールド
 */
const OutputPrevMessage: React.FC<OutputPrevMessageProps> = ({ prevMessage }) => {
    const { state } = useAppState();
    const { loadingFlg } = state;

    return (
        <MyDivContainer>
            <Grid container direction="column" alignItems="center">
                {!loadingFlg && prevMessage &&
                    <MyCard >
                        <MyCardHeader title="Your question" />
                        <p>{prevMessage}</p>
                    </MyCard>
                }
            </Grid>
        </MyDivContainer>
    );
};

export default OutputPrevMessage;