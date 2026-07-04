# 【重要】Chrome Built-in AI ミニラボ 事前準備のお願い

Google I/O Extended Tokyo 2026 の会場ハンズオン「**Chrome Built-in AI 60分ミニラボ**」にご参加希望の皆様へ。

**⚠️ 当日会場でセットアップから始めると時間内に完走できません。**
以下の事前準備を **参加日前日まで** にお済ませください。

所要時間の目安：初回は 30〜60 分（モデルダウンロード含む）。

---

## ✅ 準備チェックリスト

### 1. Chrome Canary または Chrome Dev をインストール

以下のいずれかを **最新版** で：

- [Chrome Canary（推奨）](https://www.google.com/chrome/canary/)
- [Chrome Dev](https://www.google.com/chrome/dev/)

**❌ 安定版 Chrome では動作しません。**

### 2. 以下のフラグをすべて「Enabled」に

Chrome を起動し、URL バーに以下を貼り付けて設定してください：

| フラグ URL | 設定値 |
|-----------|--------|
| `chrome://flags/#optimization-guide-on-device-model` | **Enabled BypassPerfRequirement** |
| `chrome://flags/#language-detection-api` | **Enabled** |
| `chrome://flags/#translation-api` | **Enabled** |
| `chrome://flags/#summarization-api-for-gemini-nano` | **Enabled** |
| `chrome://flags/#prompt-api-for-gemini-nano` | **Enabled** |
| `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` | **Enabled** |

設定後、**Chrome を再起動**してください。フラグは再起動後に反映されます。

### 3. Gemini Nano モデルをダウンロード

`about://on-device-internals` を開き、**Model status** が「Ready」になっているか確認。

Ready になっていない場合：

1. `about://components` を開く
2. 「**Optimization Guide On Device Model**」を探す
3. 「**Check for update**」をクリック
4. ダウンロード完了まで待つ（回線状況次第で 5〜30 分）

### 4. スペック確認

- **ストレージ空き容量**: 22 GB 以上（モデルサイズが大きいため）
- **メモリ**: 8 GB 以上推奨
- **OS**: Windows 10+ / macOS 13+ / Linux（一部制限あり）

### 5. 動作確認スニペット

Chrome の DevTools（右クリック → 検証 → Console タブ）で以下を実行し、
すべて `available` が返ることを確認してください：

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

**期待される出力例：**

```
{ ld: 'available', tr: 'available', sm: 'available', lm: 'available', lmImg: 'available' }
```

- `downloadable` が返る場合は、そのまま各 API を `create()` すると DL が始まります。当日までに全て `available` にしておいてください。
- `unavailable` が返る場合は、フラグ設定やスペック要件を再確認してください。

---

## 🎒 当日の持ち物

- ノート PC（フル充電 + 電源アダプタ）
- 動作確認済みの Chrome Canary / Dev
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

- [ ] Chrome Canary の最新版がインストールされている
- [ ] 全 6 個のフラグが Enabled になっている
- [ ] `about://on-device-internals` で Model status が Ready
- [ ] 動作確認スニペットで全て `available` が返る
- [ ] ノート PC がフル充電されている
- [ ] 電源アダプタを持参する

---

皆様のご参加を心よりお待ちしております！🎉
一緒に Chrome Built-in AI の世界を体験しましょう〜✨
