# Chrome Built-in AI 60分ミニラボ

Google I/O Extended Tokyo 2026 の会場ハンズオン用スターターキットです。

## 🎯 このコードラボで作るもの

タブ切替式のミニアプリで、Chrome Built-in AI の 4 つの API を体験します：

- 🔤 Language Detector — 言語判定
- 🌐 Translator — 多言語翻訳
- 📝 Summarizer — 長文要約
- 💬 Prompt API（テキスト）— 感情分析＋タグ抽出
- 📷 Prompt API（画像）— 名刺 OCR

## 📋 事前準備（必須）

### 1. Chrome のインストール

以下のいずれかを最新版でインストール：

- [Chrome Canary](https://www.google.com/chrome/canary/)（推奨）
- [Chrome Dev](https://www.google.com/chrome/dev/)

**⚠️ 安定版 Chrome では動作しません。**

### 2. フラグの有効化

Chrome を起動し、以下の URL を開いてすべて **Enabled** に：

- `chrome://flags/#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
- `chrome://flags/#language-detection-api` → **Enabled**
- `chrome://flags/#translation-api` → **Enabled**
- `chrome://flags/#summarization-api-for-gemini-nano` → **Enabled**
- `chrome://flags/#prompt-api-for-gemini-nano` → **Enabled**
- `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` → **Enabled**

すべて設定後、Chrome を再起動。

### 3. モデルのダウンロード

`about://on-device-internals` を開き、**Model status** が「Ready」になっていることを確認。

まだダウンロードされていない場合、`about://components` を開いて **Optimization Guide On Device Model** の「Check for update」を実行。

### 4. スペック要件

- ストレージ空き容量: **22GB 以上**
- メモリ: **8GB 以上**推奨
- OS: Windows 10+ / macOS 13+ / Linux（一部制限あり）

## 🚀 コードラボの始め方

このディレクトリを解凍または clone し、軽量ローカルサーバで起動してください：

```bash
# 推奨: python3 の軽量サーバで（ES module の CORS 対策）
python3 -m http.server 8000
# → http://localhost:8000/starter/index.html
```

`file://` プロトコルで直接開くと、ES module の import が CORS エラーになる場合があります。

ページ上部のバッジがすべて ✅ **available** になっていれば準備完了です。

## 📁 ファイル構成

```
starter/
├── index.html      # メインの HTML（タブ UI・完成済み）
├── styles.css      # スタイル定義（完成済み）
├── main.js         # ここに TODO コメントがあります ← ここを書く
├── lib/
│   └── schema.js   # Prompt API 用の JSON Schema（完成済み）
├── assets/
│   └── sample-card.png  # 名刺 OCR のサンプル画像
├── LICENSE         # Apache-2.0
└── README.md       # このファイル
```

## 🎓 進め方

1. Chapter 0（🏁 導入）で環境チェックを済ませる
2. **好きな章から**取り組む（順不同 OK）
3. `main.js` の `// TODO N:` コメントの下にコードを書き足す
4. 詰まったら各章の「🚨 見本コード」を開く（`<details>` 折りたたみ）

各章の詳しい手順は **Codelab サイト** を参照してください。当日会場で URL / QR コードをご案内します。

## 🛟 トラブルシューティング

### 「LanguageDetector is not defined」

フラグが有効になっていないか、Chrome が再起動されていません。事前準備の 2 を再確認してください。

### バッジが「⬇ downloadable」のまま

モデル未ダウンロードです。バッジをクリック（もしくは各章で `create()` を実行）するとダウンロードが始まります。回線状況次第で 5〜30 分かかります。

### バッジが「❌ unavailable」のまま

- OS/ハードウェアが要件を満たしていない可能性
- Chrome バージョンが古い可能性 → Canary の最新版に更新
- ストレージが 22GB 以上空いているか確認

### `Failed to fetch` / モジュール読込エラー

`file://` で直接開いていると CORS エラーが出ることがあります。`python3 -m http.server 8000` で軽量サーバを起動して `http://localhost:8000/` から開いてください。

### 名刺 OCR で結果が不正確

- 画像の解像度が低い場合、テキストが読み取れないことがあります
- 同梱の `sample-card.png` は動作確認済みです、まずこれで試してください

## 📄 ライセンス

Apache License 2.0（LICENSE 参照）
