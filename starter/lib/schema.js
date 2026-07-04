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
