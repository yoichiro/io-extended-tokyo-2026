# Chrome Built-in AI 60分ミニラボ

Google I/O Extended Tokyo 2026 の会場ハンズオン用リポジトリです。

Chrome Built-in AI（Gemini Nano をオンデバイスで使う仕組み）の 4 つの主要 API を 60 分で体験するコードラボと、その解説サイト、会場運営資料を含んでいます。

## 🔗 公開 URL

| URL | 内容 |
|-----|------|
| [https://io-extended-tokyo-2026.web.app/](https://io-extended-tokyo-2026.web.app/) | 📚 Codelab（参加者向け解説サイト） |
| [https://io-extended-tokyo-2026.web.app/staff/](https://io-extended-tokyo-2026.web.app/staff/) | 🎪 会場運営資料（スタッフ・メンター向け） |

## 📁 ディレクトリ構成

```
io-extended-tokyo-2026/
├── starter/            # 参加者用スターターコード（clone / ZIP で取得）
├── solutions/          # メンター/講師用の完全解答（当日は開かないでね 🙏）
├── docs-site/          # Codelab 解説サイト（Firebase Hosting で公開）
├── event-materials/    # 会場運営資料（Firebase Hosting の /staff/ で公開）
├── docs/               # 設計書・実装プランなどの制作記録
├── firebase.json       # Firebase Hosting 設定
├── .firebaserc         # Firebase プロジェクト参照
├── LICENSE             # Apache-2.0
└── README.md           # このファイル
```

## 🎓 参加者の方へ

1. Codelab サイトを開いてください（上記の公開 URL）
2. このリポジトリをクローンまたは ZIP でダウンロード
3. `starter/` ディレクトリに移動し、README の手順に従って環境をセットアップ
4. Codelab の指示に沿って 5 章のミニデモを進めてください

```bash
git clone https://github.com/yoichiro/io-extended-tokyo-2026.git
# → starter/index.html を Chrome 148 以降でダブルクリック（ローカルサーバ不要）
```

参加前の環境準備は [starter/README.md](./starter/README.md) をご確認ください。

## 🎪 会場スタッフ・メンターの方へ

- [event-materials/](./event-materials/) にメンターチートシート、会場チェックリスト等があります
- ブラウザで閲覧しやすい HTML 版は `/staff/` パスから
- `solutions/` は当日の詰まり対応でご参照ください

## 🎯 対象 API

- 🔤 Language Detector — 言語判定
- 🌐 Translator — 多言語翻訳
- 📝 Summarizer — 長文要約
- 💬 Prompt API（テキスト）— 汎用 LLM + 構造化出力
- 📷 Prompt API（画像）— マルチモーダル入力（名刺 OCR）

## 🚀 デプロイ手順（運営者向け）

### 前提

- [Firebase CLI](https://firebase.google.com/docs/cli) をインストール済み
- Firebase プロジェクトを作成済み

### 手順

```bash
# Firebase にログイン
npx -y firebase-tools@latest login

# .firebaserc の "default" を自分のプロジェクト ID に書き換え
# または以下で明示指定
npx -y firebase-tools@latest use YOUR_PROJECT_ID

# 内容確認（ローカルサーバで表示）
npx -y firebase-tools@latest emulators:start --only hosting

# 本番デプロイ
npx -y firebase-tools@latest deploy --only hosting
```

デプロイ対象は `docs-site/` と `event-materials/` のみです。`starter/`, `solutions/`, `docs/` は `firebase.json` の ignore で除外されます。

## 📄 ライセンス

Apache License 2.0（[LICENSE](./LICENSE) 参照）

DOMPurify（`event-materials/vendor/purify.min.js`）と marked（`event-materials/vendor/marked.min.js`）はそれぞれのライセンスに従います。

## 🙏 謝辞

- Google Chrome チーム — Built-in AI API を開発
- Google I/O Extended Tokyo コミュニティ — イベント開催
- 会場スタッフ・メンター・参加者の皆さん
