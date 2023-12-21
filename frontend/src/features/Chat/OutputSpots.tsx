import React, { useState } from 'react';
import {
  Grid,
  AppBar,
  Typography,
  Tabs,
  Tab
} from "@mui/material";
import {
  MyCard,
  MyCardHeader,
  MyDivContainer
} from '../../styles/styles';
import TextWithoutSpots from './TextWithoutSpots';
import SpotCard from './SpotCard';
import { useAppState } from '../../pages/Chat/ChatProvider';
import Map from '../Map/Map';

/**
 * タブのラベルとコンテンツの関連付け
 * @param {number} index タブのインデックス 
 * @returns {object} タブのラベルとコンテンツの関連付け
 */
const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

/**
 * タブコンポーネント
 * @param {object} children 子要素
 * @param {number} index タブのindex
 * @param {number} value アクティブなタブのindex
 * @param {object} other その他の引数
 * @returns {TSX.Element} タブコンポーネント
 */
const TabPanel: React.FC<{
  children?: React.ReactNode;
  index: number;
  value: number;
}> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Typography component="div" p={2}>
        {children}
      </Typography>
    )}
  </div>
);


/**
 * 観光地出力コンポーネント
 * 
 * @param spots 観光地
 * @returns 観光地出力結果
 */
const OutputSpots: React.FC = () => {
  const { state } = useAppState();
  const [value, setValue] = useState(0);
  const { spots, loadingFlg, startChatFlg } = state;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <MyDivContainer>
      <Grid container direction="column" alignItems="center">
        {startChatFlg && !loadingFlg &&
          <MyCard>
            <MyCardHeader title="Recommended spots for you" /><br />
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="LIST" {...a11yProps(0)} />
                <Tab label="MAP" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              {spots.length === 0 ? (
                <TextWithoutSpots />
              ) : (
                spots.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))
              )
              }
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Map spots={spots} />
            </TabPanel>
          </MyCard>
        }
      </Grid>
    </MyDivContainer >
  );
};

export default OutputSpots;