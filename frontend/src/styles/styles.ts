import { styled } from '@mui/material/styles';
import {
    Card,
    CardHeader,
    Button,
} from "@mui/material";

export const MyButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    flexGrow: 1,
    width: "100%",
}));

export const MyCardHeader = styled(CardHeader)(({ theme }) => ({
    textAlign: "center",
    background: "#212121",
    color: "#fff",
    padding: theme.spacing(2),
}));

export const MyCard = styled(Card)(({ theme }) => ({
    width: "100%",
    marginTop: theme.spacing(5),
    maxWidth: 400,
    margin: "0 auto",
    padding: theme.spacing(2),
    border: "1px solid #ccc",
}));

export const MyDivContainer = styled("div")(({ theme }) => ({
    display: "flex",
    width: "100%",
    margin: `${theme.spacing(0)} auto`,
    flexDirection: "column",
    autoComplete: "on",
}));

export const MyCardWithBorder = styled(Card)(({ theme }) => ({
    border: "1px solid #ccc", // 枠線のスタイル
}));

//エリア表示のボタンスタイル
export const areaButtonStyle = {
    backgroundColor: "#aac4f2",
    color: 'black',
    cursor: 'pointer',
    padding: '0px 10px',
    fontSize: '14px',
    width: 'auto', // 幅を自動調整
    display: 'inline-block',
};

// カテゴリ表示のボタンスタイル
export const categoryButtonStyle = {
    backgroundColor: "#f2b3aa",
    color: 'black',
    cursor: 'pointer',
    padding: '0px 10px',
    fontSize: '14px',
    width: 'auto', // 幅を自動調整
    display: 'inline-block',
};
// カテゴリ表示のボタンスタイル
export const keywordButtonStyle = {
    backgroundColor: "#f2f0aa",
    color: 'black',
    cursor: 'pointer',
    padding: '0px 10px',
    fontSize: '14px',
    width: 'auto', // 幅を自動調整
    display: 'inline-block',
};

export const pStyle: React.CSSProperties = {
    whiteSpace: 'pre-wrap' as 'pre-wrap', // 'pre-wrap'型として指定
    wordWrap: 'break-word' as 'break-word', // 'break-word'型として指定
};