# 【重要】Chrome Built-in AI ミニラボ 事前準備のお願い

Google I/O Extended Tokyo 2026 の会場ハンズオン「**Chrome Built-in AI 60分ミニラボ**」にご参加希望の皆様へ。

今回のミニラボで扱う 4 つの API は **Chrome 148 Stable から標準搭載** されているため、フラグ設定などは不要になりました。ただし、Gemini Nano モデルのダウンロードには時間がかかるため、**事前準備を必ず参加日前日まで**にお済ませください。

所要時間の目安：モデルダウンロードに 10〜30 分（回線状況次第）。

---

## ✅ 準備チェックリスト

### 1. Chrome を最新版にアップデート

- **Chrome 148 以降の Stable 版** をご用意ください
- 既に Chrome をインストールされている方は、`chrome://settings/help` を開いて最新版に更新
- まだの方は [Chrome のダウンロードページ](https://www.google.com/chrome/) からインストール

**⚠️ Chrome 147 以前では動作しません。** バージョンが古い場合は必ず更新してください。

### 2. スペック確認

- **ストレージ空き容量**: 22 GB 以上（Gemini Nano モデルサイズが大きいため）
- **メモリ**: 8 GB 以上推奨
- **OS**: Windows 10+ / macOS 13+ / Linux（一部制限あり）

### 3. Gemini Nano モデルの事前ダウンロード

Chrome の DevTools（右クリック → 検証 → Console タブ）で以下を実行し、
すべて `'available'` が返ることを確認してください：

```javascript
(async () => {
  console.log({
    ld: await LanguageDetector.availability(),
    tr: await Translator.availability({ sourceLanguage: 'en', targetLanguage: 'ja' }),
    sm: await Summarizer.availability(),
    lm: await LanguageModel.availability(),
    lmImg: await LanguageModel.availability({ expectedInputs: [{ type: 'image' }] }),
  });
})();
```

**期待される最終出力：**

```
{ ld: 'available', tr: 'available', sm: 'available', lm: 'available', lmImg: 'available' }
```

`'downloadable'` が返っている API については、以下スニペットを Console で実行するとダウンロードが始まります：

```javascript
(async () => {
  await LanguageDetector.create();
  await Translator.create({ sourceLanguage: 'en', targetLanguage: 'ja' });
  await Summarizer.create();
  await LanguageModel.create();
  await LanguageModel.create({ expectedInputs: [{ type: 'image' }] });
  console.log('✅ 全モデルのダウンロード完了');
})();
```

ダウンロードには合計で 10〜30 分程度かかります。ダウンロード完了後、再度 availability チェックを実行して、すべて `'available'` になっていれば準備完了です ✅

---

## 🎒 当日の持ち物

- ノート PC（フル充電 + 電源アダプタ）
- **Chrome 148 以降**（事前準備済み）
- ご自身の名刺（オプション：Chapter 5 で自分の名刺で試したい方）
- 好奇心 ✨

---

## 🔗 当日の URL

以下は当日会場で QR コード / URL を案内します：

- スターターコード配布 URL
- Codelab（解説サイト）URL
- 質問窓口 Slack / Discord

---

## 🚨 うまく準備できない場合

会場に **予備 PC を数台** ご用意していますが、数に限りがあります。可能な限り事前準備をお願いします。

質問は運営 Slack / Discord までお気軽に：**[チャンネル URL は当日案内]**

---

## 📋 前日チェック（開催前日夜）

- [ ] Chrome が **148 以降** になっている（`chrome://settings/help` で確認）
- [ ] 動作確認スニペットで全て `available` が返る
- [ ] ノート PC がフル充電されている
- [ ] 電源アダプタを持参する

---

皆様のご参加を心よりお待ちしております！🎉
一緒に Chrome Built-in AI の世界を体験しましょう〜✨
