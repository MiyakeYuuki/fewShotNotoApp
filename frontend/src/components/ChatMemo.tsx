import React from 'react';
import { Results } from "../types";
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
} from './../styles/Styles';

// ChatMemoの引数の型定義
interface ChatProps {
  prevMessage: string;
  answer: string;
  spots: Results[];
}

/**
 * Chat内容のメモ化を行いレンダー処理を軽減する
 * @param prevMessage 直前の質問
 * @param answer 回答
 * @returns 再利用後のチャット内容
 */
const ChatMemo: React.FC<ChatProps> = ({ prevMessage, answer, spots }) => {
  return (
    <div>
      <MyDivContainer>
        <Grid container direction="column" alignItems="center">
          {prevMessage &&
            <MyCard >
              <MyCardHeader title="Your Question" />
              <p>{prevMessage}</p>
            </MyCard>
          }

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

        </Grid>
      </MyDivContainer>
    </div >
  );
};

export default ChatMemo;