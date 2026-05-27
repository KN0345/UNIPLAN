-- UniPlan Cloudflare Free Deploy schema for Neon PostgreSQL.
-- Public course catalog is served as static JSON in frontend/public/data/.
-- Neon stores public writable data: feedback, reviews, tag votes.

create table if not exists feedback_items (
  id text primary key,
  type text not null default '功能問題',
  title text not null default '',
  detail text not null default '',
  status text not null default '待處理',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists course_reviews (
  id text primary key,
  course_key text not null,
  user_id text not null default 'anonymous',
  rating integer not null default 5,
  content text not null default '',
  tags text not null default '',
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_course_reviews_course_key on course_reviews(course_key);

create table if not exists course_tag_votes (
  course_key text not null,
  tag text not null,
  voter_key text not null,
  created_at timestamptz not null default now(),
  primary key(course_key, tag, voter_key)
);

create index if not exists idx_course_tag_votes_course_key on course_tag_votes(course_key);
