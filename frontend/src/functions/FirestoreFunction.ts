import {
    collection,
    getDocs,
    getDoc,
    query,
    where,
    doc,
    DocumentData,
    DocumentReference
} from "firebase/firestore";
import fireStoreDB from "../firestore";

/**
 * spotsデータ型
 */
export interface typeSpots {
    id: string,
    name: string;
    url: string;
    areaRef: DocumentData;
    categoryRef: DocumentData[string];
    keywordRef: DocumentData[string];
    area: string;
    category: string;
    keyword: string;
    geopoint: { latitude: number; longitude: number };
}

/**
 * fireStoreのkeywordコレクションを取得
 * @returns 成功：keywords、失敗：null
 */
export const fetchKeywords = async () => {
    try {
        const keywordListCollection = collection(fireStoreDB, "keywords");
        const keywordListSnapshot = await getDocs(keywordListCollection);
        const keywords: string[] = keywordListSnapshot.docs.map((doc) => doc.data().name); // keywordの中身
        return keywords;
    } catch (error) {
        console.error('Error fetching keywords:', error);
        return null;
    }
};

/**
 * keywordsを含む観光地を検索
 * @param keywords キーワード配列
 * @returns 成功：観光地、失敗：null
 */
export const fetchSpots = async (keywords: string[]) => {
    const spotsCollection = collection(fireStoreDB, "spots");

    // selectedCategories要素分mapでqueryを発行
    const keywordQueries = keywords.map((keyword) => {
        // doc(fireStoreDB, "keywords", selectedCategory) -> selectedCategoryをidに持つDocRef
        // keywordsFieldにDocRefを含む観光地のクエリ
        return query(spotsCollection, where("keywords", "array-contains", doc(fireStoreDB, "keywords", keyword)));
    });

    try {
        // クエリの実行 -> categorySnapShotsArrayに配列でまとめる
        const keywordSnapShotsArray = await Promise.all(keywordQueries.map(q => getDocs(q)));

        const uniqueResultsMap = new Map<string, typeSpots>(); // idをキーとする一意の結果を格納するマップ

        keywordSnapShotsArray.forEach(keywordSnapShots => {
            keywordSnapShots.docs.forEach(docs => {
                const docData = docs.data();
                const areaRef: DocumentData = doc(fireStoreDB, "area_list", docData.area.id);
                const categoryRef = docData.category;
                const keywordRef = docData.keywords;
                const id = docs.id;

                if (!uniqueResultsMap.has(id)) {
                    uniqueResultsMap.set(id, {
                        id: id,
                        name: docData.name,
                        url: docData.url,
                        areaRef: areaRef,
                        categoryRef: categoryRef,
                        keywordRef: keywordRef,
                        area: "",
                        category: "",
                        keyword: "",
                        geopoint: docData.geopoint,
                    });
                }
            });
        });

        // キーワードNameの取得
        // Resultsにkeyword要素を追加
        await Promise.all(Array.from(uniqueResultsMap.values()).map(async result => {
            const areaSnap = await getDoc(result.areaRef as DocumentReference);
            const areaData = areaSnap.data() as DocumentData;
            result.area = areaData.name;
            const keywordNames = [];
            const categoryNames = [];

            try {
                // カテゴリRefの各参照に対してループ
                for (const categoryRef of result.categoryRef) {
                    // カテゴリ参照からカテゴリーデータを取得
                    const categorySnap = await getDoc(categoryRef);
                    const categoryData = categorySnap.data() as { name: string };
                    // カテゴリデータからのカテゴリー名を配列に追加
                    categoryNames.push(categoryData.name);
                }
                // キーワードRefの各参照に対してループ
                for (const keywordRef of result.keywordRef) {
                    // キーワード参照からキーワードデータを取得
                    const keywordSnap = await getDoc(keywordRef);
                    const keywordData = keywordSnap.data() as { name: string };
                    // キーワードデータからのキーワード名を配列に追加
                    keywordNames.push(keywordData.name);
                }
                // キーワード名の配列を結合してキーワードフィールドに設定
                result.category = categoryNames.join(', '); // すべてのカテゴリ名をカンマで区切って文字列にする

                result.keyword = keywordNames.join(', '); // すべてのキーワード名をカンマで区切って文字列にする

            } catch (error) {
                console.error("キーワードフィールドの中身がありません", error);
                result.keyword = "";
            }
        }));
        return Array.from(uniqueResultsMap.values());

    } catch (error) {
        // エラーハンドリング
        console.error("データの取得中にエラーが発生しました", error);
        return null;
    }


}