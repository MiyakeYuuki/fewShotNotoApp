import ReactLoading from "react-loading";

type LoadingProps = {
    loadingFlg: boolean,
}
/**
 * ローディング中エフェクトコンポーネント
 * 
 * @param loadingFlg
 * @return ローディング中エフェクト
 */
const Loading: React.FC<LoadingProps> = ({ loadingFlg }) => {
    return (
        <div>
            {loadingFlg && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <ReactLoading
                        type="spin"
                        color="black"
                        height={20}
                        width={20}
                    />
                </div>
            )}
        </div>

    );
};

export default Loading;