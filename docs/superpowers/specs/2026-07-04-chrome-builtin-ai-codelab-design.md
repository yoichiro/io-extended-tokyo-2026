# Chrome Built-in AI 60分ミニラボ 設計書

- **作成日**: 2026-07-04
- **対象イベント**: Google I/O Extended Tokyo 2026（来週開催）
- **想定所要時間**: 60分
- **想定対象者**: HTML/CSS/JavaScript の基礎（`async/await`、DOM操作、`fetch` 程度）が分かる開発者
- **提供形態**: 会場での有志ハンズオン（希望者に対して現地で実施）

---

## 1. 目的とゴール

### 1.1 コードラボの目的

Google I/O Extended Tokyo 2026 の来場者のうち希望者に対し、Chrome Built-in AI（オンデバイス AI）の 4 つの主要 API を **60 分で実際に触れる** ハンズオンを提供する。単なるデモ視聴ではなく、参加者自身がコードを書き、動かし、拡張の入口までを体験することを目指す。

### 1.2 学習ゴール

参加者が本コードラボを終えた時点で、以下の状態になっていることを目標とする。

1. Chrome Built-in AI の 4 API（Language Detector / Translator / Summarizer / Prompt API）を **自分の手で呼び出せる** ようになる。
2. `availability` → `create()` → 実行メソッド、という **API 共通パターン** を理解する。
3. `downloadprogress` イベント、**structured output (JSON Schema)**、**マルチモーダル入力** の使い方を体験する。
4. 会場を出た後も、**自分のアイデアを乗せて拡張できる土台コード** を持ち帰る。

### 1.3 成功指標

- 参加者アンケートにおいて「持ち帰って自分のアイデアで拡張したい」と回答した割合が **70% 以上**。
- 各章の完了率分布を計測し、順不同構成でも 3 章以上に触れた参加者が過半数を占める。
- 会場で発生した質問を章単位で分類し、次回コンテンツ改善の材料とする。

---

## 2. 対象 API と題材

コードラボで扱う 5 つのミニ題材（Prompt API のみ 2 題材）を以下に定義する。

| # | API | 題材 | 難易度 | 所要時間 |
|---|-----|-----|--------|----------|
| 1 | Language Detector | 入力文の言語判定 & トップ3候補の信頼度バー表示 | ⭐️ | 7分 |
| 2 | Translator | source/target を UI で選ぶ多言語翻訳、モデルDL進捗表示 | ⭐️⭐️ | 10分 |
| 3 | Summarizer | type/length オプション付き要約、ストリーミング出力 | ⭐️⭐️ | 10分 |
| 4 | Prompt API（テキスト） | 感情分析＋タグ抽出（structured output で JSON 強制） | ⭐️⭐️⭐️ | 13分 |
| 5 | Prompt API（画像） | 名刺スキャン → 連絡先データを JSON で抽出（multimodal） | ⭐️⭐️⭐️ | 10分 |

### 2.1 題材選定の根拠

- **順序依存を排除する** ため、各題材は他章の結果を前提としない独立構成とする。
- Prompt API を 2 題材に分割したのは、**structured output** の使い方をテキスト・画像の両文脈で見せることで理解を強化するため。
- 名刺スキャンは **「マルチモーダル入力 × structured output」** の合わせ技を最も自然に体験できるユースケースとして選定。
- 感情分析＋タグ抽出は **「LLM を関数として使う」** 感覚を、Summarizer との役割差別化を保ちながら伝えるために選定。

---

## 3. 全体構成

### 3.1 章立て

```
Chapter 0: 導入・環境チェック・共通パターン (必修・8分)
────────────── 以下、順不同で自由に選択 ──────────────
Chapter 1: 🔤 Language Detector (7分)
Chapter 2: 🌐 Translator (10分)
Chapter 3: 📝 Summarizer (10分)
Chapter 4: 💬 Prompt API テキスト (13分)
Chapter 5: 📷 Prompt API 画像 (10分)
──────────────────────────────────────────────
Chapter 6: 拡張タイム & Q&A (5分)
```

- **Chapter 0 のみ必修** とし、環境確認と全 API 共通の 3 ステップパターン（availability → create → 実行）をここで一度に説明する。
- **Chapter 1〜5 は完全独立** とし、参加者が興味・難易度・残り時間に応じて自由に選べるようにする。
- 60 分 = Ch0（8分）+ Ch6（5分）+ **可変 47 分**（参加者が選択して深める時間）。
- Chapter 1〜5 の合計は 50 分想定のため、**時間内に全章クリアするのは意図的にタイト** に設計している。参加者は「自分が深めたい章を選んで完了させる」ことが基本モードとなり、全章制覇を狙う人にはやや駆け足のペースとなる。

### 3.2 順不同構成の設計原則

1. 各章の冒頭に **メタ情報カード**（所要時間 / 難易度 / 使う共通ステップ / その章のご褒美）を配置。
2. 全章が同じ **3-STEP 構造**（最小動作 → オプション → 応用）で予測可能な学習リズムを提供。
3. Chapter 2 で以前想定していた「Chapter 1 の結果を自動投入」は削除し、Translator 章内で完結する形に修正。
4. 章間のつながり（例：Detector → Translator の連携）は **Chapter 6 の拡張ヒント** として提示するにとどめる。

### 3.3 参加者向け推奨ルート（README に掲載）

順不同を強制せず、迷った参加者向けにゆるいガイドを README に載せる。

- 🚀 最速で動くものを見たい → Chapter 1
- 🎨 モデル DL の魔法を体感したい → Chapter 2
- 🎛️ オプションで挙動を操りたい → Chapter 3
- 🧠 AI を関数として使う体験 → Chapter 4
- 📸 画像も AI に食わせたい → Chapter 5

---

## 4. スターターコード構成

### 4.1 ファイルレイアウト

```
chrome-builtin-ai-minilab/
├── index.html              # 完成済み（タブUI・入出力エリア・スタイリング込み）
├── styles.css              # 完成済み（軽量、モダンな見た目）
├── main.js                 # ハンドラ関数の骨格＋TODOコメント
├── lib/
│   └── schema.js           # structured output 用の JSON Schema 定義
├── assets/
│   └── sample-card.png     # 名刺スキャンのサンプル画像（オフライン用）
├── README.md               # 環境準備手順・トラブルシューティング
└── LICENSE                 # Apache-2.0
```

### 4.2 UI 構造

```
<header>
  Chrome Built-in AI ミニラボ
  [🟢 環境チェック結果バッジ]
</header>

<nav class="tabs">
  [🔤 言語判定] [🌐 翻訳] [📝 要約] [💬 感情分析] [📷 名刺OCR]
</nav>

<main>
  各 section = 入力エリア + 実行ボタン + 出力エリア + オプションUI
</main>
```

### 4.3 JS 骨格の設計

`main.js` には以下を実装済みとし、参加者は API 呼び出しコードのみを書き足す。

- **共通ヘルパ**（DOM 操作、ステータス表示、進捗バー、JSON 整形）
- **環境チェック関数**（各 API の `availability()` を並列実行）
- **各章のハンドラ関数の骨格**（引数の取り出し・出力先の DOM は用意済み、`// TODO` コメントで挿入位置を明示）

`// TODO` 位置と、下部に `<details>` タグで隠した **完成コードの見本** を同梱する。詰まったときの最終手段としてチラ見できる。

### 4.4 段階制（Progressive）学習パターン

各章は「まず動かす → オプションを足す → イベント/応用を扱う」の 3 段構成。

| 段 | 内容 | 時間目安（各章） |
|----|------|-----------------|
| 🌱 STEP 1: 最小動作 | availability → create → 実行 → 出力表示 | 3〜5分 |
| 🌿 STEP 2: オプション付与 | 型/長さ切替、進捗イベント、responseConstraint など | 2〜3分 |
| 🌳 STEP 3: 応用 | ストリーミング、systemPrompt、マルチモーダル拡張 | 2〜3分 |

**STEP 1 まで到達できれば「動いた」という成功体験は確保** されるよう、この構造を全章で徹底する。

---

## 5. 章ごとの詳細

### Chapter 0: 導入・環境チェック・共通パターン（必修 / 8分）

- Chrome Built-in AI の全体像・オンデバイス実行の意味（2分）
- 5 つの API をカード形式で概観（1分）
- **共通の 3 ステップパターン** を明示（3分）
  ```
  Step ①  Api.availability()   ← 使えるか判定（4状態を理解）
  Step ②  Api.create({...})    ← セッション/インスタンス作成
  Step ③  実行メソッド呼び出し ← detect / translate / summarize / prompt
  ```
- 環境チェックバッジ（🟢×5）の確認（2分）
- `downloadable` 状態の API に「⬇ 今すぐ DL 開始」ボタンを提供

### Chapter 1: 🔤 Language Detector（7分）

- **題材**: 入力文の言語判定 & トップ 3 候補を信頼度バー付きで表示
- **STEP 1 (3分)**: `LanguageDetector.availability()` → `create()` → `detect(text)` の最短実装
- **STEP 2 (2分)**: 結果を信頼度でソートし、トップ 3 をバッジ表示
- **STEP 3 (2分)**: `inputLanguages` オプションで候補を絞り込む
- **章のご褒美**: `availability` の 4 状態を最も分かりやすく体験

### Chapter 2: 🌐 Translator（10分）

- **題材**: source/target 言語を UI で選び翻訳、モデル DL 進捗を可視化
- **STEP 1 (4分)**: `Translator.create({ sourceLanguage: 'en', targetLanguage: 'ja' })` → `translate(text)`
- **STEP 2 (3分)**: `downloadprogress` イベントを購読して進捗バーを更新（**章の目玉**）
- **STEP 3 (3分)**: UI の select と source/target を連動、複数言語ペアで試す
- **章のご褒美**: モデル DL 体験（オンデバイス AI の醍醐味）

### Chapter 3: 📝 Summarizer（10分）

- **題材**: 長文を要約、type/length を UI で切替、ストリーミング体験
- **STEP 1 (4分)**: `Summarizer.create()` → `summarize(text)` の最短実装
- **STEP 2 (3分)**: `type` (`tl;dr` / `teaser` / `key-points` / `headline`) と `length` (`short`/`medium`/`long`) を UI と連動
- **STEP 3 (3分)**: `summarizeStreaming()` で逐次出力
- **章のご褒美**: ストリーミングの体感差（Prompt API でも活きる）

### Chapter 4: 💬 Prompt API テキスト — 感情分析＋タグ抽出（13分）

- **題材**: レビュー文 → `{ sentiment, score, tags[] }` を JSON で返す
- **STEP 1 (4分)**: `LanguageModel.create({ initialPrompts })` → `prompt(text)` で自由応答
- **STEP 2 (5分)**: `responseConstraint` に JSON Schema を渡して JSON 強制（**章の目玉**）
- **STEP 3 (4分)**: `systemPrompt` と `temperature` / `topK` の効き方を体感
- **章のご褒美**: 「LLM を関数として使う」感覚

### Chapter 5: 📷 Prompt API 画像 — 名刺 OCR（10分）

- **題材**: 名刺画像 → `{ name, company, title, email, phone[] }` を JSON で抽出
- **STEP 1 (4分)**: `LanguageModel.create({ expectedInputs: [{ type: 'image' }] })` でマルチモーダルセッション作成
- **STEP 2 (3分)**: 画像 Blob + テキスト指示を `session.prompt(...)` に渡して送信
- **STEP 3 (3分)**: `responseConstraint` で連絡先スキーマを強制、抽出結果を整形表示
- **章のご褒美**: マルチモーダル × structured output の合わせ技

### Chapter 6: 拡張タイム & Q&A（5分）

- 各タブに「**Extend this!**」ヒントを配置（他章に依存しない拡張案を 1〜3 個ずつ）
- オマケの発展課題として「章と章をつなげる」アイデアも提示（例：Detector → Translator の自動連携）
- 会場で 1〜2 人にシェアしてもらう

---

## 6. ドキュメント配信形式

### 6.1 配信形式

**Google Codelab スタイルの静的サイト** を採用する。

- 参加者は URL 1 つを開くだけ（配布ミス最小化）
- 章タブ・進捗チェック・コピー可能なコードブロックがネイティブサポート
- io-extended-tokyo-2026 の他コンテンツとトーンを揃える
- ホスティングは GitHub Pages / Firebase Hosting を想定

### 6.2 各章の紙面テンプレート

すべての章を同じテンプレートに揃え、認知負荷を最小化する。

```
📇 メタ情報カード
🎯 この章のゴール
📚 API ざっくり紹介
🌱 STEP 1: 最小動作
🌿 STEP 2: オプション付与
🌳 STEP 3: 応用
🎨 Extend this!
✅ Checkpoint
```

各 STEP は「何をする？／どこに書く？／完成コードスニペット／期待される画面（スクショ）／詰まったら？」で統一。

### 6.3 コードスニペットの見せ方

- 完成形コードを提示（穴埋め型ではなく "書き足し型"）
- 挿入位置を `// TODO N: ...` コメントで明示（章ごとに TODO 1 / TODO 2 / TODO 3 と番号付け）
- 全コードブロックにコピーボタン
- 重要な行（例：`responseConstraint` の指定行）にハイライト

### 6.4 環境チェック UI

Chapter 0 で通る環境ゲート。

```
🔤 Language Detector    ✅ available
🌐 Translator (en→ja)   ✅ available
📝 Summarizer           ✅ available
💬 Prompt API (text)    ✅ available
📷 Prompt API (image)   ✅ available
```

`downloadable` 状態の API には「⬇ 今すぐ DL 開始」ボタンを提供し、章に入る前にダウンロードを開始できるようにする。

---

## 7. エラー対策と進捗管理

### 7.1 エラー対策方針

「詰まっても復帰できる」ためのセーフティネットを複数箇所に配置する。

1. 各章末に「うまく動かないとき」折りたたみボックス（よくある原因トップ 3）
2. `main.js` の TODO の下に `<details>` タグで隠した完成コードを同梱（最終手段）
3. Chapter 0 に「AI 未対応環境で起きる典型エラー」を先出し
4. **メンター向けチートシート**（会場スタッフが参照する簡易マニュアル、章ごとの詰まりポイントと即答テンプレ）

### 7.2 進捗管理

- 各章タブに `✓` バッジを付与（`localStorage` に完了状態を保存）
- 完了バッジ 5 個で花火エフェクト（遊び心、必須ではない）

---

## 8. 事前準備と会場運営

### 8.1 参加希望者への事前アナウンス

イベント参加者に対し、以下を事前配信する。

1. **必須環境**: Chrome Canary / Dev（最新版）、有効化する chrome://flags 一覧、対応 OS・メモリ・ストレージ要件
2. **モデル事前ダウンロード手順**: 検証用スニペットを配布、`about://on-device-internals` での確認方法
3. **持ち物**: ノート PC、電源アダプタ、動作確認済みの Chrome
4. **当日会場 QR コード**でスターターサイトへ一発アクセス
5. **トラブル時の連絡先**（会場スタッフ Slack/Discord）

### 8.2 会場スタッフ準備

- メンター用チートシート（A4 片面、各章の詰まりポイントトップ 3 と即答テンプレ）
- 予備ノート PC 1〜2 台
- オフライン用サンプル画像フォルダ（名刺スキャン用、著作権クリア）
- 会場 Wi-Fi 容量の確認

### 8.3 リハーサル計画

イベント 1 週間前までに以下を実施する。

1. **セルフドライラン（1 回目）** — 洋一郎さん自身が新規環境で全章を通す。
2. **他者ドライラン（2〜3 人）** — 想定参加者に近い人に試してもらい、60 分で全章到達できるか、どこで詰まるかを検証。
3. **メンターオンボーディング** — スタッフに事前ラン＋チートシート説明。
4. **最終環境チェック**（前日夜〜当日朝）— スターターサイトの本番 URL 稼働確認、Chrome Canary のバージョン変更で API が壊れていないかを全 API 走査。

---

## 9. リスクと対策

| リスク | 影響 | 対策 |
|-------|-----|-----|
| Chrome 更新で API 仕様が変わる | 章全体が動かない | イベント前々日と当日朝に全 API 動作確認、代替スニペット準備 |
| モデル未 DL 参加者が来る | 章に入れない | 事前準備アナウンス強化＋会場で予備 PC 貸出＋DL 待機中に読み物パート用意 |
| Prompt API 画像が特定端末で不安定 | 名刺スキャン章が詰まる | サンプル画像同梱＋テキスト版 Chapter 4 に流れる代替ルートを README に明示 |
| 参加者のスキル差が大きい | 進捗にばらつき | 難易度⭐️表示＋順不同構成で「自分のペースで選ぶ」を設計に組込済み |
| モデル DL が会場で発生 | Wi-Fi 圧迫 | 事前 DL をアナウンス、会場での DL は各 API あたりの想定サイズを明示 |
| Language Detector の flag が別扱い | Chapter 1 が動かない | 事前準備アナウンスで flag 一覧を明示、環境ゲートで早期検知 |

---

## 10. 制作スケジュール（たたき台）

| タイミング | やること |
|-----------|---------|
| Day 1〜2 | スターター HTML/CSS/main.js 骨格＋Chapter 0 完成 |
| Day 3〜4 | Chapter 1〜3（Detector / Translator / Summarizer） |
| Day 5 | Chapter 4〜5（Prompt テキスト・画像） |
| Day 6 | ドキュメントサイト構築＋事前配信物準備 |
| Day 7（前日） | ドライラン＋最終環境チェック |
| 当日 | 🎉 |

順不同構成のおかげで章ごとに完成させて随時公開できるため、途中でも十分価値ある形にできる。

---

## 11. 用語

- **オンデバイス AI**: モデルをブラウザ内（Gemini Nano）で動かし、サーバー往復なしに推論する仕組み。
- **structured output**: `responseConstraint` に JSON Schema を渡し、出力を指定形式の JSON に強制する機能。
- **マルチモーダル入力**: テキスト以外（画像・音声）を LLM に入力できる機能。本コードラボでは画像入力を扱う。
- **availability の 4 状態**: `unavailable` / `downloadable` / `downloading` / `available`。API がその環境で使えるかを 4 段階で返す。

---

## 12. 参考

- [Chrome Built-in AI 公式ドキュメント](https://developer.chrome.com/docs/ai/built-in)
- [LanguageDetector API](https://developer.chrome.com/docs/ai/language-detection)
- [Translator API](https://developer.chrome.com/docs/ai/translator-api)
- [Summarizer API](https://developer.chrome.com/docs/ai/summarizer-api)
- [Prompt API (LanguageModel)](https://developer.chrome.com/docs/ai/prompt-api)
