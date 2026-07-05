// =============================================================
// Chrome Built-in AI ミニラボ — solutions/main.js
// 全ての TODO を埋めた完成版。メンター/講師向け。
// 参加者には配布しないでください。
//
// このファイルは classic script として読み込まれます。schema や
// サンプル画像の base64 は window にぶら下がっている前提です。
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
// Chapter 1: 🔤 Language Detector (SOLVED)
// =============================================================
async function handleLanguageDetector() {
  const text = document.querySelector('#ld-input').value.trim();
  if (!text) {
    setStatus('chapter-1', 'テキストを入力してください', 'error');
    return;
  }

  const useRestriction = document.querySelector('#ld-restrict').checked;
  setStatus('chapter-1', '判定中...', 'info');

  try {
    // TODO 1: create session
    const detector = await LanguageDetector.create(
      useRestriction ? { expectedInputLanguages: ['en', 'ja', 'fr'] } : undefined
    );

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

// =============================================================
// Chapter 2: 🌐 Translator (SOLVED)
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

// =============================================================
// Chapter 3: 📝 Summarizer (SOLVED)
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

// =============================================================
// Chapter 4: 💬 Prompt API テキスト (SOLVED)
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

// =============================================================
// Chapter 5: 📷 Prompt API 画像 (SOLVED)
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

// ---------- Bootstrap ----------
document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  console.log('Chrome Built-in AI ミニラボ (solutions) 起動しました 🚀');

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
