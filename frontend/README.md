## はじめに
本ディレクトリはフロントエンドソースコードを格納するディレクトリです．

## 環境構築
|              |      |
| ------------ | ---- |
| React        | 18.2 |
| TypeScript   | 4.9  |
| mui/material | 5.14 |

※その他のライブラリはpackage.json参照

### 実行コマンド
```
npx create-react-app --template typescript [プロジェクト名]\
npm install firebase\
npm install npm install @mui/material @emotion/react @emotion/styled
```

## アプリのデプロイ方法
```
firebase login
npm run build
firebase deploy
```

参考：<https://yoheiko.com/blog/post-769/>

### 環境変数
環境変数は.env.localに以下の変数を格納する．\
※空文字が格納されている変数は各自の環境に合わせて設定する．\
```
REACT_APP_GPTAPIKEY = ""\
REACT_APP_GPTURL="https://api.openai.com/v1/chat/completions"\
REACT_APP_GPTMODEL="gpt-3.5-turbo"\
REACT_APP_APIKEY=""\
REACT_APP_AUTHDOMAIN=""\
REACT_APP_DATABASEURL=""\
REACT_APP_PROJECT_ID=""\
REACT_APP_STORAGE_BUCKET=""\
REACT_APP_MESSAGING_SENDER_ID=""\
REACT_APP_APP_ID=""\
REACT_APP_MEASUREMENT_ID=""\
REACT_APP_MAIL_URL=""\
```