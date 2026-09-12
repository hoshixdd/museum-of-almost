create table if not exists memories (
  id serial primary key,
  title text not null,
  content text not null,
  category text not null,
  emotion text not null,
  year int,
  location text,
  anonymous_id text not null default 'anonymous',
  created_at timestamptz not null default now(),
  views int not null default 0,
  needed_count int not null default 0,
  understand_count int not null default 0,
  reminded_count int not null default 0,
  report_count int not null default 0,
  hidden boolean not null default false,
  is_seed boolean not null default false
);

create table if not exists almost_lives (
  id serial primary key,
  title text not null,
  story text not null,
  category text not null,
  age int,
  location text,
  career text,
  relationship text,
  dream text,
  anonymous_id text not null default 'anonymous',
  created_at timestamptz not null default now(),
  views int not null default 0,
  needed_count int not null default 0,
  understand_count int not null default 0,
  reminded_count int not null default 0,
  report_count int not null default 0,
  hidden boolean not null default false,
  is_seed boolean not null default false
);

create table if not exists capsules (
  id serial primary key,
  title text not null,
  content text not null,
  unlock_at timestamptz not null,
  privacy text not null default 'public',
  recipient text not null,
  access_code text,
  anonymous_id text not null default 'anonymous',
  created_at timestamptz not null default now(),
  opened boolean not null default false,
  report_count int not null default 0,
  hidden boolean not null default false,
  is_seed boolean not null default false
);

create table if not exists voices (
  id serial primary key,
  title text not null,
  transcript text not null,
  category text not null,
  duration_sec int not null default 0,
  anonymous_id text not null default 'anonymous',
  created_at timestamptz not null default now(),
  listens int not null default 0,
  needed_count int not null default 0,
  report_count int not null default 0,
  hidden boolean not null default false,
  is_seed boolean not null default false
);

create table if not exists books (
  id serial primary key,
  title text not null,
  chapter_before text not null default '',
  chapter_moment text not null default '',
  chapter_change text not null default '',
  chapter_after text not null default '',
  edit_code text not null,
  anonymous_id text not null default 'anonymous',
  created_at timestamptz not null default now(),
  views int not null default 0,
  report_count int not null default 0,
  hidden boolean not null default false,
  is_seed boolean not null default false
);

create table if not exists wall_posts (
  id serial primary key,
  content text not null,
  emotion text,
  anonymous_id text not null default 'anonymous',
  created_at timestamptz not null default now(),
  understand_count int not null default 0,
  report_count int not null default 0,
  hidden boolean not null default false,
  is_seed boolean not null default false
);

create table if not exists replies (
  id serial primary key,
  wall_id int not null references wall_posts(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  hidden boolean not null default false
);

create table if not exists reports (
  id serial primary key,
  content_type text not null,
  content_id int not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists exit_notes (
  id serial primary key,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists memories_hidden_idx on memories (hidden, created_at desc);
create index if not exists memories_emotion_idx on memories (emotion);
create index if not exists memories_category_idx on memories (category);
create index if not exists almost_lives_hidden_idx on almost_lives (hidden, created_at desc);
create index if not exists capsules_unlock_idx on capsules (unlock_at);
create index if not exists voices_hidden_idx on voices (hidden, created_at desc);
create index if not exists books_hidden_idx on books (hidden, created_at desc);
create index if not exists wall_hidden_idx on wall_posts (hidden, created_at desc);
