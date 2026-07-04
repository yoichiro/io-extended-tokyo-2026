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

### 1. Chrome を最新版にアップデート

**Chrome 148 以降の Stable 版**をご用意ください。今回のミニラボで扱う 4 つの API はすべて Chrome 148 Stable から標準搭載されており、フラグ設定は不要です。

[Chrome を最新版に更新する方法](https://support.google.com/chrome/answer/95414)

### 2. Gemini Nano モデルのダウンロード（初回のみ）

各 API を初めて呼び出すと、その API 用のモデルがバックグラウンドでダウンロードされます。会場でスムーズに始めるため、**事前にダウンロードを完了させておく**ことをおすすめします。

Chrome の DevTools（右クリック → 検証 → Console タブ）で以下を実行：

```javascript
(async () => {
  console.log('Language Detector:', await LanguageDetector.availability());
  console.log('Translator (en→ja):', await Translator.availability({ sourceLanguage: 'en', targetLanguage: 'ja' }));
  console.log('Summarizer:', await Summarizer.availability());
  console.log('LanguageModel (text):', await LanguageModel.availability());
  console.log('LanguageModel (image):', await LanguageModel.availability({ expectedInputs: [{ type: 'image' }] }));
})();
```

`'downloadable'` と表示された API については、そのまま `create()` を呼び出すとダウンロードが始まります：

```javascript
// 例: すべての API のモデルをまとめてダウンロード
await LanguageDetector.create();
await Translator.create({ sourceLanguage: 'en', targetLanguage: 'ja' });
await Summarizer.create();
await LanguageModel.create();
await LanguageModel.create({ expectedInputs: [{ type: 'image' }] });
```

再度 `availability()` を実行して、すべて `'available'` になっていれば準備完了です ✅

### 3. スペック要件

- **ストレージ空き容量**: 22 GB 以上（モデルサイズが大きいため）
- **メモリ**: 8 GB 以上推奨
- **OS**: Windows 10+ / macOS 13+ / Linux（一部制限あり）

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

Chrome のバージョンが古い可能性があります。`chrome://settings/help` で **Chrome 148 以降** になっていることを確認し、必要であれば更新してください。

### バッジが「⬇ downloadable」のまま

モデル未ダウンロードです。バッジをクリック（もしくは各章で `create()` を実行）するとダウンロードが始まります。回線状況次第で 5〜30 分かかります。

### バッジが「❌ unavailable」のまま

- Chrome バージョンが古い可能性 → 最新版に更新
- OS/ハードウェアが要件を満たしていない可能性
- ストレージが 22 GB 以上空いているか確認

### `Failed to fetch` / モジュール読込エラー

`file://` で直接開いていると CORS エラーが出ることがあります。`python3 -m http.server 8000` で軽量サーバを起動して `http://localhost:8000/` から開いてください。

### 名刺 OCR で結果が不正確

- 画像の解像度が低い場合、テキストが読み取れないことがあります
- 同梱の `sample-card.png` は動作確認済みです、まずこれで試してください

## 📄 ライセンス

Apache License 2.0（LICENSE 参照）
