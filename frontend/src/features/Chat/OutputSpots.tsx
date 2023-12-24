import React, { useState } from 'react';
import {
  Grid,
  AppBar,
  Tab,
} from "@mui/material";
import { TabPanel, TabContext, TabList } from '@mui/lab';
import {
  MyCard,
  MyCardHeader,
  MyDivContainer
} from '../../styles/styles';
import TextWithoutSpots from './TextWithoutSpots';
import SpotCard from './SpotCard';
import { useAppState } from '../../pages/Chat/ChatProvider';
import Map from './Map';

/**
 * 観光地出力コンポーネント
 * 
 * @param spots 観光地
 * @returns 観光地出力結果
 */
const OutputSpots: React.FC = () => {
  const { state } = useAppState();
  const [value, setValue] = useState('0');
  const { spots, loadingFlg, startChatFlg } = state;
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <MyDivContainer>
      <Grid container direction="column" alignItems="center">
        {startChatFlg && !loadingFlg &&
          <MyCard>
            <MyCardHeader title="Recommended spots for you" /><br />
            {spots.length === 0 ? (
              <TextWithoutSpots />
            ) : (
              <TabContext value={value}>
                <AppBar position="static" color="default">
                  <TabList
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="LIST" value={"0"} />
                    <Tab label="MAP" value={"1"} />
                  </TabList>
                </AppBar>
                <TabPanel value={"0"}>
                  {spots.map((spot) => (
                    <SpotCard key={spot.id} spot={spot} />
                  ))}

                </TabPanel>
                <TabPanel value={"1"}>
                  <Map spots={spots} />
                </TabPanel>
              </TabContext>
            )
            }
          </MyCard>
        }
      </Grid >
    </MyDivContainer >
  );
};

export default OutputSpots;