-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tenants Table
create table tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ai_config jsonb default '{}'::jsonb -- Stores tone, services, FAQs
);

-- Users Table (linked to Supabase Auth)
create table users (
  id uuid primary key references auth.users(id),
  tenant_id uuid references tenants(id),
  role text check (role in ('owner', 'manager', 'sdr', 'super_admin')),
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leads Table
create table leads (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id),
  status text check (status in ('new', 'open', 'in_progress', 'closed', 'archived')) default 'new',
  source text default 'website',
  visitor_id text, -- For tracking anonymous visitors before they become leads
  name text,
  email text,
  phone text,
  summary text, -- AI generated summary
  ai_analysis jsonb, -- Extracted fields: budget, timeline, service_type
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages Table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id),
  sender_type text check (sender_type in ('user', 'lead', 'ai')),
  sender_id uuid, -- Null if AI or Lead (unless we track lead users)
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read_at timestamp with time zone
);

-- RLS Policies (Basic Draft)
alter table tenants enable row level security;
alter table users enable row level security;
alter table leads enable row level security;
alter table messages enable row level security;

-- Policy: Users can see data from their own tenant
create policy "Users can view their own tenant" on tenants
  for select using (id in (select tenant_id from users where users.id = auth.uid()));

create policy "Users can view leads from their tenant" on leads
  for select using (tenant_id in (select tenant_id from users where users.id = auth.uid()));

create policy "Users can view messages from their tenant" on messages
  for select using (lead_id in (select id from leads where tenant_id in (select tenant_id from users where users.id = auth.uid())));
