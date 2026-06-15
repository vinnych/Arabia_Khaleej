-- SQL Schema for Arabia Khaleej Relational Storage
-- Supported by Cloudflare D1 (SQLite) and PostgreSQL (Neon)

CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    pubDate TEXT NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    tags TEXT, -- JSON array of tags (e.g., '["uae", "economy"]')
    author_id TEXT,
    author_name_en TEXT,
    author_name_ar TEXT,
    author_role_en TEXT,
    author_role_ar TEXT,
    content_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    wordCount INTEGER NOT NULL DEFAULT 0,
    qualityScore INTEGER NOT NULL DEFAULT 6
);

CREATE TABLE IF NOT EXISTS drafts (
    topic TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    word_count INTEGER,
    content TEXT,
    image_url TEXT,
    error TEXT,
    description TEXT,
    tags TEXT, -- JSON array of tags
    timestamp INTEGER NOT NULL,
    quality_score INTEGER NOT NULL DEFAULT 6
);

-- Indexing for high-performance slug queries and list sorting
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_pubdate ON articles(pubDate DESC);
CREATE INDEX IF NOT EXISTS idx_drafts_status ON drafts(status);
