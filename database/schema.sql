-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create packages table
create table packages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  is_public boolean default false,
  public_token uuid default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create items table
create table items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  vendor_link text,
  package_id uuid references packages(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table projects enable row level security;
alter table packages enable row level security;
alter table items enable row level security;

-- Projects policies
create policy "Users can view their own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users can create their own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on projects
  for delete using (auth.uid() = user_id);

-- Packages policies
create policy "Users can view their own packages" on packages
  for select using (auth.uid() = user_id);

create policy "Anyone can view public packages" on packages
  for select using (is_public = true);

create policy "Users can create their own packages" on packages
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own packages" on packages
  for update using (auth.uid() = user_id);

create policy "Users can delete their own packages" on packages
  for delete using (auth.uid() = user_id);

-- Items policies
create policy "Users can view their own items" on items
  for select using (auth.uid() = user_id);

create policy "Anyone can view items in public packages" on items
  for select using (
    exists (
      select 1 from packages
      where packages.id = items.package_id
      and packages.is_public = true
    )
  );

create policy "Users can create their own items" on items
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own items" on items
  for update using (auth.uid() = user_id);

create policy "Users can delete their own items" on items
  for delete using (auth.uid() = user_id);

-- Create storage bucket for images
insert into storage.buckets (id, name, public) values ('item-images', 'item-images', true);

-- Storage policies
create policy "Users can upload their own images" on storage.objects
  for insert with check (bucket_id = 'item-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own images" on storage.objects
  for select using (bucket_id = 'item-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view images in public packages" on storage.objects
  for select using (bucket_id = 'item-images');

create policy "Users can update their own images" on storage.objects
  for update using (bucket_id = 'item-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own images" on storage.objects
  for delete using (bucket_id = 'item-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create functions for updated_at trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger projects_updated_at
  before update on projects
  for each row
  execute procedure handle_updated_at();

create trigger packages_updated_at
  before update on packages
  for each row
  execute procedure handle_updated_at();

create trigger items_updated_at
  before update on items
  for each row
  execute procedure handle_updated_at();