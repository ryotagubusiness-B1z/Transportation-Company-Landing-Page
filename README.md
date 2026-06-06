# R-Route Logistics 採用LP

運送会社向けの採用ランディングページです。`index.html`、`styles.css`、`app.js` に分けてあり、GitHub Pagesでそのまま動きます。

## 機能

- 仕事内容、1日の流れ、福利厚生をJavaScriptで描画
- 応募フォームの入力を `localStorage` に保存
- 応募一覧の表示
- 応募データのCSV出力
- 応募データの全削除

## 実運用にする場合

`app.js` の `handleSubmit` をAPI送信に置き換えると、採用管理システムやメール通知へ接続できます。
