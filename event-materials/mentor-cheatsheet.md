# メンター向けチートシート — Chrome Built-in AI ミニラボ

**用途**: 会場スタッフが参加者の質問に即答するための参照資料。
**注意**: 参加者には配布しないでください。

---

## 🚦 参加者が最初に詰まりやすいポイント

### 1. `LanguageDetector is not defined` などのエラー
→ **Chrome バージョンが古い可能性が最も高い**。今回の 4 API は Chrome 148 Stable から標準搭載。
- `chrome://settings/help` を開いて 148 以降になっているか確認させる
- 古ければその場で更新（数分で完了、再起動が必要）

### 2. バッジが `⬇ downloadable` のまま
→ モデル未 DL。以下のいずれかを指示：
- そのバッジに対応する章で `create()` を実行するとダウンロードが始まる
- Chapter 0 の「環境チェックを再実行」ボタンを押しても DL は始まらない（availability だけを確認するため）
- 会場 Wi-Fi 経由の DL は 10〜30 分かかることがある

### 3. `prompt()` の戻り値が JSON じゃない
→ `responseConstraint` を渡し忘れている。Ch4/5 の STEP 2 を再確認。
また、`JSON.parse()` を忘れて生文字列を表示していないかも確認。

### 4. 名刺 OCR で結果が不正確
→ まず**同梱のサンプル画像**で動くかを確認する。
参加者の画像が斜め・低解像度・光量不足なら精度が落ちる。「サンプル画像で動くならコードは正しい」と伝える。

---

## 📌 章別・詰まりやすいコード箇所

### 🔤 Chapter 1 (Language Detector)

| 症状 | 原因 | 対処 |
|-----|-----|-----|
| 「Promise が表示された」 | `detector.detect(text)` に `await` 忘れ | `await` を付ける |
| 出力が単一言語だけ | `results[0]` を渡している | `results.slice(0, 3)` に修正 |
| 「絞り込みチェックが効かない」 | `expectedInputLanguages` が create の外に書かれている | create のオプションとして渡す |

### 🌐 Chapter 2 (Translator)

| 症状 | 原因 | 対処 |
|-----|-----|-----|
| 進捗バーが動かない | `monitor` を関数ではなくオブジェクトで渡している | `(m) => { m.addEventListener(...) }` の形に |
| source === target のエラー | 同じ言語を選択 | 選択肢を変える（コードのガードは既に入っている） |
| 「何も返ってこない」 | `translator.translate(text)` に `await` 忘れ | `await` 追加 |

### 📝 Chapter 3 (Summarizer)

| 症状 | 原因 | 対処 |
|-----|-----|-----|
| Streaming が一気に出る | `summarizeStreaming` を `await` してしまっている | `await` 不要、直接 `for await` で回す |
| 「要約が空文字」 | 入力テキストが短すぎる | 200 文字以上の長文を貼らせる |
| type 切替が反映されない | UI の値を毎回 create し直していない | ボタン押下時に create するのが正解（starter コードでそうなっている） |

### 💬 Chapter 4 (Prompt API テキスト)

| 症状 | 原因 | 対処 |
|-----|-----|-----|
| `SENTIMENT_SCHEMA is not defined` | import 忘れ | `main.js` 冒頭の `import` 文を確認 |
| 生の文字列が出力される | `JSON.parse(output)` を忘れている | 追加する |
| Session エラー | `initialPrompts` の形式間違い | `[{ role: 'system', content: '...' }]` の形式か確認 |

### 📷 Chapter 5 (Prompt API 画像)

| 症状 | 原因 | 対処 |
|-----|-----|-----|
| 画像入力エラー | `expectedInputs: [{ type: 'image' }]` を渡し忘れ | create オプションに追加 |
| `currentImageBlob is null` | ファイル選択の change イベントが発火していない | ページを再読込み、ファイルを選び直す |
| 「content 配列の形が違う」エラー | image と text の混在方法が違う | `{ type: 'image', value: blob }` と `{ type: 'text', value: '...' }` を content 配列に並べる |

---

## 🔧 会場での即応コマンド・スニペット

### 参加者の環境確認（DevTools Console で実行）
```js
console.log({
  ld: typeof LanguageDetector,
  tr: typeof Translator,
  sm: typeof Summarizer,
  lm: typeof LanguageModel,
});
// 全て 'function' なら OK。'undefined' があればフラグ未設定
```

### API 単発動作確認
```js
// Language Detector
const d = await LanguageDetector.create();
console.log(await d.detect('Hello'));

// Translator (en→ja)
const t = await Translator.create({ sourceLanguage: 'en', targetLanguage: 'ja' });
console.log(await t.translate('Hello, world'));

// Summarizer
const s = await Summarizer.create();
console.log(await s.summarize('long text here...'));

// Prompt API (text)
const lm = await LanguageModel.create();
console.log(await lm.prompt('Say hi'));
```

### サンプル画像の場所
`starter/assets/sample-card.png`

### solutions への一時切替（動作確認用）
`starter/index.html` の `<script src="main.js">` の行を一時的に `<script src="../solutions/main.js">` に書き換える（他の 2 つの script タグ（schema.js / sample-card-data.js）は starter/solutions で内容同一なので触らなくて OK）。
確認後は必ず元に戻すこと。

---

## 🆘 どうしても解決しない場合

1. サンプル画像で動作確認だけ済ませて**他章に誘導**
2. 「持ち帰り課題」として README を渡し、後日環境を整えてもらう
3. 隣席の参加者とペアで見学する形に切り替え

## 📞 エスカレーション

- 会場運営 Slack / Discord: 当日運営から案内
- 講師連絡先: 当日運営から案内

---

## 💡 メンターとしての心構え

- **答えを教える前にヒント**: 参加者が自分で気づけるように、まずは Console のエラーメッセージを一緒に読む
- **見本コードを見せるのは最終手段**: 各章の `<details>` 折りたたみに解答があるが、まずは 3〜5 分は自分で考えてもらう
- **順不同 OK を伝える**: 詰まった章は飛ばして次に進んで良い、時間内に全章行けなくても大丈夫、と伝える
- **成功体験を褒める**: 動いた瞬間の「動いた〜！」を全力で祝福 🎉
