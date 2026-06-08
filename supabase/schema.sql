-- ============================================================
-- 智慧课程案例库 · 数据库表结构与安全策略
-- 在 Supabase 控制台 → SQL Editor 里执行本文件
-- ============================================================

-- 1. 案例表 ----------------------------------------------------
create table if not exists public.cases (
  id            bigint generated always as identity primary key,  -- 数据库内部主键
  case_id       text,            -- 原始业务编号(来自知识库)
  school        text not null,   -- 学校
  level         text,            -- 办学层次
  teacher       text,            -- 教师
  teacher_title text,            -- 职称
  course        text,            -- 课程/案例名称
  major         text,            -- 专业
  knowledge     text,            -- 知识图谱/知识点建设
  ai            text,            -- AI 应用
  data          text,            -- 数据/学情闭环
  simulation    text,            -- 虚拟仿真
  keywords      text,            -- 关键词
  honor         text,            -- 荣誉
  url           text,            -- 链接
  source        text,            -- 来源平台
  citations     text,            -- 引用
  score         text,            -- 评分说明
  notes         text,            -- 备注
  sort_order    int,             -- 排序(默认沿用原始编号)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.cases is '智慧课程建设案例库;字段与原始知识库一一对应,缺失统一留空标“待核实”。';

-- 2. updated_at 自动更新 --------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_cases_updated_at on public.cases;
create trigger trg_cases_updated_at
  before update on public.cases
  for each row execute function public.set_updated_at();

-- 3. 行级安全(RLS) ------------------------------------------
-- 策略:任何人可读(前台公开浏览);仅登录用户可增删改(管理后台/多人协作)
alter table public.cases enable row level security;

drop policy if exists "cases public read"       on public.cases;
drop policy if exists "cases auth insert"        on public.cases;
drop policy if exists "cases auth update"        on public.cases;
drop policy if exists "cases auth delete"        on public.cases;

create policy "cases public read"
  on public.cases for select
  to anon, authenticated
  using (true);

create policy "cases auth insert"
  on public.cases for insert
  to authenticated
  with check (true);

create policy "cases auth update"
  on public.cases for update
  to authenticated
  using (true) with check (true);

create policy "cases auth delete"
  on public.cases for delete
  to authenticated
  using (true);

-- 4. 常用索引 -------------------------------------------------
create index if not exists idx_cases_sort   on public.cases (sort_order);
create index if not exists idx_cases_school on public.cases (school);
