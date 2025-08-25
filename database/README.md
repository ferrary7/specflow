# Database Setup

## Prerequisites
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings

## Setup Instructions

1. **Update Environment Variables**
   - Copy your Supabase project URL and anon key
   - Update the values in `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-actual-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
     ```

2. **Run Database Schema**
   - Go to your Supabase dashboard
   - Navigate to "SQL Editor"
   - Copy and paste the contents of `schema.sql`
   - Click "Run" to execute the schema

3. **Verify Setup**
   - Check that the following tables were created:
     - `projects`
     - `packages` 
     - `items`
   - Check that the storage bucket `item-images` was created
   - Verify RLS policies are enabled

## Schema Overview

- **projects**: Top-level organization (user-owned)
- **packages**: Collections within projects (can be made public)
- **items**: Individual items with images and vendor links
- **Storage**: `item-images` bucket for file uploads

All tables have Row Level Security (RLS) enabled for data protection.