# 🔑 各 Chapter の答え

`starter/main.js` の `// TODO N:` を埋めた完成版のハンドラ関数です。
`solutions/main.js` にも同じ内容が入っています。

> **⚠️ 参加者への直接提示は最終手段** です。まずは Console のエラーメッセージを一緒に読む → ヒントで気づかせる → それでもダメなら各章の <code>🚨 見本コード</code> 折りたたみ（<code>&lt;details&gt;</code>）を開かせる → それでも詰まったらここのコードを見せる、という順番でメンタリングしてください。

---

## 🔤 Chapter 1: Language Detector

```js
async function handleLanguageDetector() {
  const text = document.querySelector('#ld-input').value.trim();
  if (!text) {
    setStatus('chapter-1', 'テキストを入力してください', 'error');
    return;
  }

  setStatus('chapter-1', '判定中...', 'info');

  try {
    // TODO 1: create session
    const detector = await LanguageDetector.create();

    // TODO 2: detect
    const results = await detector.detect(text);

    // TODO 3: render top 3
    renderOutput('chapter-1', results.slice(0, 3));

    setStatus('chapter-1', '判定完了', 'success');
  } catch (e) {
    console.error(e);
    setStatus('chapter-1', `エラー: ${e.message}`, 'error');
  }
}
```

**ポイント**:
- `detect()` の戻り値は配列。忘れずに `slice(0, 3)` でトップ 3 に絞る

---

## 🌐 Chapter 2: Translator

```js
async function handleTranslate() {
  const text = document.querySelector('#tr-input').value.trim();
  const sourceLanguage = document.querySelector('#tr-source').value;
  const targetLanguage = document.querySelector('#tr-target').value;
  if (!text) {
    setStatus('chapter-2', 'テキストを入力してください', 'error');
    return;
  }
  if (sourceLanguage === targetLanguage) {
    setStatus('chapter-2', 'source と target が同じです', 'error');
    return;
  }

  setStatus('chapter-2', '翻訳準備中...', 'info');
  hideProgress('chapter-2');

  try {
    const monitor = (m) => {
      m.addEventListener('downloadprogress', (e) => {
        showProgress('chapter-2', e.loaded * 100);
      });
    };
    const translator = await Translator.create({ sourceLanguage, targetLanguage, monitor });
    const translated = await translator.translate(text);
    renderOutput('chapter-2', translated);

    hideProgress('chapter-2');
    setStatus('chapter-2', '翻訳完了', 'success');
  } catch (e) {
    console.error(e);
    hideProgress('chapter-2');
    setStatus('chapter-2', `エラー: ${e.message}`, 'error');
  }
}
```

**ポイント**:
- `monitor` は関数（`(m) => { ... }`）で渡す（オブジェクトで渡してしまいがち）
- `m.addEventListener('downloadprogress', ...)` の `e.loaded` は 0〜1 の進捗率

---

## 📝 Chapter 3: Summarizer

```js
async function handleSummarize() {
  const text = document.querySelector('#sm-input').value.trim();
  const type = document.querySelector('#sm-type').value;
  const length = document.querySelector('#sm-length').value;
  const useStreaming = document.querySelector('#sm-stream').checked;

  if (!text) {
    setStatus('chapter-3', 'テキストを入力してください', 'error');
    return;
  }

  setStatus('chapter-3', '要約中...', 'info');
  renderOutput('chapter-3', '');

  try {
    const summarizer = await Summarizer.create({ type, length });

    if (useStreaming) {
      const stream = summarizer.summarizeStreaming(text);
      let acc = '';
      for await (const chunk of stream) {
        acc += chunk;
        renderOutput('chapter-3', acc);
      }
    } else {
      const result = await summarizer.summarize(text);
      renderOutput('chapter-3', result);
    }

    setStatus('chapter-3', '要約完了', 'success');
  } catch (e) {
    console.error(e);
    setStatus('chapter-3', `エラー: ${e.message}`, 'error');
  }
}
```

**ポイント**:
- `summarizeStreaming()` は `await` 不要。`for await (const chunk of stream)` で回す
- `acc += chunk` で累積し、毎チャンクで `renderOutput` を呼ぶとタイプライター風に

---

## 💬 Chapter 4: Prompt API テキスト（感情分析）

```js
async function handlePromptText() {
  const systemPrompt = document.querySelector('#pt-system').value.trim();
  const reviewText = document.querySelector('#pt-input').value.trim();
  const temperature = parseFloat(document.querySelector('#pt-temperature').value);

  if (!reviewText) {
    setStatus('chapter-4', 'レビュー文を入力してください', 'error');
    return;
  }

  setStatus('chapter-4', '分析中...', 'info');
  renderOutput('chapter-4', '');

  try {
    const session = await LanguageModel.create({
      initialPrompts: [{ role: 'system', content: systemPrompt }],
      temperature,
      topK: 3,
    });

    const output = await session.prompt(reviewText, {
      responseConstraint: SENTIMENT_SCHEMA,
    });

    renderOutput('chapter-4', JSON.parse(output));
    setStatus('chapter-4', '分析完了', 'success');
  } catch (e) {
    console.error(e);
    setStatus('chapter-4', `エラー: ${e.message}`, 'error');
  }
}
```

**ポイント**:
- `initialPrompts` は `[{ role: 'system', content: ... }]` の配列形式
- `responseConstraint` は `prompt()` の**第 2 引数**として渡す（`create()` 側と間違えやすい）
- 戻り値は文字列なので `JSON.parse()` 必須

---

## 📷 Chapter 5: Prompt API 画像（名刺 OCR）

```js
async function handlePromptImage() {
  if (!currentImageBlob) {
    setStatus('chapter-5', '画像を選択してください', 'error');
    return;
  }

  setStatus('chapter-5', '抽出中...', 'info');
  renderOutput('chapter-5', '');

  try {
    const session = await LanguageModel.create({
      expectedInputs: [{ type: 'image' }],
    });

    const output = await session.prompt([{
      role: 'user',
      content: [
        { type: 'image', value: currentImageBlob },
        { type: 'text', value: 'この名刺から連絡先情報を JSON で抽出してください。' },
      ],
    }], { responseConstraint: BUSINESS_CARD_SCHEMA });

    renderOutput('chapter-5', JSON.parse(output));
    setStatus('chapter-5', '抽出完了', 'success');
  } catch (e) {
    console.error(e);
    setStatus('chapter-5', `エラー: ${e.message}`, 'error');
  }
}
```

**ポイント**:
- `create()` に `expectedInputs: [{ type: 'image' }]` を必ず渡す（忘れがち）
- `prompt()` の入力は**メッセージ配列**（`[{ role, content: [...] }]`）で、content は image + text の配列
- image の `value` は `Blob` を渡す（サンプル画像は `sample-card-data.js` の base64 から `base64ToBlob()` で生成済み）
- 戻り値は文字列 → `JSON.parse()` して連絡先データに
