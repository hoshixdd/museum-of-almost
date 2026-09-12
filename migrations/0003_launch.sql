alter table memories add column if not exists delete_code text;
alter table memories add column if not exists local_hour int;
alter table almost_lives add column if not exists delete_code text;
alter table voices add column if not exists delete_code text;
alter table wall_posts add column if not exists delete_code text;
alter table capsules add column if not exists delete_code text;

alter table exit_notes add column if not exists hidden boolean not null default false;
alter table exit_notes add column if not exists report_count int not null default 0;
alter table replies add column if not exists report_count int not null default 0;
alter table reports add column if not exists visitor_id text not null default 'anon';

create table if not exists visitor_reactions (
  visitor_id text not null,
  kind text not null,
  content_id int not null,
  reaction text not null,
  created_at timestamptz not null default now(),
  primary key (visitor_id, kind, content_id, reaction)
);

create table if not exists rate_events (
  id serial primary key,
  visitor_id text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_events_lookup on rate_events (visitor_id, action, created_at desc);

delete from reports a using reports b
where a.id > b.id
  and a.content_type = b.content_type
  and a.content_id = b.content_id
  and a.visitor_id = b.visitor_id;

create unique index if not exists reports_once_idx on reports (visitor_id, content_type, content_id);

create table if not exists museum_meta (
  key text primary key,
  value text not null
);

create table if not exists unplaced_cities (
  city text primary key,
  n int not null default 0
);
