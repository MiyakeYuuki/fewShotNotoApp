import React from 'react';
import {
  Grid
} from "@mui/material";
import {
  MyCard,
  MyCardHeader,
  MyDivContainer
} from '../../styles/styles';
import TextWithoutSpots from './TextWithoutSpots';
import SpotCard from './SpotCard';
import { useAppState } from '../../pages/Chat/ChatProvider';

/**
 * 観光地出力コンポーネント
 * 
 * @param spots 観光地
 * @returns 観光地出力結果
 */
const OutputSpots: React.FC = () => {
  const { state } = useAppState();
  const { spots, loadingFlg, startChatFlg } = state;
  return (
    <MyDivContainer>
      <Grid container direction="column" alignItems="center">
        {startChatFlg && !loadingFlg &&
          <MyCard>
            <MyCardHeader title="Recommended spots for you" /><br />
            {spots.length === 0 ? (
              <TextWithoutSpots />
            ) : (spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))
            )}
          </MyCard>
        }
      </Grid>
    </MyDivContainer >
  );
};

export default OutputSpots;