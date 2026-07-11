// =============================================================
// Built-in AI ミニラボ — main.js
// 参加者は各章の TODO コメント下にコードを書き足していきます。
// 共通ヘルパ（この上部）は編集不要です。
//
// このファイルは classic script として読み込まれます (index.html で
// <script src="main.js"> のように type="module" なしで参照)。
// これにより、Chrome で index.html をダブルクリックして開いた
// file:// origin でも動作します。SENTIMENT_SCHEMA / BUSINESS_CARD_SCHEMA
// は lib/schema.js から、SAMPLE_CARD_BASE64 は assets/sample-card-data.js
// から、それぞれ window にぶら下がっている前提です。
// =============================================================

// ---------- Common helpers ----------
function setStatus(tabId, msg, kind = 'info') {
  const el = document.getElementById(tabId)?.querySelector('.status');
  if (!el) return;
  el.textContent = msg;
  el.className = `status kind-${kind}`;
  el.hidden = !msg;
}

function showProgress(tabId, pct) {
  const bar = document.getElementById(tabId)?.querySelector('.progress-bar');
  const container = document.getElementById(tabId)?.querySelector('.progress');
  if (!bar || !container) return;
  container.hidden = false;
  bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}

function hideProgress(tabId) {
  const bar = document.getElementById(tabId)?.querySelector('.progress-bar');
  const container = document.getElementById(tabId)?.querySelector('.progress');
  if (!bar || !container) return;
  bar.style.width = '0%';
  container.hidden = true;
}

function renderOutput(tabId, textOrObj) {
  const el = document.getElementById(tabId)?.querySelector('.output');
  if (!el) return;
  if (typeof textOrObj === 'string') {
    el.textContent = textOrObj;
  } else {
    el.textContent = JSON.stringify(textOrObj, null, 2);
  }
}

// base64 文字列を Blob に変換 (fetch なしで動作するので file:// でも OK)
function base64ToBlob(base64, mime) {
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
  return new Blob([buffer], { type: mime });
}

// ---------- Environment check ----------
const API_NAMES = {
  languageDetector: '🔤 Language Detector',
  translator: '🌐 Translator (en→ja)',
  summarizer: '📝 Summarizer',
  languageModelText: '💬 Prompt API (text)',
  languageModelImage: '📷 Prompt API (image)',
};

async function checkAvailability() {
  const safe = async (fn) => {
    try { return await fn(); } catch (e) { return 'unavailable'; }
  };

  const [ld, tr, sm, lmText, lmImage] = await Promise.all([
    safe(() => typeof LanguageDetector !== 'undefined'
      ? LanguageDetector.availability()
      : 'unavailable'),
    safe(() => typeof Translator !== 'undefined'
      ? Translator.availability({ sourceLanguage: 'en', targetLanguage: 'ja' })
      : 'unavailable'),
    safe(() => typeof Summarizer !== 'undefined'
      ? Summarizer.availability()
      : 'unavailable'),
    safe(() => typeof LanguageModel !== 'undefined'
      ? LanguageModel.availability()
      : 'unavailable'),
    safe(() => typeof LanguageModel !== 'undefined'
      ? LanguageModel.availability({ expectedInputs: [{ type: 'image' }] })
      : 'unavailable'),
  ]);

  return {
    languageDetector: ld,
    translator: tr,
    summarizer: sm,
    languageModelText: lmText,
    languageModelImage: lmImage,
  };
}

function renderAvailabilityBadges(results) {
  const badges = document.querySelector('#env-badges');
  if (!badges) return;
  badges.replaceChildren();
  for (const [key, label] of Object.entries(API_NAMES)) {
    const state = results[key] ?? 'unavailable';
    const badge = document.createElement('span');
    badge.className = `env-badge state-${state}`;
    const emoji = state === 'available' ? '✅'
      : state === 'downloadable' ? '⬇'
      : state === 'downloading' ? '⏳'
      : '❌';
    badge.textContent = `${emoji} ${label}`;
    badge.title = state;
    badges.appendChild(badge);
  }
}

// ---------- Tab switching ----------
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      tabs.forEach((t) => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
      document.querySelectorAll('.chapter').forEach((section) => {
        section.hidden = section.id !== targetId;
      });
    });
  });
}

// =============================================================
// Chapter 1: 🔤 Language Detector
// =============================================================
async function handleLanguageDetector() {
  const text = document.querySelector('#ld-input').value.trim();
  if (!text) {
    setStatus('chapter-1', 'テキストを入力してください', 'error');
    return;
  }

  setStatus('chapter-1', '判定中...', 'info');

  try {
    // -----------------------------------------------------------
    // TODO 1: LanguageDetector.create() でセッションを作る
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 2: detector.detect(text) で言語を判定する
    //   戻り値は [{ detectedLanguage, confidence }, ...] の配列
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 3: renderOutput('chapter-1', 上位3件) で結果を表示する
    // -----------------------------------------------------------


    setStatus('chapter-1', '判定完了', 'success');
  } catch (e) {
    console.error(e);
    setStatus('chapter-1', `エラー: ${e.message}`, 'error');
  }
}

// =============================================================
// Chapter 2: 🌐 Translator
// =============================================================
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
    // -----------------------------------------------------------
    // TODO 1: monitor 関数を定義して downloadprogress を購読
    //   const monitor = (m) => {
    //     m.addEventListener('downloadprogress', (e) => {
    //       showProgress('chapter-2', e.loaded * 100);
    //     });
    //   };
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 2: Translator.create({ sourceLanguage, targetLanguage, monitor })
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 3: translator.translate(text) で翻訳し、renderOutput で表示
    // -----------------------------------------------------------


    hideProgress('chapter-2');
    setStatus('chapter-2', '翻訳完了', 'success');
  } catch (e) {
    console.error(e);
    hideProgress('chapter-2');
    setStatus('chapter-2', `エラー: ${e.message}`, 'error');
  }
}

// =============================================================
// Chapter 3: 📝 Summarizer
// =============================================================
async function handleSummarize() {
  const text = document.querySelector('#sm-input').value.trim();
  const type = document.querySelector('#sm-type').value;
  const length = document.querySelector('#sm-length').value;
  const useStreaming = document.querySelector('#sm-stream').checked;

  if (!text) {
    setStatus('chapter-3', 'テキストを入力してください', 'error');
    return;
  }
  if (text.length < 200) {
    setStatus('chapter-3', 'テキストが短すぎます（200文字以上推奨）', 'info');
  }

  setStatus('chapter-3', '要約中...', 'info');
  renderOutput('chapter-3', '');

  try {
    // -----------------------------------------------------------
    // TODO 1: Summarizer.create({ type, length }) でセッション作成
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 2: useStreaming が true のときは summarizeStreaming() を、
    //         false のときは summarize() を使う
    //   Streaming の場合:
    //     for await (const chunk of stream) { acc += chunk; renderOutput(...); }
    //   非 Streaming の場合:
    //     const result = await summarizer.summarize(text);
    //     renderOutput('chapter-3', result);
    // -----------------------------------------------------------


    setStatus('chapter-3', '要約完了', 'success');
  } catch (e) {
    console.error(e);
    setStatus('chapter-3', `エラー: ${e.message}`, 'error');
  }
}

// =============================================================
// Chapter 4: 💬 Prompt API テキスト
// =============================================================
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
    // -----------------------------------------------------------
    // TODO 1: LanguageModel.create() でセッション作成
    //   initialPrompts に system prompt を、temperature と topK を指定
    //   const session = await LanguageModel.create({
    //     initialPrompts: [{ role: 'system', content: systemPrompt }],
    //     temperature,
    //     topK: 3,
    //   });
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 2: session.prompt(reviewText, { responseConstraint: SENTIMENT_SCHEMA })
    //   で JSON 強制の実行を行う
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 3: 結果を JSON.parse して renderOutput で表示
    // -----------------------------------------------------------


    setStatus('chapter-4', '分析完了', 'success');
  } catch (e) {
    console.error(e);
    setStatus('chapter-4', `エラー: ${e.message}`, 'error');
  }
}

// =============================================================
// Chapter 5: 📷 Prompt API 画像
// =============================================================
let currentImageBlob = null;

function previewImage(blob) {
  currentImageBlob = blob;
  const preview = document.querySelector('#pi-preview');
  if (!preview) return;
  const url = URL.createObjectURL(blob);
  preview.replaceChildren();
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'preview';
  img.style.maxWidth = '100%';
  img.style.maxHeight = '300px';
  preview.appendChild(img);
}

async function handlePromptImage() {
  if (!currentImageBlob) {
    setStatus('chapter-5', '画像を選択してください', 'error');
    return;
  }

  setStatus('chapter-5', '抽出中...', 'info');
  renderOutput('chapter-5', '');

  try {
    // -----------------------------------------------------------
    // TODO 1: LanguageModel.create({ expectedInputs: [{ type: 'image' }] })
    //   でマルチモーダルセッションを作成
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 2: session.prompt([{ role: 'user', content: [
    //   { type: 'image', value: currentImageBlob },
    //   { type: 'text', value: '...' },
    // ]}], { responseConstraint: BUSINESS_CARD_SCHEMA }) で実行
    // -----------------------------------------------------------


    // -----------------------------------------------------------
    // TODO 3: 結果を JSON.parse して renderOutput で表示
    // -----------------------------------------------------------


    setStatus('chapter-5', '抽出完了', 'success');
  } catch (e) {
    console.error(e);
    setStatus('chapter-5', `エラー: ${e.message}`, 'error');
  }
}

// ---------- Bootstrap ----------
document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  console.log('Built-in AI ミニラボ 起動しました 🚀');

  const results = await checkAvailability();
  renderAvailabilityBadges(results);
  console.log('availability:', results);

  document.querySelector('#btn-recheck')?.addEventListener('click', async () => {
    setStatus('chapter-0', 'チェック中...', 'info');
    const r = await checkAvailability();
    renderAvailabilityBadges(r);
    setStatus('chapter-0', '再チェック完了', 'success');
  });

  // Chapter handlers
  document.querySelector('#ld-run')?.addEventListener('click', handleLanguageDetector);
  document.querySelector('#tr-run')?.addEventListener('click', handleTranslate);
  document.querySelector('#sm-run')?.addEventListener('click', handleSummarize);
  document.querySelector('#pt-run')?.addEventListener('click', handlePromptText);
  document.querySelector('#pt-temperature')?.addEventListener('input', (e) => {
    const label = document.querySelector('#pt-temperature-value');
    if (label) label.textContent = e.target.value;
  });
  document.querySelector('#pi-file')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) previewImage(file);
  });
  document.querySelector('#pi-use-sample')?.addEventListener('click', () => {
    try {
      const blob = base64ToBlob(window.SAMPLE_CARD_BASE64, window.SAMPLE_CARD_MIME || 'image/png');
      previewImage(blob);
    } catch (err) {
      setStatus('chapter-5', `サンプル画像読み込みエラー: ${err.message}`, 'error');
    }
  });
  document.querySelector('#pi-run')?.addEventListener('click', handlePromptImage);
});
