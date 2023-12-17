import React from 'react';
import {
  Button,
  Typography,
  CardContent,
  Card,
  Grid
} from "@mui/material";
import {
  MyCard,
  areaButtonStyle,
  categoryButtonStyle,
  keywordButtonStyle,
  MyCardHeader,
  MyDivContainer
} from '../../styles/styles';
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
              <p>チャットからおすすめの観光地が絞りこめた場合に<br />
                ここに観光スポットが表示されます。<br /><br />
                チャットが進行しているのにも関わらず、<br />
                観光スポットが表示されない場合は、<br />
                もう少しチャットを続けてみてください。
              </p>
            ) : (spots.map((spot) => (
              <Card key={spot.id} style={{ border: '1px solid #ccc' }}>
                <CardContent>
                  <Typography variant="h6">
                    <strong>
                      名前：
                      <a href={spot.url} target="_blank" rel="noopener noreferrer">
                        {spot.name}
                      </a>
                    </strong>
                  </Typography>
                  <div>
                    エリア：
                    <Button
                      variant="contained"
                      style={areaButtonStyle}
                    //onClick={handleButtonClick}
                    >
                      {spot.area}
                    </Button>
                  </div>
                  <Typography variant="body1">
                    カテゴリ：
                    {spot.category
                      .split(',')
                      .map((category) => category.trim())
                      .filter(category => category !== "") // 空のカテゴリをフィルタリング
                      .map((category, index) => (
                        <Button
                          variant="contained"
                          style={categoryButtonStyle}
                          key={index} >
                          {category.trim()}
                          {/* onClick={handleButtonClick} */}
                        </Button>
                      ))}
                  </Typography>
                  <Typography variant="body1">
                    キーワード：
                    {spot.keyword
                      .split(',')
                      .map((keyword) => keyword.trim())
                      .filter(keyword => keyword !== "") // 空のキーワードをフィルタリング
                      .map((keyword, index) => (
                        <Button
                          variant="contained"
                          style={keywordButtonStyle}
                          key={index} >
                          {keyword.trim()}
                          {/* onClick={handleButtonClick} */}
                        </Button>
                      ))}
                  </Typography>
                </CardContent>
              </Card>
            ))
            )}
          </MyCard>
        }
      </Grid>
    </MyDivContainer >
  );
};

export default OutputSpots;