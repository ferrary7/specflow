# SpecFlow - Interior Design Package Management

A professional package management tool for interior designers to organize projects, create specification packages, and share them with clients.

## Features

- **Hierarchical Project Organization** - Projects → Packages → Items
- **Visual Item Management** - Upload and manage product images
- **Client Sharing** - Generate public links for client access
- **Professional PDF Export** - Create specification documents
- **Google Authentication** - Secure login with Google OAuth
- **Search & Filter** - Find items across all projects instantly
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Vendor Integration** - Link directly to product sources

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Storage**: Supabase Storage for image uploads
- **PDF Generation**: jsPDF with html2canvas

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/ferrary7/specflow.git
cd specflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema from `database/schema.sql` in your Supabase SQL Editor
3. Set up Google OAuth in Authentication → Providers
4. Configure your redirect URLs

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Setup

The application requires a Supabase database with the following setup:

1. **Run the Schema**: Execute `database/schema.sql` in your Supabase SQL Editor
2. **Configure Storage**: The schema creates an `item-images` storage bucket
3. **Set up Authentication**: Enable Google OAuth provider

See `database/README.md` for detailed setup instructions.

## Seed Data

New users automatically get sample data including:
- 2 demo projects (Modern Living Room, Luxury Hotel Suite)
- 3 packages with realistic interior design items
- Professional product images from Unsplash
- Vendor links and detailed descriptions

Users can reset their data anytime using the "Reset Demo Data" option in their profile menu.

## Folder Structure

```
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components  
│   │   └── public/         # Public sharing components
│   └── lib/                # Utilities and configurations
├── database/               # Database schema and setup
└── public/                # Static assets
```

## Key Features

### Authentication
- Google OAuth integration via Supabase Auth
- Secure session management
- Row-level security for data protection

### Project Management
- Create and organize design projects
- Nested package structure for specifications
- Rich item details with images and vendor links

### Sharing & Export
- Generate public links for client access (`/share/[packageId]`)
- Professional PDF export with multiple fallback methods
- Mobile-responsive public view

### Search & Navigation
- Real-time search across projects, packages, and items
- Hierarchical sidebar navigation
- Card-based workspace views

