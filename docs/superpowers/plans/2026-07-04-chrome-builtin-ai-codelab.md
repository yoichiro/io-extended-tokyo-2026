# Chrome Built-in AI 60分ミニラボ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Google I/O Extended Tokyo 2026 の会場で 60 分で完走できる Chrome Built-in AI 4 API 体験コードラボ（スターターコード + Codelab スタイル静的ドキュメントサイト + 会場運営資料）を制作する。

**Architecture:** ビルドツール不要の Vanilla HTML/CSS/JS でスターターアプリを構築し、5 つのタブに独立した API ミニデモを配置する。ドキュメントは同じく静的 HTML の単一ページに全章を格納し、参加者は URL 1 つで完結する。全 5 章は順不同で実施可能な独立設計とし、Chapter 0（環境確認と共通パターン）のみを必修とする。

**Tech Stack:** HTML5, CSS3 (Grid/Flexbox), ES2022 Vanilla JavaScript (ESM), Chrome Built-in AI APIs (`LanguageDetector`, `Translator`, `Summarizer`, `LanguageModel`), GitHub Pages または Firebase Hosting

## Global Constraints

- **ビルドツール禁止**: `npm install` や webpack/vite を要求しない。すべてブラウザ直読みで動く単一 HTML + `<script type="module">` 構成。
- **外部 CDN 禁止**: オフラインでも会場で動くこと。すべての依存関係をリポジトリ内に同梱。
- **ライセンス**: Apache-2.0（Google 公式コードラボ準拠）。
- **記述言語**: コメント/コミットメッセージ/PR は英語、ユーザ向けドキュメント（README, 章解説, チートシート等）は日本語。
- **対象ブラウザ**: Chrome Canary / Chrome Dev（最新版のみサポート）。安定版は非対応と README に明記。
- **API 呼び出し規約**: 各章は 3 ステップパターン（`Api.availability()` → `Api.create()` → 実行メソッド）に統一する。availability の 4 状態（`unavailable`/`downloadable`/`downloading`/`available`）を扱う。
- **順不同独立性**: Chapter 1〜5 は他章の結果を前提としない。Chapter 0 のみ必修。
- **時間予算**: 60 分（Ch0=8 分 + Ch6=5 分 + Ch1〜5 可変 47 分）。
- **参加者スキル前提**: HTML/CSS/JS 基礎（`async/await`, DOM 操作, `fetch`）。
- **starter の TODO 規約**: 章ごとに `// TODO 1:` / `// TODO 2:` / `// TODO 3:` の番号付きコメントで挿入位置を明示する。
- **ファイル分割方針**: 各章のハンドラは `main.js` に共存させ、参加者が単一ファイルの中で完結できるようにする（コードラボは学習の集中を優先）。

## File Structure

制作物は 3 つのサブディレクトリに分ける：スターター配布物、リファレンス解答、ドキュメントサイト。

```
io-extended-tokyo-2026/
├── starter/                                # 参加者が clone/download する配布物
│   ├── index.html                          # タブ UI 込みの完成 HTML
│   ├── styles.css                          # 完成済み CSS
│   ├── main.js                             # 共通ヘルパ + 各章ハンドラ骨格（TODO 付き）
│   ├── lib/
│   │   └── schema.js                       # Prompt API 用 JSON Schema 定義
│   ├── assets/
│   │   └── sample-card.png                 # 名刺スキャン用サンプル画像
│   ├── README.md                           # 環境準備・トラブルシューティング
│   └── LICENSE                             # Apache-2.0
├── solutions/                              # メンター/講師用の完全解答
│   ├── main.js                             # TODO を埋めた完成版
│   └── README.md                           # 解答の解説・変更点まとめ
├── docs-site/                              # Codelab スタイル静的ドキュメント
│   ├── index.html                          # 全章を含む単一ページ + サイドナビ
│   ├── styles.css                          # Codelab スタイル
│   ├── docs.js                             # ナビ・目次・進捗管理
│   └── assets/
│       ├── screenshots/                    # 章ごとの期待画面
│       └── logos/                          # I/O Extended ロゴ等
├── event-materials/                        # 会場運営資料
│   ├── pre-event-announcement.md           # 事前アナウンス配布用テンプレ
│   ├── mentor-cheatsheet.md                # 会場スタッフ向けチートシート
│   └── venue-checklist.md                  # 前日/当日チェックリスト
└── docs/                                   # 設計プロセス記録（既存）
    └── superpowers/
        ├── specs/2026-07-04-chrome-builtin-ai-codelab-design.md
        └── plans/2026-07-04-chrome-builtin-ai-codelab.md
```

各ファイルの責務は Task の中で詳述する。

---

## Task 1: プロジェクト骨格とライセンス

**Files:**
- Create: `/home/yoichiro/projects/chrome/io-extended-tokyo-2026/starter/`
- Create: `/home/yoichiro/projects/chrome/io-extended-tokyo-2026/solutions/`
- Create: `/home/yoichiro/projects/chrome/io-extended-tokyo-2026/docs-site/`
- Create: `/home/yoichiro/projects/chrome/io-extended-tokyo-2026/event-materials/`
- Create: `starter/LICENSE`, `solutions/README.md` （スケルトン）
- Create: `.gitignore` （必要最小限）

**Interfaces:**
- Produces: プロジェクトディレクトリ骨格。以降の全 Task の作業場所。

- [ ] **Step 1: ディレクトリ作成**

Run:
```bash
cd /home/yoichiro/projects/chrome/io-extended-tokyo-2026
mkdir -p starter/lib starter/assets
mkdir -p solutions
mkdir -p docs-site/assets/screenshots docs-site/assets/logos
mkdir -p event-materials
```

Expected: 上記ディレクトリが全て存在。

- [ ] **Step 2: LICENSE ファイル作成（Apache-2.0）**

Create `starter/LICENSE` with the Apache-2.0 license text. Copy the canonical text from https://www.apache.org/licenses/LICENSE-2.0.txt.

The license file should be identical to the standard Apache-2.0 boilerplate — no modifications.

- [ ] **Step 3: `.gitignore` 作成**

Create `.gitignore` at repo root:
```
.DS_Store
node_modules/
.vscode/
.idea/
*.log
```

- [ ] **Step 4: `solutions/README.md` プレースホルダ作成**

Create with header only:
```markdown
# メンター/講師用リファレンス解答

このディレクトリには、starter/ の TODO を全て埋めた完成版コードが入っています。
会場スタッフとメンターは、参加者が詰まったときの参照として使用してください。

参加者にはこのディレクトリを配布しないでください。
```

- [ ] **Step 5: 検証**

Run:
```bash
find /home/yoichiro/projects/chrome/io-extended-tokyo-2026 -maxdepth 3 -type d | sort
ls /home/yoichiro/projects/chrome/io-extended-tokyo-2026/starter/LICENSE
```

Expected: 8 個のディレクトリ + LICENSE ファイル存在。

- [ ] **Step 6: Git 初期化（ユーザ承認後）**

Ask user: 「git リポジトリ化してよいですか？」承認後：
```bash
cd /home/yoichiro/projects/chrome/io-extended-tokyo-2026
git init
git add .gitignore starter/LICENSE solutions/README.md docs/
git commit -m "chore: initialize project skeleton and license"
```

Expected: 初回コミット成功。

---

## Task 2: スターター HTML（タブ UI 骨格）

**Files:**
- Create: `starter/index.html`

**Interfaces:**
- Produces:
  - `<header>` 内に `#env-badges` コンテナ
  - `<nav.tabs>` に 6 個の `.tab` ボタン（`data-tab="chapter-N"` 属性）
  - `<main>` に 6 個の `<section.chapter>` 要素（`id="chapter-N"`, N=0..5）
  - `<footer>` に I/O Extended ロゴエリア
  - 各 chapter section の内部構造は Task 6-11 で肉付けする（今は空の `<section>` のみ）

- [ ] **Step 1: HTML 骨格を作成**

Create `starter/index.html` with the following content:

```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chrome Built-in AI 60分ミニラボ</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <h1>🧪 Chrome Built-in AI ミニラボ</h1>
    <div id="env-badges" class="env-badges" aria-live="polite">
      <!-- Filled by main.js after checkAvailability() -->
    </div>
  </header>

  <nav class="tabs" role="tablist" aria-label="章切替">
    <button class="tab" role="tab" data-tab="chapter-0" aria-selected="true">🏁 導入</button>
    <button class="tab" role="tab" data-tab="chapter-1">🔤 言語判定</button>
    <button class="tab" role="tab" data-tab="chapter-2">🌐 翻訳</button>
    <button class="tab" role="tab" data-tab="chapter-3">📝 要約</button>
    <button class="tab" role="tab" data-tab="chapter-4">💬 感情分析</button>
    <button class="tab" role="tab" data-tab="chapter-5">📷 名刺OCR</button>
  </nav>

  <main>
    <section id="chapter-0" class="chapter chapter-active" role="tabpanel">
      <h2>🏁 導入・環境チェック</h2>
      <!-- Content filled in Task 5 -->
    </section>

    <section id="chapter-1" class="chapter" role="tabpanel" hidden>
      <h2>🔤 Language Detector</h2>
      <!-- Content filled in Task 6 -->
    </section>

    <section id="chapter-2" class="chapter" role="tabpanel" hidden>
      <h2>🌐 Translator</h2>
      <!-- Content filled in Task 7 -->
    </section>

    <section id="chapter-3" class="chapter" role="tabpanel" hidden>
      <h2>📝 Summarizer</h2>
      <!-- Content filled in Task 8 -->
    </section>

    <section id="chapter-4" class="chapter" role="tabpanel" hidden>
      <h2>💬 Prompt API（テキスト）— 感情分析＋タグ抽出</h2>
      <!-- Content filled in Task 10 -->
    </section>

    <section id="chapter-5" class="chapter" role="tabpanel" hidden>
      <h2>📷 Prompt API（画像）— 名刺OCR</h2>
      <!-- Content filled in Task 11 -->
    </section>
  </main>

  <footer class="site-footer">
    <p>Google I/O Extended Tokyo 2026 — Apache-2.0 License</p>
  </footer>

  <script type="module" src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: ブラウザで開いて骨格を確認**

Open `starter/index.html` in a browser (double-click or `file://` URL).

Expected: タイトル・タブボタン（6個）・見出しが表示される。CSS 未実装のためスタイルは崩れていて OK。JavaScript エラーは出る（main.js 未作成）。

- [ ] **Step 3: 手動検証チェックリスト**

- [ ] `<title>` に「Chrome Built-in AI 60分ミニラボ」が表示される
- [ ] タブが 6 個ある（🏁/🔤/🌐/📝/💬/📷）
- [ ] `chapter-0` 以外は `hidden` 属性で非表示
- [ ] Console に 404 (styles.css) と main.js エラーが出る（次 Task で解消）

- [ ] **Step 4: Commit（ユーザ承認後）**

```bash
git add starter/index.html
git commit -m "feat(starter): add HTML skeleton with tab UI"
```

---

## Task 3: スターター CSS（Codelab 風のスタイリング）

**Files:**
- Create: `starter/styles.css`

**Interfaces:**
- Produces:
  - `.tab` / `.tab-active` のスタイル
  - `.chapter` / `.chapter-active` のスタイル
  - `.env-badges` / `.env-badge` （5 種類の状態色）のスタイル
  - `.output` / `.status` / `.progress` の共通スタイル
  - `.button-primary` / `.select` / `.textarea` の基本フォーム部品

- [ ] **Step 1: CSS を作成**

Create `starter/styles.css`:

```css
:root {
  --color-bg: #ffffff;
  --color-fg: #1f1f1f;
  --color-muted: #666;
  --color-primary: #4285f4;
  --color-primary-hover: #3367d6;
  --color-success: #34a853;
  --color-warn: #fbbc04;
  --color-error: #ea4335;
  --color-border: #e0e0e0;
  --radius: 8px;
  --font-mono: 'SF Mono', Consolas, monospace;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #202124;
    --color-fg: #e8eaed;
    --color-muted: #9aa0a6;
    --color-border: #3c4043;
  }
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--color-bg);
  color: var(--color-fg);
  line-height: 1.6;
}

.site-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.site-header h1 { margin: 0; font-size: 1.4rem; }

.env-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.env-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  border: 1px solid var(--color-border);
}
.env-badge.state-available { background: color-mix(in srgb, var(--color-success) 15%, transparent); }
.env-badge.state-downloadable { background: color-mix(in srgb, var(--color-warn) 15%, transparent); }
.env-badge.state-downloading { background: color-mix(in srgb, var(--color-primary) 15%, transparent); }
.env-badge.state-unavailable { background: color-mix(in srgb, var(--color-error) 15%, transparent); }

.tabs {
  display: flex;
  gap: 0.25rem;
  padding: 0 2rem;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
}

.tab {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-muted);
  cursor: pointer;
  font-size: 0.95rem;
  border-bottom: 3px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  white-space: nowrap;
}

.tab:hover { color: var(--color-fg); }
.tab[aria-selected="true"] {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

main { padding: 2rem; max-width: 1000px; margin: 0 auto; }

.chapter { display: block; }
.chapter[hidden] { display: none; }

.field { margin: 1rem 0; }
.field label { display: block; font-weight: 600; margin-bottom: 0.3rem; }

.textarea, .select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: inherit;
  font-size: 1rem;
}

.textarea { min-height: 120px; font-family: var(--font-mono); }

.button-primary {
  padding: 0.6rem 1.2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.button-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.button-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.status {
  margin: 0.5rem 0;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
}
.status.kind-info { background: color-mix(in srgb, var(--color-primary) 10%, transparent); }
.status.kind-success { background: color-mix(in srgb, var(--color-success) 15%, transparent); }
.status.kind-error { background: color-mix(in srgb, var(--color-error) 15%, transparent); }

.progress {
  width: 100%;
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
}
.progress-bar {
  height: 100%;
  background: var(--color-primary);
  width: 0%;
  transition: width 0.15s;
}

.output {
  background: color-mix(in srgb, var(--color-fg) 5%, transparent);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 4rem;
  margin: 0.5rem 0;
}

.site-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  text-align: center;
  font-size: 0.85rem;
}

.hint {
  border-left: 3px solid var(--color-primary);
  padding: 0.5rem 1rem;
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
  margin: 1rem 0;
  border-radius: 0 var(--radius) var(--radius) 0;
}

details.solution-peek {
  margin: 1rem 0;
  padding: 0.5rem 0.75rem;
  border: 1px dashed var(--color-warn);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--color-warn) 5%, transparent);
}

details.solution-peek summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-warn);
}

details.solution-peek pre {
  margin: 0.5rem 0 0;
  overflow-x: auto;
}
```

- [ ] **Step 2: ブラウザで見た目を確認**

Reload `starter/index.html`.

Expected:
- ヘッダにタイトルが左寄せで表示
- タブが横並び、選択中の Chapter 0 タブに下線
- ダークモード対応（OS の設定で切替可能）
- レスポンシブ（狭い画面でタブが横スクロール）

- [ ] **Step 3: 検証チェックリスト**

- [ ] Chapter 0 タブに青い下線がある（`aria-selected="true"`）
- [ ] 他タブはグレー
- [ ] ダークモードで背景が黒っぽく切り替わる（OS 設定）
- [ ] ウィンドウを狭めるとタブが横スクロールできる

- [ ] **Step 4: Commit**

```bash
git add starter/styles.css
git commit -m "feat(starter): add base styles with dark mode support"
```

---

## Task 4: main.js 共通ヘルパとタブ切替

**Files:**
- Create: `starter/main.js`

**Interfaces:**
- Produces:
  - `$(sel)` — `document.querySelector` の短縮版
  - `$$(sel)` — `document.querySelectorAll` の短縮版（配列化済み）
  - `setStatus(tabId, msg, kind)` — 章内の `.status` にメッセージ表示（`kind`: `'info'|'success'|'error'`）
  - `showProgress(tabId, pct)` — 章内の `.progress-bar` の幅を更新
  - `hideProgress(tabId)` — 進捗バーを 0 に戻して非表示
  - `renderOutput(tabId, text)` — 章内の `.output` にテキスト/JSON を表示
  - `initTabs()` — ドキュメント読込時にタブクリックハンドラを登録
- Consumes: `index.html` の `.tab` / `.chapter` 構造（Task 2 で作成済み）

- [ ] **Step 1: main.js の共通ヘルパを作成**

Create `starter/main.js`:

```js
// =============================================================
// Chrome Built-in AI ミニラボ — main.js
// 参加者は各章の TODO コメント下にコードを書き足していきます。
// 共通ヘルパ（この上部）は編集不要です。
// =============================================================

// ---------- 共通ヘルパ ----------
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function chapterEl(tabId) {
  return document.getElementById(tabId);
}

export function setStatus(tabId, msg, kind = 'info') {
  const el = chapterEl(tabId)?.querySelector('.status');
  if (!el) return;
  el.textContent = msg;
  el.className = `status kind-${kind}`;
  el.hidden = !msg;
}

export function showProgress(tabId, pct) {
  const bar = chapterEl(tabId)?.querySelector('.progress-bar');
  const container = chapterEl(tabId)?.querySelector('.progress');
  if (!bar || !container) return;
  container.hidden = false;
  bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}

export function hideProgress(tabId) {
  const bar = chapterEl(tabId)?.querySelector('.progress-bar');
  const container = chapterEl(tabId)?.querySelector('.progress');
  if (!bar || !container) return;
  bar.style.width = '0%';
  container.hidden = true;
}

export function renderOutput(tabId, textOrObj) {
  const el = chapterEl(tabId)?.querySelector('.output');
  if (!el) return;
  if (typeof textOrObj === 'string') {
    el.textContent = textOrObj;
  } else {
    el.textContent = JSON.stringify(textOrObj, null, 2);
  }
}

// ---------- タブ切替 ----------
function initTabs() {
  const tabs = $$('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      tabs.forEach((t) => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
      $$('.chapter').forEach((section) => {
        section.hidden = section.id !== targetId;
      });
    });
  });
}

// ---------- 起動 ----------
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  // Task 5 で checkAvailability() をここから呼び出す
  console.log('Chrome Built-in AI ミニラボ 起動しました 🚀');
});
```

- [ ] **Step 2: 検証（ブラウザで動作確認）**

Reload `starter/index.html`.

Expected:
- Console に「Chrome Built-in AI ミニラボ 起動しました 🚀」が出る
- タブをクリックすると章が切り替わる（現時点では中身は空だが `hidden` 属性が切り替わる）
- Console にエラーなし

- [ ] **Step 3: DevTools で切替の挙動を確認**

DevTools > Elements で `#chapter-0` と `#chapter-1` の `hidden` 属性を観察。タブクリックで切り替わることを確認。

- [ ] **Step 4: Commit**

```bash
git add starter/main.js
git commit -m "feat(starter): add common DOM helpers and tab switching"
```

---

## Task 5: Chapter 0（導入・環境チェック）UI + `checkAvailability()`

**Files:**
- Modify: `starter/index.html`（`#chapter-0` セクションを埋める）
- Modify: `starter/main.js`（`checkAvailability()` と `renderAvailabilityBadges()` を追加）

**Interfaces:**
- Consumes: `$`, `setStatus` （Task 4）
- Produces:
  - `checkAvailability()` — Promise を返す。`{ languageDetector, translator, summarizer, languageModel: { text, image } }` オブジェクト。各値は `'unavailable'|'downloadable'|'downloading'|'available'`。
  - `renderAvailabilityBadges(results)` — `#env-badges` にバッジを描画
  - Chapter 0 の HTML マークアップ

- [ ] **Step 1: Chapter 0 の HTML を埋める**

Edit `starter/index.html`, replacing the Chapter 0 section body:

```html
<section id="chapter-0" class="chapter chapter-active" role="tabpanel">
  <h2>🏁 導入・環境チェック</h2>

  <p>このミニラボでは、Chrome Built-in AI の 4 つの API を <strong>60 分</strong>で体験します。</p>

  <div class="hint">
    <strong>📖 共通の 3 ステップパターン</strong>
    <ol>
      <li><code>Api.availability()</code> — 使えるか判定（4 状態）</li>
      <li><code>Api.create({...})</code> — セッション/インスタンス作成</li>
      <li>実行メソッド（<code>detect</code> / <code>translate</code> / <code>summarize</code> / <code>prompt</code>）</li>
    </ol>
  </div>

  <h3>環境チェック</h3>
  <p>下のバッジがすべて <span class="env-badge state-available">✅ available</span> になっていることを確認してから、上のタブで好きな章に進んでください。</p>
  <p><em>順序は自由です。難易度⭐️と所要時間は各章のヘッダに書いてあります。</em></p>

  <button class="button-primary" id="btn-recheck">環境チェックを再実行</button>
  <div class="status" hidden></div>
</section>
```

- [ ] **Step 2: `checkAvailability()` を main.js に追加**

Edit `starter/main.js`, adding after `renderOutput`:

```js
// ---------- 環境チェック ----------
const API_NAMES = {
  languageDetector: '🔤 Language Detector',
  translator: '🌐 Translator (en→ja)',
  summarizer: '📝 Summarizer',
  languageModelText: '💬 Prompt API (text)',
  languageModelImage: '📷 Prompt API (image)',
};

export async function checkAvailability() {
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

  return { languageDetector: ld, translator: tr, summarizer: sm, languageModelText: lmText, languageModelImage: lmImage };
}

export function renderAvailabilityBadges(results) {
  const badges = $('#env-badges');
  if (!badges) return;
  badges.innerHTML = '';
  for (const [key, label] of Object.entries(API_NAMES)) {
    const state = results[key] ?? 'unavailable';
    const badge = document.createElement('span');
    badge.className = `env-badge state-${state}`;
    const emoji = state === 'available' ? '✅' : state === 'downloadable' ? '⬇' : state === 'downloading' ? '⏳' : '❌';
    badge.innerHTML = `${emoji} ${label}`;
    badge.title = state;
    badges.appendChild(badge);
  }
}
```

- [ ] **Step 3: DOMContentLoaded で環境チェックを実行**

Replace the `DOMContentLoaded` handler at the bottom of `main.js`:

```js
document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  console.log('Chrome Built-in AI ミニラボ 起動しました 🚀');

  const results = await checkAvailability();
  renderAvailabilityBadges(results);
  console.log('availability:', results);

  $('#btn-recheck')?.addEventListener('click', async () => {
    setStatus('chapter-0', 'チェック中...', 'info');
    const r = await checkAvailability();
    renderAvailabilityBadges(r);
    setStatus('chapter-0', '再チェック完了', 'success');
  });
});
```

- [ ] **Step 4: 検証（Chrome Canary で動作確認）**

Open `starter/index.html` in Chrome Canary with all Built-in AI flags enabled.

Expected:
- 5 個の環境バッジが表示される
- API が使える環境なら緑（`available`）
- 「環境チェックを再実行」ボタンでチェックが走る
- Console に availability の生データが出る

- [ ] **Step 5: 検証（非対応 Chrome での挙動）**

Open the same HTML in a standard Chrome (安定版).

Expected:
- 全バッジが赤（`❌ unavailable`）
- エラーで JavaScript が止まらない（`safe()` でラップされているため）

- [ ] **Step 6: Commit**

```bash
git add starter/index.html starter/main.js
git commit -m "feat(starter): add Chapter 0 with environment availability check"
```

---

## Task 6: Chapter 1 — Language Detector

**Files:**
- Modify: `starter/index.html`（`#chapter-1` セクションを埋める）
- Modify: `starter/main.js`（`handleLanguageDetector()` を追加、TODO 骨格）
- Create: `solutions/main.js`（完成版の該当箇所を追加）

**Interfaces:**
- Consumes: `$`, `setStatus`, `renderOutput`
- Produces:
  - `handleLanguageDetector()` — Ch1 の実行ハンドラ（starter では TODO 空）
  - Ch1 の HTML UI（テキストエリア + 実行ボタン + オプション + 出力）

- [ ] **Step 1: Chapter 1 の HTML を埋める**

Edit `starter/index.html`, replacing the Chapter 1 section body:

```html
<section id="chapter-1" class="chapter" role="tabpanel" hidden>
  <h2>🔤 Language Detector</h2>

  <div class="hint">
    <strong>📇 メタ情報</strong><br>
    所要時間: 7分 / 難易度: ⭐️ / 使う共通ステップ: ①②③<br>
    ハイライト: <code>availability</code> の 4 状態を最も分かりやすく体験
  </div>

  <p><strong>🎯 ゴール</strong>：入力文の言語を判定し、トップ 3 候補を信頼度バー付きで表示する。</p>

  <div class="field">
    <label for="ld-input">判定したいテキスト</label>
    <textarea id="ld-input" class="textarea" placeholder="Bonjour, comment allez-vous?"></textarea>
  </div>

  <div class="field">
    <label><input type="checkbox" id="ld-restrict"> 候補言語を英・日・仏に絞る（STEP 3）</label>
  </div>

  <button class="button-primary" id="ld-run">判定する</button>
  <div class="status" hidden></div>
  <div class="output"></div>

  <details class="solution-peek">
    <summary>🚨 どうしても詰まったら（見本コードを開く）</summary>
    <pre><code>// TODO 1
const detector = await LanguageDetector.create(
  document.getElementById('ld-restrict').checked
    ? { expectedInputLanguages: ['en', 'ja', 'fr'] }
    : undefined
);

// TODO 2
const results = await detector.detect(text);

// TODO 3
renderOutput('chapter-1', results.slice(0, 3));</code></pre>
  </details>
</section>
```

- [ ] **Step 2: main.js に handleLanguageDetector を追加（TODO 骨格）**

Edit `starter/main.js`, adding a new section after `renderAvailabilityBadges`:

```js
// =============================================================
// Chapter 1: 🔤 Language Detector
// =============================================================
async function handleLanguageDetector() {
  const text = $('#ld-input').value.trim();
  if (!text) {
    setStatus('chapter-1', 'テキストを入力してください', 'error');
    return;
  }

  const useRestriction = $('#ld-restrict').checked;
  setStatus('chapter-1', '判定中...', 'info');

  try {
    // -----------------------------------------------------------
    // TODO 1: LanguageDetector.create() でセッションを作る
    //   ヒント: useRestriction が true のときは
    //   { expectedInputLanguages: ['en', 'ja', 'fr'] } を渡す
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

$('#ld-run')?.addEventListener('click', handleLanguageDetector);
```

⚠️ **注意**: 現時点では `$('#ld-run')` が `DOMContentLoaded` 前に評価される可能性があります。次の Step でこれを修正します。

- [ ] **Step 3: DOMContentLoaded 内でハンドラをバインドし直す**

Refactor the event binding: remove the top-level `$('#ld-run')?.addEventListener(...)` line and instead add it inside `DOMContentLoaded`:

Update the `DOMContentLoaded` handler to end with:

```js
  // 各章のイベントバインド
  $('#ld-run')?.addEventListener('click', handleLanguageDetector);
});
```

- [ ] **Step 4: 検証（Chrome Canary で TODO 未実装状態を確認）**

Open `starter/index.html`, click 🔤 tab, enter "Bonjour", click 判定する.

Expected:
- 「判定完了」ステータスは出る
- 出力エリアは空（TODO 未実装のため）
- Console にエラーなし

- [ ] **Step 5: solutions/main.js に完成版を作成**

Create `solutions/main.js` with the same imports/helpers/environment-check as starter, plus the complete handler:

```js
// (starter/main.js の共通ヘルパをコピーし、TODO を埋めた完成版を配置)
// ここでは Task 6 で完成する部分だけ抜粋:

async function handleLanguageDetector() {
  const text = $('#ld-input').value.trim();
  if (!text) {
    setStatus('chapter-1', 'テキストを入力してください', 'error');
    return;
  }

  const useRestriction = $('#ld-restrict').checked;
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
```

**Note**: `solutions/main.js` は starter の main.js を丸ごとコピーして TODO を埋めた完成版とする。以降の Task でも同様にメンテナンス。ファイル作成の第一段としては、Task 4 の main.js 全体をコピーし、Task 5 の checkAvailability も含めた状態にする。

- [ ] **Step 6: 検証（solutions の main.js で動作確認）**

一時的に `starter/index.html` の `<script src>` を `../solutions/main.js` に変更して、実際に動くか確認。

Enter "Bonjour, comment allez-vous?" and click 判定する.

Expected:
- 出力エリアに `[{ detectedLanguage: 'fr', confidence: 0.99... }, ...]` が表示される
- トップは仏語（`fr`）で高い信頼度

⚠️ 確認後、`<script src>` を `main.js` に戻す。

- [ ] **Step 7: 検証（英語・日本語でも動作）**

以下を試して、正しい言語が返るか確認：
- "Hello, how are you?" → `en`
- "こんにちは、元気ですか？" → `ja`
- "Guten Tag" → `de`（絞り込み OFF のとき）

- [ ] **Step 8: Commit**

```bash
git add starter/index.html starter/main.js solutions/main.js
git commit -m "feat(chapter-1): add Language Detector chapter with TODO scaffolding"
```

---

## Task 7: Chapter 2 — Translator

**Files:**
- Modify: `starter/index.html`（`#chapter-2` セクションを埋める）
- Modify: `starter/main.js`（`handleTranslate()` を追加、TODO 骨格）
- Modify: `solutions/main.js`（完成版）

**Interfaces:**
- Consumes: `$`, `setStatus`, `renderOutput`, `showProgress`, `hideProgress`
- Produces:
  - `handleTranslate()` — Ch2 の実行ハンドラ
  - Ch2 の HTML UI（source/target select + テキストエリア + 進捗バー + 出力）

- [ ] **Step 1: Chapter 2 の HTML を埋める**

Edit `starter/index.html`, replacing the Chapter 2 section body:

```html
<section id="chapter-2" class="chapter" role="tabpanel" hidden>
  <h2>🌐 Translator</h2>

  <div class="hint">
    <strong>📇 メタ情報</strong><br>
    所要時間: 10分 / 難易度: ⭐️⭐️ / 使う共通ステップ: ①②③<br>
    ハイライト: <code>downloadprogress</code> イベントでモデル DL を可視化
  </div>

  <p><strong>🎯 ゴール</strong>：source/target 言語を選んで翻訳し、モデルダウンロード進捗を表示する。</p>

  <div class="field">
    <label for="tr-source">翻訳元</label>
    <select id="tr-source" class="select">
      <option value="en">English</option>
      <option value="ja" selected>日本語</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
      <option value="zh">中文</option>
    </select>
  </div>

  <div class="field">
    <label for="tr-target">翻訳先</label>
    <select id="tr-target" class="select">
      <option value="en" selected>English</option>
      <option value="ja">日本語</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
      <option value="zh">中文</option>
    </select>
  </div>

  <div class="field">
    <label for="tr-input">翻訳したい文</label>
    <textarea id="tr-input" class="textarea" placeholder="こんにちは、今日はいい天気ですね。"></textarea>
  </div>

  <button class="button-primary" id="tr-run">翻訳する</button>
  <div class="status" hidden></div>
  <div class="progress" hidden><div class="progress-bar"></div></div>
  <div class="output"></div>

  <details class="solution-peek">
    <summary>🚨 見本コード</summary>
    <pre><code>const monitor = (m) => {
  m.addEventListener('downloadprogress', (e) => {
    showProgress('chapter-2', e.loaded * 100);
  });
};

const translator = await Translator.create({
  sourceLanguage,
  targetLanguage,
  monitor,
});

const translated = await translator.translate(text);
renderOutput('chapter-2', translated);</code></pre>
  </details>
</section>
```

- [ ] **Step 2: main.js に handleTranslate を追加（TODO 骨格）**

Edit `starter/main.js`, adding after Chapter 1 section:

```js
// =============================================================
// Chapter 2: 🌐 Translator
// =============================================================
async function handleTranslate() {
  const text = $('#tr-input').value.trim();
  const sourceLanguage = $('#tr-source').value;
  const targetLanguage = $('#tr-target').value;
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
```

Add to `DOMContentLoaded` handler binding section:

```js
  $('#tr-run')?.addEventListener('click', handleTranslate);
```

- [ ] **Step 3: solutions/main.js の該当箇所を完成させる**

Update `solutions/main.js` with the fully implemented `handleTranslate()`:

```js
async function handleTranslate() {
  const text = $('#tr-input').value.trim();
  const sourceLanguage = $('#tr-source').value;
  const targetLanguage = $('#tr-target').value;
  if (!text) { setStatus('chapter-2', 'テキストを入力してください', 'error'); return; }
  if (sourceLanguage === targetLanguage) { setStatus('chapter-2', 'source と target が同じです', 'error'); return; }

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

- [ ] **Step 4: 検証（英→日翻訳、DL 進捗確認）**

`starter/index.html` の script を一時的に solutions に切替し、以下を試す：

- source=en, target=ja, "Hello, how are you today?"
- 期待: 出力エリアに日本語訳（例：「こんにちは、今日はどうですか？」）
- 初回は進捗バーが動く（モデル DL）、2 回目以降は即座に完了

- [ ] **Step 5: 検証（別言語ペア）**

- source=ja, target=fr, "おはようございます"
- 期待: フランス語で "Bonjour" 系の翻訳

- [ ] **Step 6: script を戻して Commit**

```bash
git add starter/index.html starter/main.js solutions/main.js
git commit -m "feat(chapter-2): add Translator chapter with download progress"
```

---

## Task 8: Chapter 3 — Summarizer

**Files:**
- Modify: `starter/index.html`（`#chapter-3` セクションを埋める）
- Modify: `starter/main.js`（`handleSummarize()` を追加）
- Modify: `solutions/main.js`

**Interfaces:**
- Consumes: `$`, `setStatus`, `renderOutput`
- Produces:
  - `handleSummarize()` — Ch3 の実行ハンドラ
  - Ch3 の HTML UI（type/length select + textarea + streaming チェック + 出力）

- [ ] **Step 1: Chapter 3 の HTML を埋める**

Edit `starter/index.html`, replacing the Chapter 3 section body:

```html
<section id="chapter-3" class="chapter" role="tabpanel" hidden>
  <h2>📝 Summarizer</h2>

  <div class="hint">
    <strong>📇 メタ情報</strong><br>
    所要時間: 10分 / 難易度: ⭐️⭐️ / 使う共通ステップ: ①②③<br>
    ハイライト: <code>summarizeStreaming()</code> でリアルタイム表示
  </div>

  <p><strong>🎯 ゴール</strong>：長文を要約し、type/length オプションと streaming 出力を体験する。</p>

  <div class="field">
    <label for="sm-type">要約タイプ</label>
    <select id="sm-type" class="select">
      <option value="key-points" selected>Key points（箇条書き）</option>
      <option value="tl;dr">TL;DR（超短くまとめ）</option>
      <option value="teaser">Teaser（読みたくさせる）</option>
      <option value="headline">Headline（見出し風）</option>
    </select>
  </div>

  <div class="field">
    <label for="sm-length">長さ</label>
    <select id="sm-length" class="select">
      <option value="short">Short</option>
      <option value="medium" selected>Medium</option>
      <option value="long">Long</option>
    </select>
  </div>

  <div class="field">
    <label><input type="checkbox" id="sm-stream" checked> Streaming で表示（STEP 3）</label>
  </div>

  <div class="field">
    <label for="sm-input">要約したい長文</label>
    <textarea id="sm-input" class="textarea" placeholder="ここに 500 文字以上のテキストを貼り付けてください..."></textarea>
  </div>

  <button class="button-primary" id="sm-run">要約する</button>
  <div class="status" hidden></div>
  <div class="output"></div>

  <details class="solution-peek">
    <summary>🚨 見本コード</summary>
    <pre><code>const summarizer = await Summarizer.create({ type, length });

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
}</code></pre>
  </details>
</section>
```

- [ ] **Step 2: main.js に handleSummarize を追加（TODO 骨格）**

Edit `starter/main.js`, adding after Chapter 2 section:

```js
// =============================================================
// Chapter 3: 📝 Summarizer
// =============================================================
async function handleSummarize() {
  const text = $('#sm-input').value.trim();
  const type = $('#sm-type').value;
  const length = $('#sm-length').value;
  const useStreaming = $('#sm-stream').checked;

  if (!text) { setStatus('chapter-3', 'テキストを入力してください', 'error'); return; }
  if (text.length < 200) { setStatus('chapter-3', 'テキストが短すぎます（200文字以上推奨）', 'info'); }

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
```

Add to `DOMContentLoaded`:
```js
  $('#sm-run')?.addEventListener('click', handleSummarize);
```

- [ ] **Step 3: solutions/main.js を更新**

Add the complete `handleSummarize()` to `solutions/main.js`:

```js
async function handleSummarize() {
  const text = $('#sm-input').value.trim();
  const type = $('#sm-type').value;
  const length = $('#sm-length').value;
  const useStreaming = $('#sm-stream').checked;

  if (!text) { setStatus('chapter-3', 'テキストを入力してください', 'error'); return; }

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

- [ ] **Step 4: 検証（サンプル長文で要約動作）**

用意する検証用テキスト（starter/README にも掲載予定）：日本語の 500 文字程度のブログ記事引用。

Solutions 版で動作確認：
- type=key-points, length=medium, streaming ON: 箇条書きが逐次表示される
- type=tl;dr, length=short, streaming OFF: 短い要約が一気に表示される
- 出力言語は入力言語に応じて変わる（英文入力なら英文要約）

- [ ] **Step 5: script を戻して Commit**

```bash
git add starter/index.html starter/main.js solutions/main.js
git commit -m "feat(chapter-3): add Summarizer chapter with streaming support"
```

---

## Task 9: `lib/schema.js`（Prompt API 用 JSON Schema）

**Files:**
- Create: `starter/lib/schema.js`
- Copy: `solutions/lib/schema.js`（starter と完全一致）

**Interfaces:**
- Produces:
  - `SENTIMENT_SCHEMA` — Ch4 用（感情分析＋タグ抽出）
  - `BUSINESS_CARD_SCHEMA` — Ch5 用（名刺 OCR）

- [ ] **Step 1: `starter/lib/schema.js` を作成**

Create `starter/lib/schema.js`:

```js
// =============================================================
// Prompt API 用 JSON Schema 定義
// これらは各章で responseConstraint に渡すことで、
// LanguageModel の出力を指定形式の JSON に強制できます。
// =============================================================

export const SENTIMENT_SCHEMA = {
  type: 'object',
  properties: {
    sentiment: {
      type: 'string',
      enum: ['positive', 'neutral', 'negative'],
      description: '全体的な感情の傾向',
    },
    score: {
      type: 'number',
      minimum: -1,
      maximum: 1,
      description: '感情スコア（-1: 最もネガティブ、+1: 最もポジティブ）',
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 5,
      description: '内容を表す短いタグ（最大 5 個）',
    },
    summary: {
      type: 'string',
      description: '1 文でのまとめ',
    },
  },
  required: ['sentiment', 'score', 'tags', 'summary'],
};

export const BUSINESS_CARD_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: '氏名' },
    company: { type: 'string', description: '会社名' },
    title: { type: 'string', description: '役職' },
    email: { type: 'string', description: 'メールアドレス' },
    phone: {
      type: 'array',
      items: { type: 'string' },
      description: '電話番号（複数ある場合は配列で）',
    },
    address: { type: 'string', description: '住所' },
    website: { type: 'string', description: 'ウェブサイト URL' },
  },
  required: ['name', 'company'],
};
```

- [ ] **Step 2: `solutions/lib/` を作成し同ファイルをコピー**

```bash
mkdir -p /home/yoichiro/projects/chrome/io-extended-tokyo-2026/solutions/lib
cp /home/yoichiro/projects/chrome/io-extended-tokyo-2026/starter/lib/schema.js /home/yoichiro/projects/chrome/io-extended-tokyo-2026/solutions/lib/schema.js
```

- [ ] **Step 3: import が動くかスモークテスト**

Add a temporary console.log to `starter/main.js` at the top:

```js
import { SENTIMENT_SCHEMA, BUSINESS_CARD_SCHEMA } from './lib/schema.js';
console.log('Schemas loaded:', { SENTIMENT_SCHEMA, BUSINESS_CARD_SCHEMA });
```

Reload `index.html`, verify console shows both schemas.

- [ ] **Step 4: Commit**

```bash
git add starter/lib/schema.js solutions/lib/schema.js starter/main.js
git commit -m "feat(schemas): add JSON schemas for Prompt API structured output"
```

---

## Task 10: Chapter 4 — Prompt API テキスト（感情分析＋タグ抽出）

**Files:**
- Modify: `starter/index.html`（`#chapter-4` セクションを埋める）
- Modify: `starter/main.js`（`handlePromptText()` を追加）
- Modify: `solutions/main.js`

**Interfaces:**
- Consumes: `$`, `setStatus`, `renderOutput`, `SENTIMENT_SCHEMA` from `./lib/schema.js`
- Produces:
  - `handlePromptText()` — Ch4 の実行ハンドラ
  - Ch4 の HTML UI（レビュー入力 + system prompt テキストエリア + temperature スライダ + 出力）

- [ ] **Step 1: Chapter 4 の HTML を埋める**

Edit `starter/index.html`, replacing the Chapter 4 section body:

```html
<section id="chapter-4" class="chapter" role="tabpanel" hidden>
  <h2>💬 Prompt API（テキスト）— 感情分析＋タグ抽出</h2>

  <div class="hint">
    <strong>📇 メタ情報</strong><br>
    所要時間: 13分 / 難易度: ⭐️⭐️⭐️ / 使う共通ステップ: ①②③<br>
    ハイライト: <code>responseConstraint</code> で確実に JSON を返させる
  </div>

  <p><strong>🎯 ゴール</strong>：レビュー文を入力すると、<code>{ sentiment, score, tags, summary }</code> を JSON で返す。</p>

  <div class="field">
    <label for="pt-system">System Prompt（役割定義）</label>
    <textarea id="pt-system" class="textarea">あなたはレビュー分析の専門家です。入力されたレビュー文を分析し、感情・スコア・タグ・要約を JSON で返してください。</textarea>
  </div>

  <div class="field">
    <label for="pt-temperature">Temperature: <span id="pt-temperature-value">0.3</span></label>
    <input type="range" id="pt-temperature" min="0" max="2" step="0.1" value="0.3">
  </div>

  <div class="field">
    <label for="pt-input">レビュー文</label>
    <textarea id="pt-input" class="textarea" placeholder="このカメラは軽くて持ち運びやすいですが、暗い場所での画質はイマイチでした。"></textarea>
  </div>

  <button class="button-primary" id="pt-run">分析する</button>
  <div class="status" hidden></div>
  <div class="output"></div>

  <details class="solution-peek">
    <summary>🚨 見本コード</summary>
    <pre><code>const session = await LanguageModel.create({
  initialPrompts: [{ role: 'system', content: systemPrompt }],
  temperature,
  topK: 3,
});

const output = await session.prompt(reviewText, {
  responseConstraint: SENTIMENT_SCHEMA,
});

renderOutput('chapter-4', JSON.parse(output));</code></pre>
  </details>
</section>
```

- [ ] **Step 2: main.js に handlePromptText を追加（TODO 骨格）**

Edit `starter/main.js`, adding after Chapter 3 section:

```js
// =============================================================
// Chapter 4: 💬 Prompt API テキスト
// =============================================================
async function handlePromptText() {
  const systemPrompt = $('#pt-system').value.trim();
  const reviewText = $('#pt-input').value.trim();
  const temperature = parseFloat($('#pt-temperature').value);

  if (!reviewText) { setStatus('chapter-4', 'レビュー文を入力してください', 'error'); return; }

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

// Temperature ラベル同期
$('#pt-temperature')?.addEventListener('input', (e) => {
  const val = $('#pt-temperature-value');
  if (val) val.textContent = e.target.value;
});
```

Add to `DOMContentLoaded`:
```js
  $('#pt-run')?.addEventListener('click', handlePromptText);
  const tempSlider = $('#pt-temperature');
  tempSlider?.addEventListener('input', (e) => {
    $('#pt-temperature-value').textContent = e.target.value;
  });
```

- [ ] **Step 3: solutions/main.js の該当箇所を完成させる**

```js
async function handlePromptText() {
  const systemPrompt = $('#pt-system').value.trim();
  const reviewText = $('#pt-input').value.trim();
  const temperature = parseFloat($('#pt-temperature').value);

  if (!reviewText) { setStatus('chapter-4', 'レビュー文を入力してください', 'error'); return; }

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

- [ ] **Step 4: 検証（ポジ・ネガ両方のレビューで動作）**

Solutions で以下を試す：
- 「このカメラは最高です！画質もバッテリー持ちも素晴らしい」→ sentiment: positive, score > 0.5
- 「値段が高すぎるし壊れやすい。返品したい」→ sentiment: negative, score < -0.5
- 「まあまあでした。特に問題はないけど感動もない」→ sentiment: neutral, score ≈ 0

- [ ] **Step 5: 検証（temperature の影響を確認）**

同じレビュー文で temperature=0 と temperature=1.5 で複数回試し、出力の tags や summary の揺らぎ方が違うことを確認。

- [ ] **Step 6: Commit**

```bash
git add starter/index.html starter/main.js solutions/main.js
git commit -m "feat(chapter-4): add Prompt API text with structured output"
```

---

## Task 11: Chapter 5 — Prompt API 画像（名刺 OCR）＋ サンプル画像

**Files:**
- Modify: `starter/index.html`（`#chapter-5` セクションを埋める）
- Modify: `starter/main.js`（`handlePromptImage()` を追加）
- Modify: `solutions/main.js`
- Create: `starter/assets/sample-card.png` （手作りのサンプル名刺画像）
- Copy: `solutions/assets/sample-card.png`

**Interfaces:**
- Consumes: `$`, `setStatus`, `renderOutput`, `BUSINESS_CARD_SCHEMA`
- Produces:
  - `handlePromptImage()` — Ch5 の実行ハンドラ
  - Ch5 の HTML UI（file input + サンプル画像プレビュー + 出力）
  - `sample-card.png` — オフライン検証用のサンプル名刺画像

- [ ] **Step 1: サンプル名刺画像を用意**

**方針**: 著作権クリアなサンプル画像を用意する。以下のいずれか：
- ダミーの名刺画像を Canva 等で自作（推奨、5〜10 分）
- パブリックドメインの名刺画像を検索してダウンロード
- テキストベースで PNG を生成する簡易スクリプトで作成

参考例：Canva で「氏名: 山田太郎 / 会社: サンプル株式会社 / 役職: エンジニア / email: yamada@example.com / phone: 03-1234-5678」を含む名刺デザインを作成、PNG エクスポート。

作成後：
```bash
cp <作成した画像> /home/yoichiro/projects/chrome/io-extended-tokyo-2026/starter/assets/sample-card.png
mkdir -p /home/yoichiro/projects/chrome/io-extended-tokyo-2026/solutions/assets
cp /home/yoichiro/projects/chrome/io-extended-tokyo-2026/starter/assets/sample-card.png /home/yoichiro/projects/chrome/io-extended-tokyo-2026/solutions/assets/sample-card.png
```

- [ ] **Step 2: Chapter 5 の HTML を埋める**

Edit `starter/index.html`, replacing the Chapter 5 section body:

```html
<section id="chapter-5" class="chapter" role="tabpanel" hidden>
  <h2>📷 Prompt API（画像）— 名刺 OCR</h2>

  <div class="hint">
    <strong>📇 メタ情報</strong><br>
    所要時間: 10分 / 難易度: ⭐️⭐️⭐️ / 使う共通ステップ: ①②③<br>
    ハイライト: <code>expectedInputs: [{ type: 'image' }]</code> のマルチモーダル
  </div>

  <p><strong>🎯 ゴール</strong>：名刺画像から連絡先情報を JSON で抽出する。</p>

  <div class="field">
    <label for="pi-file">名刺画像をアップロード</label>
    <input type="file" id="pi-file" accept="image/*">
    <button class="button-primary" id="pi-use-sample" style="margin-left: 1rem;">サンプル画像を使う</button>
  </div>

  <div id="pi-preview" class="output" style="text-align: center; padding: 0;">
    <em>画像を選ぶとここにプレビューが表示されます</em>
  </div>

  <button class="button-primary" id="pi-run">連絡先を抽出する</button>
  <div class="status" hidden></div>
  <div class="output"></div>

  <details class="solution-peek">
    <summary>🚨 見本コード</summary>
    <pre><code>const session = await LanguageModel.create({
  expectedInputs: [{ type: 'image' }],
});

const output = await session.prompt([{
  role: 'user',
  content: [
    { type: 'image', value: imageBlob },
    { type: 'text', value: 'この名刺から連絡先情報を JSON で抽出してください。' },
  ],
}], { responseConstraint: BUSINESS_CARD_SCHEMA });

renderOutput('chapter-5', JSON.parse(output));</code></pre>
  </details>
</section>
```

- [ ] **Step 3: main.js に handlePromptImage を追加（TODO 骨格）**

Edit `starter/main.js`, adding after Chapter 4 section:

```js
// =============================================================
// Chapter 5: 📷 Prompt API 画像
// =============================================================
let currentImageBlob = null;

function previewImage(blob) {
  currentImageBlob = blob;
  const preview = $('#pi-preview');
  if (!preview) return;
  const url = URL.createObjectURL(blob);
  preview.innerHTML = `<img src="${url}" alt="preview" style="max-width: 100%; max-height: 300px;">`;
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
```

Add to `DOMContentLoaded`:
```js
  $('#pi-file')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) previewImage(file);
  });
  $('#pi-use-sample')?.addEventListener('click', async () => {
    const res = await fetch('./assets/sample-card.png');
    const blob = await res.blob();
    previewImage(blob);
  });
  $('#pi-run')?.addEventListener('click', handlePromptImage);
```

- [ ] **Step 4: solutions/main.js の該当箇所を完成させる**

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

- [ ] **Step 5: 検証（サンプル画像で動作）**

Solutions 版で：
- 「サンプル画像を使う」ボタンをクリック → プレビュー表示
- 「連絡先を抽出する」→ JSON で `{ name, company, title, email, phone: [...] }` が返る

- [ ] **Step 6: 検証（自前の名刺 or 別画像）**

自分の名刺（もしくは英語圏の名刺のサンプル画像）をアップロードして動作確認。

- [ ] **Step 7: Commit**

```bash
git add starter/index.html starter/main.js solutions/main.js starter/assets/sample-card.png solutions/assets/sample-card.png
git commit -m "feat(chapter-5): add Prompt API image chapter with business card OCR"
```

---

## Task 12: starter/README.md（環境準備・トラブルシューティング）

**Files:**
- Create: `starter/README.md`

**Interfaces:**
- Produces: 参加者向けの完全な事前準備ガイドとトラブルシューティング集

- [ ] **Step 1: `starter/README.md` を作成**

Create `starter/README.md`:

```markdown
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
- メモリ: **8GB 以上推奨**
- OS: Windows 10+ / macOS 13+ / Linux（一部制限あり）

## 🚀 コードラボの始め方

このディレクトリを解凍または clone し、`index.html` を Chrome で開いてください：

```bash
# 直接開く場合
open starter/index.html

# もしくは軽量ローカルサーバで（推奨、ES module の CORS 対策）
python3 -m http.server 8000
# → http://localhost:8000/starter/index.html
```

ページ上部のバッジがすべて ✅ **available** になっていれば準備完了です。

## 📁 ファイル構成

```
starter/
├── index.html      # メインの HTML（タブ UI）
├── styles.css      # スタイル定義
├── main.js         # ここに TODO コメントがあります ← ここを書く
├── lib/
│   └── schema.js   # Prompt API 用の JSON Schema
├── assets/
│   └── sample-card.png  # 名刺 OCR のサンプル画像
└── README.md       # このファイル
```

## 🎓 進め方

1. Chapter 0（🏁 導入）で環境チェックを済ませる
2. **好きな章から**取り組む（順不同 OK）
3. `main.js` の `// TODO N:` コメントの下にコードを書き足す
4. 詰まったら各章の「🚨 見本コード」を開く（`<details>` 折りたたみ）

各章の詳しい手順は Codelab サイトを参照：**[会場で配布される URL]**

## 🛟 トラブルシューティング

### 「LanguageDetector is not defined」

フラグが有効になっていないか、Chrome が再起動されていません。事前準備の 2 を再確認。

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
```

- [ ] **Step 2: 検証**

Read README aloud (or preview in a Markdown viewer) to make sure the flow makes sense: install Chrome → enable flags → download model → start coding.

- [ ] **Step 3: Commit**

```bash
git add starter/README.md
git commit -m "docs(starter): add README with prerequisites and troubleshooting"
```

---

## Task 13: docs-site の骨格（Codelab スタイル単一ページ）

**Files:**
- Create: `docs-site/index.html`
- Create: `docs-site/styles.css`
- Create: `docs-site/docs.js`

**Interfaces:**
- Produces:
  - `docs-site/index.html` — サイドバー付き Codelab 風レイアウト、7 章分の `<article>` を含む骨格
  - `docs-site/styles.css` — Codelab 風スタイル
  - `docs-site/docs.js` — サイドバー ↔ 本文のスクロールスパイ、進捗チェックマーク

- [ ] **Step 1: docs-site/index.html を作成**

```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chrome Built-in AI 60分ミニラボ — Codelab</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <h1 class="logo">🧪 Codelab</h1>
      <nav>
        <ol id="toc"></ol>
      </nav>
    </aside>

    <main class="content">
      <article id="ch-0" data-title="🏁 導入・環境チェック"></article>
      <article id="ch-1" data-title="🔤 Language Detector"></article>
      <article id="ch-2" data-title="🌐 Translator"></article>
      <article id="ch-3" data-title="📝 Summarizer"></article>
      <article id="ch-4" data-title="💬 Prompt API テキスト"></article>
      <article id="ch-5" data-title="📷 Prompt API 画像"></article>
      <article id="ch-6" data-title="🎨 拡張タイム＆Q&A"></article>
    </main>
  </div>

  <script type="module" src="docs.js"></script>
</body>
</html>
```

- [ ] **Step 2: docs-site/styles.css を作成**

```css
:root {
  --sidebar-w: 280px;
  --color-bg: #ffffff;
  --color-fg: #1f1f1f;
  --color-muted: #666;
  --color-primary: #4285f4;
  --color-code-bg: #f5f5f5;
  --color-border: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #202124;
    --color-fg: #e8eaed;
    --color-muted: #9aa0a6;
    --color-code-bg: #2d2e30;
    --color-border: #3c4043;
  }
}

* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--color-bg); color: var(--color-fg); }

.layout { display: grid; grid-template-columns: var(--sidebar-w) 1fr; min-height: 100vh; }

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 1.5rem 1rem;
  border-right: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-fg) 3%, transparent);
}
.logo { margin: 0 0 1.5rem 0; font-size: 1.2rem; }
.sidebar nav ol { list-style: none; padding: 0; margin: 0; }
.sidebar nav ol li {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.25rem;
  cursor: pointer;
  color: var(--color-muted);
  font-size: 0.9rem;
}
.sidebar nav ol li:hover { color: var(--color-fg); }
.sidebar nav ol li.active {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  font-weight: 600;
}
.sidebar nav ol li.completed::before { content: '✅ '; }

.content { padding: 2rem 3rem; max-width: 900px; }
article { padding: 2rem 0; border-bottom: 1px solid var(--color-border); }
article h1 { margin-top: 0; }
article h2 { margin-top: 2rem; }
article pre {
  background: var(--color-code-bg);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
}
article code:not(pre code) {
  background: var(--color-code-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}
.meta-card {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  border-left: 4px solid var(--color-primary);
  padding: 1rem;
  border-radius: 0 6px 6px 0;
  margin: 1rem 0;
}
.step {
  background: color-mix(in srgb, var(--color-fg) 3%, transparent);
  border-radius: 6px;
  padding: 1rem 1.5rem;
  margin: 1rem 0;
}
.step h3 { margin-top: 0; }
.checkpoint {
  border: 2px dashed var(--color-primary);
  padding: 1rem;
  border-radius: 6px;
  margin: 1.5rem 0;
}
.copy-btn {
  float: right;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--color-border); }
  .content { padding: 1.5rem; }
}
```

- [ ] **Step 3: docs-site/docs.js を作成**

```js
// サイドバー TOC 自動生成 + スクロールスパイ + 完了チェック

const articles = document.querySelectorAll('article');
const toc = document.getElementById('toc');

const items = [];
articles.forEach((art) => {
  const li = document.createElement('li');
  li.textContent = art.dataset.title;
  li.dataset.target = art.id;
  li.addEventListener('click', () => {
    art.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  toc.appendChild(li);
  items.push(li);
});

// スクロールスパイ
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      items.forEach((li) => li.classList.toggle('active', li.dataset.target === entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

articles.forEach((a) => observer.observe(a));

// 完了マーク（localStorage 永続化）
const COMPLETED_KEY = 'codelab-completed';
const completed = new Set(JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]'));
function refreshCompleted() {
  items.forEach((li) => li.classList.toggle('completed', completed.has(li.dataset.target)));
}
refreshCompleted();

// 各 article に完了ボタンを注入
articles.forEach((art) => {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = completed.has(art.id) ? '✅ 完了済み' : 'この章を完了にする';
  btn.style.cssText = 'position: sticky; top: 1rem; float: right; padding: 0.4rem 0.8rem;';
  btn.addEventListener('click', () => {
    if (completed.has(art.id)) { completed.delete(art.id); } else { completed.add(art.id); }
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completed]));
    refreshCompleted();
    btn.textContent = completed.has(art.id) ? '✅ 完了済み' : 'この章を完了にする';
  });
  art.prepend(btn);
});
```

- [ ] **Step 4: 検証**

Open `docs-site/index.html` in a browser.

Expected:
- サイドバーに 7 章の TOC が並ぶ
- クリックすると該当章にスクロール
- 「この章を完了にする」ボタンでチェックが付き、リロード後も維持される
- 章の中身は空だが構造は動く

- [ ] **Step 5: Commit**

```bash
git add docs-site/
git commit -m "feat(docs-site): add Codelab-style scaffolding with TOC and progress"
```

---

## Task 14: Chapter 0 のドキュメント本文

**Files:**
- Modify: `docs-site/index.html`（`#ch-0` の内容を埋める）

**Interfaces:**
- Consumes: docs-site の基本 CSS/JS（Task 13）
- Produces: Chapter 0 の完全な解説文書

- [ ] **Step 1: `#ch-0` の中身を書く**

Edit `docs-site/index.html`, replace `<article id="ch-0" data-title="🏁 導入・環境チェック"></article>` with:

```html
<article id="ch-0" data-title="🏁 導入・環境チェック">
  <h1>🏁 Chapter 0: 導入・環境チェック</h1>

  <div class="meta-card">
    <strong>所要時間:</strong> 8 分 / <strong>必修</strong><br>
    <strong>この章のゴール:</strong> 全 API の共通パターンを理解し、環境が使えることを確認する
  </div>

  <h2>📚 Chrome Built-in AI とは？</h2>
  <p>Chrome 内蔵の <strong>Gemini Nano</strong> モデルを使い、サーバー通信なしにブラウザ内で LLM 推論を実行できる仕組みです。プライバシー・遅延・コストの面で強力な利点があります。</p>

  <h2>🎯 5 つの API</h2>
  <ul>
    <li>🔤 <strong>Language Detector</strong> — テキストの言語を判定</li>
    <li>🌐 <strong>Translator</strong> — 多言語翻訳</li>
    <li>📝 <strong>Summarizer</strong> — 長文の要約</li>
    <li>💬 <strong>Prompt API（テキスト）</strong> — 汎用 LLM（構造化出力対応）</li>
    <li>📷 <strong>Prompt API（画像）</strong> — マルチモーダル入力</li>
  </ul>

  <h2>🧭 共通の 3 ステップパターン</h2>
  <p>全 API は同じ 3 ステップで呼び出せます：</p>
  <pre><code>// ① 使えるか判定（4 状態を返す）
const state = await Api.availability();
// 'unavailable' | 'downloadable' | 'downloading' | 'available'

// ② セッション/インスタンスを作成
const session = await Api.create({ ...options });

// ③ 実行メソッド
const result = await session.someMethod(input);</code></pre>

  <div class="checkpoint">
    <strong>✅ Checkpoint</strong>
    <ol>
      <li>スターターの <code>index.html</code> をブラウザで開いた</li>
      <li>ヘッダの環境バッジがすべて <code>✅ available</code> になっている</li>
      <li>まだの API があれば「⬇ 今すぐ DL 開始」ボタンでモデル取得を開始した</li>
    </ol>
  </div>

  <h2>🚀 次のステップ</h2>
  <p>環境が整ったら、サイドバーから好きな章を選んでください。順序は自由です。</p>
  <p>迷ったら難易度⭐️の少ない Chapter 1（Language Detector）からがおすすめです。</p>
</article>
```

- [ ] **Step 2: 検証**

Reload `docs-site/index.html`. Chapter 0 に完全な解説が表示されることを確認。

- [ ] **Step 3: Commit**

```bash
git add docs-site/index.html
git commit -m "docs(ch-0): add introduction and common pattern explanation"
```

---

## Task 15: Chapter 1 のドキュメント本文（Language Detector）

**Files:**
- Modify: `docs-site/index.html`（`#ch-1` を埋める）
- Optional Create: `docs-site/assets/screenshots/ch1-*.png`（実装後にスクショを撮って配置）

**Interfaces:**
- Produces: Chapter 1 の完全な解説文書

- [ ] **Step 1: `#ch-1` の中身を書く**

Replace `<article id="ch-1" data-title="🔤 Language Detector"></article>` with:

```html
<article id="ch-1" data-title="🔤 Language Detector">
  <h1>🔤 Chapter 1: Language Detector</h1>

  <div class="meta-card">
    <strong>所要時間:</strong> 7 分 / <strong>難易度:</strong> ⭐️ / <strong>使う共通ステップ:</strong> ①②③<br>
    <strong>この章のご褒美:</strong> <code>availability</code> の 4 状態を最も分かりやすく体験
  </div>

  <h2>🎯 ゴール</h2>
  <p>入力文の言語を判定し、トップ 3 候補を信頼度バー付きで表示する。</p>

  <h2>📚 API ざっくり紹介</h2>
  <p>Language Detector は、入力テキストがどの言語かを推定します。複数の候補と信頼度を返すため、精度も評価できます。</p>
  <p>公式ドキュメント: <a href="https://developer.chrome.com/docs/ai/language-detection" target="_blank">Language Detection API</a></p>

  <div class="step">
    <h3>🌱 STEP 1: 最小動作（3 分）</h3>
    <p><strong>やること:</strong> 入力文の言語を判定するだけ。</p>
    <p><strong>どこに書く:</strong> <code>main.js</code> の <code>handleLanguageDetector()</code> 内、<code>// TODO 1</code>〜<code>// TODO 3</code></p>
    <pre><code>// TODO 1: セッション作成
const detector = await LanguageDetector.create();

// TODO 2: 判定実行
const results = await detector.detect(text);

// TODO 3: 全結果を表示
renderOutput('chapter-1', results);</code></pre>
    <p><strong>期待される画面:</strong> 出力エリアに <code>[{ detectedLanguage: 'fr', confidence: 0.98 }, ...]</code> が表示される。</p>
  </div>

  <div class="step">
    <h3>🌿 STEP 2: トップ 3 に絞る（2 分）</h3>
    <p><strong>やること:</strong> 結果配列を上位 3 件に絞って表示。</p>
    <pre><code>// TODO 3 を書き換え
renderOutput('chapter-1', results.slice(0, 3));</code></pre>
  </div>

  <div class="step">
    <h3>🌳 STEP 3: 候補言語を絞る（2 分）</h3>
    <p><strong>やること:</strong> UI の「候補言語を英・日・仏に絞る」チェックボックスが ON のときだけ <code>expectedInputLanguages</code> を渡す。</p>
    <pre><code>// TODO 1 を書き換え
const detector = await LanguageDetector.create(
  document.getElementById('ld-restrict').checked
    ? { expectedInputLanguages: ['en', 'ja', 'fr'] }
    : undefined
);</code></pre>
    <p><strong>ポイント:</strong> 候補を絞ると精度と速度が向上します。</p>
  </div>

  <h2>🎨 Extend this!</h2>
  <ul>
    <li>入力中にリアルタイムで判定（<code>input</code> イベント + デバウンス）</li>
    <li>信頼度をカラフルなバーで可視化</li>
    <li>Translator と組み合わせて自動翻訳（Ch2 の拡張として）</li>
  </ul>

  <div class="checkpoint">
    <strong>✅ Checkpoint</strong>
    <ol>
      <li>英語・日本語・仏語で正しく判定される</li>
      <li>トップ 3 の信頼度が出力に表示される</li>
      <li>候補絞り込みチェックの ON/OFF で結果が変わることを確認</li>
    </ol>
  </div>
</article>
```

- [ ] **Step 2: 検証**

Reload `docs-site/index.html`, navigate to Chapter 1 via sidebar. Verify all sections render properly.

- [ ] **Step 3: Commit**

```bash
git add docs-site/index.html
git commit -m "docs(ch-1): add Language Detector chapter documentation"
```

---

## Task 16: Chapter 2 のドキュメント本文（Translator）

**Files:**
- Modify: `docs-site/index.html`（`#ch-2` を埋める）

- [ ] **Step 1: `#ch-2` の中身を書く**

Replace `<article id="ch-2" data-title="🌐 Translator"></article>` with the following content (structure follows Task 15's template with content adapted for Translator):

```html
<article id="ch-2" data-title="🌐 Translator">
  <h1>🌐 Chapter 2: Translator</h1>

  <div class="meta-card">
    <strong>所要時間:</strong> 10 分 / <strong>難易度:</strong> ⭐️⭐️ / <strong>使う共通ステップ:</strong> ①②③<br>
    <strong>この章のご褒美:</strong> モデル DL 進捗を <code>downloadprogress</code> イベントで可視化
  </div>

  <h2>🎯 ゴール</h2>
  <p>source/target 言語を UI で選んで翻訳し、初回のモデルダウンロード進捗をリアルタイム表示する。</p>

  <h2>📚 API ざっくり紹介</h2>
  <p>Translator は、指定した言語ペアの翻訳を行います。言語ペアごとに専用モデルを持ち、初回だけダウンロードが発生します。</p>
  <p>公式ドキュメント: <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">Translator API</a></p>

  <div class="step">
    <h3>🌱 STEP 1: 最小動作（4 分）</h3>
    <pre><code>// TODO 2: セッション作成
const translator = await Translator.create({ sourceLanguage, targetLanguage });

// TODO 3: 翻訳実行
const translated = await translator.translate(text);
renderOutput('chapter-2', translated);</code></pre>
    <p><strong>期待:</strong> 初回は数秒〜数十秒（モデル DL）、2 回目以降は即座に翻訳完了。</p>
  </div>

  <div class="step">
    <h3>🌿 STEP 2: ダウンロード進捗を可視化（3 分）</h3>
    <pre><code>// TODO 1: monitor を定義（downloadprogress を購読）
const monitor = (m) => {
  m.addEventListener('downloadprogress', (e) => {
    showProgress('chapter-2', e.loaded * 100);
  });
};

// TODO 2: create に monitor を渡す
const translator = await Translator.create({
  sourceLanguage,
  targetLanguage,
  monitor,
});</code></pre>
    <p><strong>ポイント:</strong> <code>e.loaded</code> は 0〜1 の進捗率。0.5 なら 50%。</p>
  </div>

  <div class="step">
    <h3>🌳 STEP 3: 複数言語ペアを試す（3 分）</h3>
    <p>UI の source/target セレクトを切り替えて、複数のペアで動作を確認：</p>
    <ul>
      <li>en → ja / ja → en</li>
      <li>fr → ja / ja → fr</li>
      <li>en → de</li>
    </ul>
    <p><strong>気づき:</strong> 新しい言語ペアを初めて使うたびにモデル DL が発生します。</p>
  </div>

  <h2>🎨 Extend this!</h2>
  <ul>
    <li>逆翻訳で品質チェック（en→ja→en して原文と比較）</li>
    <li>Language Detector と連携して source を自動判定</li>
    <li>翻訳結果の音声合成（<code>speechSynthesis</code>）</li>
  </ul>

  <div class="checkpoint">
    <strong>✅ Checkpoint</strong>
    <ol>
      <li>en → ja で翻訳結果が出る</li>
      <li>初回に進捗バーが動く</li>
      <li>2 回目以降は進捗バーが出ない（キャッシュ済み）</li>
    </ol>
  </div>
</article>
```

- [ ] **Step 2: 検証 & Commit**

Reload, confirm, then:
```bash
git add docs-site/index.html
git commit -m "docs(ch-2): add Translator chapter documentation"
```

---

## Task 17: Chapter 3 のドキュメント本文（Summarizer）

**Files:**
- Modify: `docs-site/index.html`（`#ch-3` を埋める）

- [ ] **Step 1: `#ch-3` の中身を書く**

Replace `<article id="ch-3" data-title="📝 Summarizer"></article>` with:

```html
<article id="ch-3" data-title="📝 Summarizer">
  <h1>📝 Chapter 3: Summarizer</h1>

  <div class="meta-card">
    <strong>所要時間:</strong> 10 分 / <strong>難易度:</strong> ⭐️⭐️ / <strong>使う共通ステップ:</strong> ①②③<br>
    <strong>この章のご褒美:</strong> <code>summarizeStreaming()</code> でリアルタイム出力を体験
  </div>

  <h2>🎯 ゴール</h2>
  <p>長文を要約し、type/length オプションと streaming 出力を切り替えて挙動の違いを体感する。</p>

  <h2>📚 API ざっくり紹介</h2>
  <p>Summarizer は、テキストを 4 種類の型と 3 段階の長さで要約できます。<code>summarize()</code>（一括）と <code>summarizeStreaming()</code>（逐次）の 2 種類があります。</p>
  <p>公式ドキュメント: <a href="https://developer.chrome.com/docs/ai/summarizer-api" target="_blank">Summarizer API</a></p>

  <div class="step">
    <h3>🌱 STEP 1: 最小動作（4 分）</h3>
    <pre><code>// TODO 1: セッション作成
const summarizer = await Summarizer.create({ type, length });

// TODO 2: 要約実行
const result = await summarizer.summarize(text);
renderOutput('chapter-3', result);</code></pre>
  </div>

  <div class="step">
    <h3>🌿 STEP 2: type / length を UI と連動（3 分）</h3>
    <p><strong>type</strong> の選択肢:</p>
    <ul>
      <li><code>tl;dr</code> — 超短くまとめ</li>
      <li><code>teaser</code> — 読みたくさせる導入</li>
      <li><code>key-points</code> — 箇条書きの要点</li>
      <li><code>headline</code> — 見出し風の一言</li>
    </ul>
    <p><strong>length</strong>: <code>short</code> / <code>medium</code> / <code>long</code></p>
    <p>UI の select と <code>type</code>/<code>length</code> を連動させ、いくつかの組み合わせを試してみましょう。</p>
  </div>

  <div class="step">
    <h3>🌳 STEP 3: Streaming で逐次表示（3 分）</h3>
    <pre><code>// TODO 2 を書き換え
const stream = summarizer.summarizeStreaming(text);
let acc = '';
for await (const chunk of stream) {
  acc += chunk;
  renderOutput('chapter-3', acc);
}</code></pre>
    <p><strong>体感:</strong> 非 streaming だと最後まで待たされますが、streaming は文字が徐々に埋まっていくので体感速度が劇的に上がります。</p>
  </div>

  <h2>🎨 Extend this!</h2>
  <ul>
    <li>URL 入力 → <code>fetch</code> で本文取得 → 要約</li>
    <li>要約結果を Translator で他言語に翻訳</li>
    <li>複数記事を並列に要約して見出し一覧を作る</li>
  </ul>

  <div class="checkpoint">
    <strong>✅ Checkpoint</strong>
    <ol>
      <li>type / length の切替で出力が変わる</li>
      <li>streaming モードで文字が徐々に表示される</li>
    </ol>
  </div>
</article>
```

- [ ] **Step 2: 検証 & Commit**

```bash
git add docs-site/index.html
git commit -m "docs(ch-3): add Summarizer chapter documentation"
```

---

## Task 18: Chapter 4 のドキュメント本文（Prompt API テキスト）

**Files:**
- Modify: `docs-site/index.html`（`#ch-4` を埋める）

- [ ] **Step 1: `#ch-4` の中身を書く**

Replace `<article id="ch-4" data-title="💬 Prompt API テキスト"></article>` with:

```html
<article id="ch-4" data-title="💬 Prompt API テキスト">
  <h1>💬 Chapter 4: Prompt API テキスト — 感情分析＋タグ抽出</h1>

  <div class="meta-card">
    <strong>所要時間:</strong> 13 分 / <strong>難易度:</strong> ⭐️⭐️⭐️ / <strong>使う共通ステップ:</strong> ①②③<br>
    <strong>この章のご褒美:</strong> 「LLM を関数として使う」感覚 — <code>responseConstraint</code> で JSON 強制
  </div>

  <h2>🎯 ゴール</h2>
  <p>レビュー文を入力すると、<code>{ sentiment, score, tags, summary }</code> という決まった形の JSON で返す。</p>

  <h2>📚 API ざっくり紹介</h2>
  <p>Prompt API（<code>LanguageModel</code>）は、汎用 LLM を呼び出すインターフェイスです。<code>responseConstraint</code> に JSON Schema を渡すと、出力を指定形式に強制できます。</p>
  <p>公式ドキュメント: <a href="https://developer.chrome.com/docs/ai/prompt-api" target="_blank">Prompt API</a></p>

  <h2>📋 使う JSON Schema</h2>
  <p><code>lib/schema.js</code> に既に定義済み — <code>SENTIMENT_SCHEMA</code> を import して使います：</p>
  <pre><code>import { SENTIMENT_SCHEMA } from './lib/schema.js';
// SENTIMENT_SCHEMA = { type: 'object', properties: { sentiment, score, tags, summary }, ... }</code></pre>

  <div class="step">
    <h3>🌱 STEP 1: 自由応答で会話（4 分）</h3>
    <pre><code>// TODO 1: セッション作成（system prompt 付き）
const session = await LanguageModel.create({
  initialPrompts: [{ role: 'system', content: systemPrompt }],
});

// TODO 2 & 3: 実行して表示
const output = await session.prompt(reviewText);
renderOutput('chapter-4', output);</code></pre>
    <p><strong>気づき:</strong> このままだと出力形式が毎回バラつきます。</p>
  </div>

  <div class="step">
    <h3>🌿 STEP 2: JSON Schema で強制（5 分）— この章の目玉 ✨</h3>
    <pre><code>// TODO 2 を書き換え
const output = await session.prompt(reviewText, {
  responseConstraint: SENTIMENT_SCHEMA,
});

// TODO 3: JSON.parse して構造化表示
renderOutput('chapter-4', JSON.parse(output));</code></pre>
    <p><strong>体験:</strong> 何度実行しても常に同じキーの JSON が返ります。バリデーションのプリミティブとして超便利。</p>
  </div>

  <div class="step">
    <h3>🌳 STEP 3: temperature / topK でチューニング（4 分）</h3>
    <pre><code>const session = await LanguageModel.create({
  initialPrompts: [{ role: 'system', content: systemPrompt }],
  temperature,   // 0（保守的）〜 2（創造的）
  topK: 3,       // サンプリングの多様性
});</code></pre>
    <p>UI のスライダで temperature を変えながら、同じレビュー文を複数回実行してみましょう。<code>tags</code> や <code>summary</code> の揺らぎ方が変わります。</p>
  </div>

  <h2>🎨 Extend this!</h2>
  <ul>
    <li>複数レビューをまとめて分析（1 セッションで複数 prompt を投げる）</li>
    <li>過去の会話を保持したチャット UI に発展</li>
    <li>tags を集計してタグクラウド表示</li>
  </ul>

  <div class="checkpoint">
    <strong>✅ Checkpoint</strong>
    <ol>
      <li>ポジティブなレビューで sentiment: positive, score が高くなる</li>
      <li>ネガティブなレビューで sentiment: negative, score が低くなる</li>
      <li>tags に短いキーワードが 3〜5 個含まれる</li>
      <li>常に有効な JSON が返る（parse エラーなし）</li>
    </ol>
  </div>
</article>
```

- [ ] **Step 2: 検証 & Commit**

```bash
git add docs-site/index.html
git commit -m "docs(ch-4): add Prompt API text chapter documentation"
```

---

## Task 19: Chapter 5 のドキュメント本文（Prompt API 画像）

**Files:**
- Modify: `docs-site/index.html`（`#ch-5` を埋める）

- [ ] **Step 1: `#ch-5` の中身を書く**

Replace `<article id="ch-5" data-title="📷 Prompt API 画像"></article>` with:

```html
<article id="ch-5" data-title="📷 Prompt API 画像">
  <h1>📷 Chapter 5: Prompt API 画像 — 名刺 OCR</h1>

  <div class="meta-card">
    <strong>所要時間:</strong> 10 分 / <strong>難易度:</strong> ⭐️⭐️⭐️ / <strong>使う共通ステップ:</strong> ①②③<br>
    <strong>この章のご褒美:</strong> マルチモーダル × structured output の合わせ技
  </div>

  <h2>🎯 ゴール</h2>
  <p>名刺画像を入力すると、<code>{ name, company, title, email, phone, address, website }</code> の連絡先データを JSON で抽出する。</p>

  <h2>📚 API ざっくり紹介</h2>
  <p>Prompt API はマルチモーダル入力に対応しており、<code>expectedInputs</code> で画像入力を宣言することで、<code>prompt()</code> に画像 Blob を渡せます。</p>

  <h2>📋 使う JSON Schema</h2>
  <p><code>lib/schema.js</code> の <code>BUSINESS_CARD_SCHEMA</code> を使います。</p>

  <div class="step">
    <h3>🌱 STEP 1: マルチモーダルセッションを作る（4 分）</h3>
    <pre><code>// TODO 1: 画像入力対応のセッション作成
const session = await LanguageModel.create({
  expectedInputs: [{ type: 'image' }],
});</code></pre>
    <p><strong>ポイント:</strong> <code>expectedInputs</code> を宣言しないと画像を渡してもエラーになります。</p>
  </div>

  <div class="step">
    <h3>🌿 STEP 2: 画像 + 指示を送る（3 分）</h3>
    <pre><code>// TODO 2: 画像 Blob と指示テキストを prompt に渡す
const output = await session.prompt([{
  role: 'user',
  content: [
    { type: 'image', value: currentImageBlob },
    { type: 'text', value: 'この名刺から連絡先情報を JSON で抽出してください。' },
  ],
}]);</code></pre>
    <p><strong>ポイント:</strong> content 配列に image と text を混ぜて渡します。順序は image → text が推奨。</p>
  </div>

  <div class="step">
    <h3>🌳 STEP 3: Schema で強制 + 整形表示（3 分）</h3>
    <pre><code>// prompt に responseConstraint を追加
const output = await session.prompt([{ ... }], {
  responseConstraint: BUSINESS_CARD_SCHEMA,
});

// TODO 3: JSON.parse して表示
renderOutput('chapter-5', JSON.parse(output));</code></pre>
  </div>

  <h2>🎨 Extend this!</h2>
  <ul>
    <li>レシート OCR に切替（金額・品目を抽出、Schema を差し替えるだけ）</li>
    <li>手書きメモの文字起こし</li>
    <li>抽出結果をカレンダー / 連絡先アプリと連携（拡張機能化）</li>
  </ul>

  <div class="checkpoint">
    <strong>✅ Checkpoint</strong>
    <ol>
      <li>サンプル画像で <code>{ name, company, ... }</code> が返る</li>
      <li>自分の名刺（もしくは別の名刺画像）でも試して結果が変わる</li>
      <li>JSON.parse エラーが出ない（常に有効な JSON）</li>
    </ol>
  </div>
</article>
```

- [ ] **Step 2: 検証 & Commit**

```bash
git add docs-site/index.html
git commit -m "docs(ch-5): add Prompt API image chapter documentation"
```

---

## Task 20: Chapter 6 のドキュメント（拡張タイム＆Q&A）

**Files:**
- Modify: `docs-site/index.html`（`#ch-6` を埋める）

- [ ] **Step 1: `#ch-6` の中身を書く**

Replace `<article id="ch-6" data-title="🎨 拡張タイム＆Q&A"></article>` with:

```html
<article id="ch-6" data-title="🎨 拡張タイム＆Q&A">
  <h1>🎨 Chapter 6: 拡張タイム＆Q&A</h1>

  <div class="meta-card">
    <strong>所要時間:</strong> 5 分 / <strong>目的:</strong> 自分のアイデアを乗せてみる
  </div>

  <h2>🌱 章ごとの拡張アイデア</h2>
  <ul>
    <li>🔤 <strong>Language Detector</strong>: リアルタイム判定、絵文字フラグ表示、Detector 結果を Translator に自動投入</li>
    <li>🌐 <strong>Translator</strong>: 逆翻訳品質チェック、音声合成、複数言語同時出力</li>
    <li>📝 <strong>Summarizer</strong>: URL 記事の要約、複数記事の比較要約、多言語要約</li>
    <li>💬 <strong>Prompt API テキスト</strong>: マルチターン会話、タグクラウド、複数レビューまとめ</li>
    <li>📷 <strong>Prompt API 画像</strong>: レシート版、手書きメモ版、画像 + テキスト混在資料の抽出</li>
  </ul>

  <h2>🚀 API 連携アイデア</h2>
  <p>順序依存にはしないと決めていますが、章同士を連携すると強力なアプリになります：</p>
  <ol>
    <li><strong>多言語ブラウザ内リーダー</strong>: Detector → Translator → Summarizer → Prompt でフォローアップ Q&A</li>
    <li><strong>多言語カスタマーサポート下書き</strong>: Detector → Translator → Summarizer → Prompt で返信ドラフト → Translator で戻す</li>
    <li><strong>スマホカメラで名刺 → 挨拶メール自動生成</strong>: Ch5 の抽出結果を Prompt に渡してテンプレメール生成 → Translator で英訳</li>
  </ol>

  <h2>🎁 持ち帰り課題</h2>
  <p>会場では時間が限られるので、以下は自宅で挑戦してみてください：</p>
  <ul>
    <li>Chrome Extension 化（Content Script でページ内テキストを扱う）</li>
    <li>Chapter 4 と 5 を組み合わせた「画像 + テキスト混在資料」の解析</li>
    <li>自分の業務で使えるツールとしてリファクタ</li>
  </ul>

  <h2>📚 さらに学ぶ</h2>
  <ul>
    <li><a href="https://developer.chrome.com/docs/ai/built-in" target="_blank">Chrome Built-in AI 公式ドキュメント</a></li>
    <li><a href="https://developer.chrome.com/docs/ai/prompt-api" target="_blank">Prompt API 詳細</a></li>
    <li><a href="https://io.google/2025" target="_blank">Google I/O のセッション動画（Web AI 関連）</a></li>
  </ul>

  <h2>🎤 質問タイム</h2>
  <p>疑問点は会場スタッフか、Slack / Discord チャンネル（会場でご案内）まで。</p>
</article>
```

- [ ] **Step 2: 検証 & Commit**

```bash
git add docs-site/index.html
git commit -m "docs(ch-6): add extension time and Q&A chapter"
```

---

## Task 21: メンター用チートシート

**Files:**
- Create: `event-materials/mentor-cheatsheet.md`

**Interfaces:**
- Produces: 会場スタッフが参照する A4 片面相当の質問対応マニュアル

- [ ] **Step 1: `event-materials/mentor-cheatsheet.md` を作成**

```markdown
# メンター向けチートシート — Chrome Built-in AI ミニラボ

**用途**: 会場スタッフが参加者の質問に即答するための参照資料。参加者に渡さないでください。

## 🚦 参加者が最初に詰まりやすいポイント TOP 5

1. **`LanguageDetector is not defined`**
   → Chrome フラグが有効になっていない。README の「事前準備 2」を確認させる。

2. **バッジが「⬇ downloadable」のまま**
   → モデル未 DL。バッジをクリックさせるか、Ch2 の Translator の初回実行で DL が始まる。

3. **`file://` で開いていて CORS エラー**
   → `python3 -m http.server 8000` を教える。もしくは `--allow-file-access-from-files` フラグ付き Chrome を起動。

4. **`prompt()` の戻り値が JSON じゃない**
   → `responseConstraint` を渡し忘れている。Ch4/5 の STEP 2 を再確認。

5. **名刺 OCR で結果が不正確**
   → まずサンプル画像で動くか確認。ユーザーの画像は解像度が低いか斜めの可能性。

## 📌 章別・詰まりやすいコード箇所

### Chapter 1 (Language Detector)
- `detector.detect(text)` を `await` し忘れ → 「Promise が表示された」
- `results.slice(0, 3)` のかわりに `results[0]` を渡してしまう → 単一結果になる

### Chapter 2 (Translator)
- `monitor` を関数として渡すべきところをオブジェクトで渡している
- `sourceLanguage === targetLanguage` のガードを外していて謎の挙動

### Chapter 3 (Summarizer)
- `summarizeStreaming` の戻り値を `await` してしまい `for await` にたどり着かない
- 入力テキストが短すぎて意味のある要約にならない → 200 文字以上を推奨

### Chapter 4 (Prompt API テキスト)
- `SENTIMENT_SCHEMA` を import し忘れ
- `JSON.parse(output)` を忘れて文字列のまま表示

### Chapter 5 (Prompt API 画像)
- `expectedInputs: [{ type: 'image' }]` を渡し忘れ → 画像入力エラー
- `currentImageBlob` が null（file input の change 検知失敗）
- Prompt の content 配列に image が入っていない、または type が誤り

## 🔧 会場での即応コマンド

```bash
# 参加者の環境確認（Console で実行）
console.log({
  ld: typeof LanguageDetector,
  tr: typeof Translator,
  sm: typeof Summarizer,
  lm: typeof LanguageModel,
});
// 全て 'function' なら OK
```

```bash
# サンプル画像の場所
starter/assets/sample-card.png
```

## 🆘 どうしても解決しない場合

1. 予備 PC を貸与
2. サンプル画像で動作確認だけ済ませて他章に誘導
3. 「持ち帰り課題」として README を渡す

## 📞 エスカレーション

- 会場運営 Slack: #io-extended-tokyo-2026-staff
- 講師: 洋一郎さん（当日連絡先は運営 Slack で共有）
```

- [ ] **Step 2: Commit**

```bash
git add event-materials/mentor-cheatsheet.md
git commit -m "docs(materials): add mentor cheatsheet"
```

---

## Task 22: 事前アナウンス配布テンプレート

**Files:**
- Create: `event-materials/pre-event-announcement.md`

- [ ] **Step 1: `event-materials/pre-event-announcement.md` を作成**

```markdown
# 【重要】Chrome Built-in AI ミニラボ 事前準備のお願い

Google I/O Extended Tokyo 2026 の会場ハンズオン「Chrome Built-in AI 60分ミニラボ」にご参加希望の皆様へ。

**⚠️ 当日会場でセットアップから始めると時間内に完走できません。**
以下の事前準備を必ず**参加日前日まで**にお済ませください。

---

## ✅ 準備チェックリスト

### 1. Chrome Canary または Chrome Dev をインストール

- [Chrome Canary（推奨）](https://www.google.com/chrome/canary/)
- [Chrome Dev](https://www.google.com/chrome/dev/)

**❌ 安定版 Chrome では動作しません。**

### 2. 以下のフラグをすべて「Enabled」に

Chrome を起動し、URL バーに以下を貼り付けて設定：

| flag | 設定 |
|------|-----|
| `chrome://flags/#optimization-guide-on-device-model` | Enabled BypassPerfRequirement |
| `chrome://flags/#language-detection-api` | Enabled |
| `chrome://flags/#translation-api` | Enabled |
| `chrome://flags/#summarization-api-for-gemini-nano` | Enabled |
| `chrome://flags/#prompt-api-for-gemini-nano` | Enabled |
| `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` | Enabled |

設定後、**Chrome を再起動**。

### 3. Gemini Nano モデルをダウンロード

`about://on-device-internals` を開き、Model status が「Ready」になっているか確認。

なっていない場合：
- `about://components` を開く
- 「Optimization Guide On Device Model」を探し、「Check for update」をクリック
- ダウンロード完了まで待つ（回線状況次第で 5〜30 分）

### 4. スペック確認

- ストレージ空き容量: **22GB 以上**（モデルサイズが大きいため）
- メモリ: **8GB 以上**推奨
- OS: Windows 10+ / macOS 13+ / Linux

### 5. 動作確認スニペット

Chrome の DevTools > Console で以下を実行し、すべて `available` が返ることを確認してください：

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

**期待される出力例:**
```
{ ld: 'available', tr: 'available', sm: 'available', lm: 'available', lmImg: 'available' }
```

`downloadable` が返る場合は、そのまま各 API を `create()` すると DL が始まります。当日までに `available` にしておいてください。

---

## 🎒 当日の持ち物

- ノート PC（フル充電＆電源アダプタ）
- 動作確認済みの Chrome Canary / Dev
- 好奇心 ✨

---

## 🔗 当日の URL

- スターター配布: **[QR コード / URL を当日会場で掲示]**
- Codelab サイト: **[QR コード / URL を当日会場で掲示]**

---

## 🚨 うまく準備できない場合

会場に予備 PC を数台用意していますが、数に限りがあります。可能な限り事前準備をお願いします。

質問は運営 Slack / Discord までお気軽に：**[チャンネル URL]**

皆様のご参加をお待ちしております！🎉
```

- [ ] **Step 2: Commit**

```bash
git add event-materials/pre-event-announcement.md
git commit -m "docs(materials): add pre-event announcement template"
```

---

## Task 23: 会場前日/当日チェックリスト

**Files:**
- Create: `event-materials/venue-checklist.md`

- [ ] **Step 1: `event-materials/venue-checklist.md` を作成**

```markdown
# 会場運営チェックリスト — Chrome Built-in AI ミニラボ

## 🕐 前日夜（〜24 時間前）

### 環境検証
- [ ] Chrome Canary の最新版を新規インストールし、全 5 API が `available` になることを確認
- [ ] スターター URL（GitHub Pages / Firebase Hosting）が公開されている
- [ ] Codelab サイト URL が公開されている
- [ ] スターター全 5 章が Solutions を組み込んだ状態で動作する
- [ ] サンプル画像で名刺 OCR が期待通り動く

### 資料印刷
- [ ] メンター用チートシート × スタッフ人数 + 予備 2 部
- [ ] スターター URL / Codelab URL の QR コード ポスター

### 予備機材
- [ ] 予備ノート PC 1〜2 台（環境設定済み）
- [ ] 電源タップ、電源ケーブル
- [ ] ネットワーク遅延計測ツール（Wi-Fi 品質チェック用）

## 🌅 当日朝（開始 3 時間前）

- [ ] 会場 Wi-Fi 接続を確認、スターター URL がロードできる
- [ ] `about://on-device-internals` で Chrome Canary のモデル状態確認
- [ ] Chapter 1〜5 を予備 PC で動作確認（Wi-Fi 経由）
- [ ] メンターへチートシートを配布し、当日質問対応の役割分担を確認

## 🎬 セッション開始 30 分前

- [ ] 会場入口にスターター URL の QR コード掲示
- [ ] スタッフ全員が Slack / Discord チャンネルに join
- [ ] 講師（洋一郎さん）のマイク・映像確認

## 🎉 セッション中

### イントロ（5 分）
- [ ] 参加者に Codelab URL を案内
- [ ] Chapter 0 を全員で通す（環境チェックがグリーンになるまで）

### モニタリング（〜55 分）
- [ ] 5〜10 分ごとに各卓を巡回、進捗と困りごとを確認
- [ ] Slack で質問を集約、頻出質問はホワイトボード / スクリーンに書き出し
- [ ] 予備 PC の必要性を早期に判断

### クロージング（〜60 分）
- [ ] 1〜2 人に拡張アイデアをシェアしてもらう
- [ ] アンケート QR コードを案内
- [ ] 持ち帰り課題を README で確認するよう促す

## 🧹 セッション後

- [ ] 使用した予備 PC の初期化 / 撤収
- [ ] アンケート回答数の確認
- [ ] スタッフ振り返り（30 分、Slack か対面で）
- [ ] 頻出質問を集計 → 次回の Codelab 改善に反映
```

- [ ] **Step 2: Commit**

```bash
git add event-materials/venue-checklist.md
git commit -m "docs(materials): add venue-day checklist"
```

---

## Task 24: 完全ドライラン（60 分想定の通し検証）

**Files:**
- Modify（必要に応じて）: 問題があった箇所のコード / ドキュメント
- Optional: `event-materials/dry-run-notes.md`（ドライランで気づいた点をメモ）

**Interfaces:**
- Produces: 会場前日までに全体を完走した実績、修正すべき箇所の洗い出し

- [ ] **Step 1: 新規環境をシミュレート**

新しい Chrome プロファイル（あるいは別 PC）を用意し、事前アナウンスの手順通りに準備。

- [ ] **Step 2: 参加者になったつもりで Chapter 0 → 各章を実施**

`event-materials/dry-run-notes.md` に以下を記録しながら通す：

```markdown
# ドライラン記録

日時: YYYY-MM-DD HH:MM
実施者: 
Chrome バージョン: 

## タイム計測
- Ch0: __分
- Ch1: __分
- Ch2: __分
- Ch3: __分
- Ch4: __分
- Ch5: __分
- Ch6: __分
- 合計: __分

## 詰まった箇所
- 
- 

## ドキュメント修正が必要な箇所
- 
- 

## コード修正が必要な箇所
- 
- 
```

- [ ] **Step 3: 気づいたバグ・不明瞭な説明を修正**

一つずつ以下のサイクルを回す：
1. 不明瞭な説明 / バグを特定
2. 該当ファイルを修正
3. 該当箇所を再検証
4. 個別 Commit（`fix(ch-N): ...` メッセージ）

- [ ] **Step 4: 2 回目のドライラン（他者に依頼）**

想定参加者に近い人（web 開発経験あり、Chrome Built-in AI 未経験）に 60 分通してもらい、記録を追記。

- [ ] **Step 5: 最終修正**

2 回目の記録を元にさらに修正。修正後は必ず該当箇所を再度動作確認。

- [ ] **Step 6: ドライラン記録を Commit**

```bash
git add event-materials/dry-run-notes.md
git commit -m "docs(materials): capture dry-run findings and fixes"
```

---

## Self-Review

### Spec Coverage

以下の設計書項目に対して、対応する Task があるかチェック：

| 設計書項目 | Task |
|-----------|------|
| §1 目的・ゴール | 全 Task |
| §2 対象 API と題材 | T6-T11 |
| §3.1 章立て | T5 (Ch0), T6 (Ch1), T7 (Ch2), T8 (Ch3), T10 (Ch4), T11 (Ch5), T20 (Ch6) |
| §3.2 順不同構成 | T4 (タブ切替), T5 (Ch0 のみ必修 UI) |
| §3.3 推奨ルート | T12 (README) |
| §4.1 ファイルレイアウト | T1 (骨格), T9 (schema), T11 (assets) |
| §4.2 UI 構造 | T2, T3 |
| §4.3 JS 骨格 | T4 |
| §4.4 3-STEP 学習 | T6-T11 各章内 |
| §5 章詳細 | T5, T6, T7, T8, T10, T11 |
| §6 ドキュメント形式 | T13-T20 |
| §7 エラー対策・進捗 | T13 (完了バッジ), 各章 solution-peek, T21 (チートシート) |
| §8.1 事前アナウンス | T22 |
| §8.2 会場スタッフ準備 | T21, T23 |
| §8.3 リハーサル | T24 |
| §9 リスク対策 | T21, T22, T23 |
| §10 制作スケジュール | Task の並び順に対応 |
| §11 用語 | T14 (Ch0 ドキュメント), T15-T19 |

**カバー漏れ**: なし。

### Placeholder Scan

- 「TBD」「TODO(plan-level)」なし
- 「後で決める」なし
- 例示コードは全て具体的
- 「Similar to Task N」なし、各 Task で完結
- サンプル画像は Task 11 で用意方針を明示（自作 or CC 素材）

### Type Consistency

- `checkAvailability()` の戻り値キー: `languageDetector`, `translator`, `summarizer`, `languageModelText`, `languageModelImage` — Task 5, 3 章の HTML で参照される名前と一致
- `renderOutput(tabId, textOrObj)` — 全章で同じシグネチャで使用
- `SENTIMENT_SCHEMA`, `BUSINESS_CARD_SCHEMA` — Task 9 で定義、T10, T11 で import 使用（名前一致）
- `currentImageBlob` — T11 内で定義・参照、他章では使用しない
- 全 Task の Files パスは、Global Constraints のディレクトリ構造と整合

**問題なし**。

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-04-chrome-builtin-ai-codelab.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — 各 Task をフレッシュな subagent にディスパッチし、Task 間でレビュー。高速な反復。ただし本プロジェクトは UI 検証が多くブラウザ操作を含むため、subagent に手作業指示が多くなる可能性あり。

**2. Inline Execution** — 現セッションで executing-plans を使い、Task ごとにチェックポイント方式で実行。UI 検証を対話的に確認しやすい。

**Which approach?**
