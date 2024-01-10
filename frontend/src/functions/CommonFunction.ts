/**
 * 配列の中身が英語かどうかチェック
 * 
 * @param stringArray 入力
 * @return 配列の中身がすべて英語の場合：true、配列の中身に英語以外が含まれている場合：false
 */
export const isEnglish = (stringArray: string[]): boolean => {
    console.log('▼----- Start CommonModel isEnglish -----▼');
    console.log('Input', stringArray);
    const englishRegex = /^[A-Za-z\s]+$/;
    console.log('▲----- Finish CommonModel isEnglish -----▲');
    return stringArray.every(element => englishRegex.test(element));
}