# INVERA - Ultra-Luxury Real Estate Website

A premium Next.js application for INVERA, featuring real estate development, architecture, interior design, and renovation services.

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion + GSAP
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Cookie-based admin auth

## 🚀 Quick Start

### 1. Environment Setup

Your `.env.local` file is already configured with Supabase credentials.

### 2. Database Setup

**IMPORTANT**: Run these SQL commands in your Supabase SQL Editor before using the application.

#### Step 1: Create Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('real_estate', 'architecture', 'interior_contracting', 'renovation')),
  location TEXT,
  year INT,
  cover_image_url TEXT NOT NULL,
  gallery JSONB DEFAULT '[]',
  summary TEXT,
  story TEXT,
  scope TEXT,
  materials TEXT,
  area_sqm INT,
  client_name TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE UNIQUE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_featured ON projects(is_featured);
```

#### Step 2: Enable Row Level Security (RLS)

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT (read-only)
CREATE POLICY "Public can read projects"
  ON projects
  FOR SELECT
  USING (true);

-- Block public INSERT/UPDATE/DELETE (admin only via service role)
CREATE POLICY "Block public insert"
  ON projects
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Block public update"
  ON projects
  FOR UPDATE
  USING (false);

CREATE POLICY "Block public delete"
  ON projects
  FOR DELETE
  USING (false);
```

#### Step 3: Create Storage Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Create a new bucket named: **projects**
3. Set it to **PUBLIC**
4. Optional: Create folders `covers/` and `gallery/` for organization

#### Step 4: Insert Sample Projects (Optional)

```sql
INSERT INTO projects (name, slug, category, location, year, cover_image_url, summary, story, is_featured, area_sqm) VALUES
('Pearl Towers Residences', 'pearl-towers-residences', 'real_estate', 'Amman, Jordan', 2024, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', 'Luxury residential development featuring twin towers with premium amenities.', 'A landmark development that redefines urban luxury living. The Pearl Towers represent the pinnacle of modern residential architecture in Jordan.', true, 45000),
('Modern Villa Architecture', 'modern-villa-architecture', 'architecture', 'Dead Sea Area', 2023, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'Contemporary villa design blending minimalism with natural surroundings.', 'Architectural excellence meeting environmental harmony. This villa showcases sustainable design principles without compromising luxury.', true, 850),
('Executive Office Interior', 'executive-office-interior', 'interior_contracting', 'Abdali, Amman', 2024, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200', 'High-end corporate office with cutting-edge design and functionality.', 'Where productivity meets elegance. A complete interior transformation of a 1200 SQM corporate space.', false, 1200),
('Historic Home Renovation', 'historic-home-renovation', 'renovation', 'Jabal Amman', 2023, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200', 'Transforming a heritage property into a modern masterpiece.', 'Preserving history while embracing contemporary living. This renovation project breathed new life into a 1920s heritage home.', true, 320);
```

### 3. Start Development Server

```bash
cd /app/invera
yarn dev
```

The application will be available at `http://localhost:3000`

## 📱 Pages & Routes

### Public Pages
- **/** - Home page with cinematic hero and 4 core divisions
- **/projects** - Projects portfolio with filtering
- **/projects/[slug]** - Individual project details
- **/about** - Company information, vision, mission
- **/contact** - Contact form and information

### Admin Pages
- **/login** - Admin authentication
- **/admin** - Project management dashboard

## 🔐 Admin Access

**Login URL**: `http://localhost:3000/login`  
**Password**: `InveraSecure2026!`

### Admin Features
- Create new projects
- Edit existing projects
- Delete projects
- Toggle featured status
- Full CRUD operations via secure API routes

## 🎨 Design Features

### Visual Elements
- Glassmorphism navbar with gold accents
- Cinematic parallax hero section
- Animated counters for statistics
- Smooth hover transitions
- Gold (#c6a86b) luxury accent color
- Dark theme (#0f0f0f background)

### Animations
- Framer Motion for page transitions and reveals
- GSAP ScrollTrigger for parallax effects
- Counter animations on scroll
- Magnetic button interactions
- Split-text hero animation

### Typography
- **Headings**: Playfair Display (Elegant serif)
- **Body**: Inter (Clean sans-serif)

## 🏢 Four Core Divisions

### 1. Real Estate Development
- Luxury residential and commercial developments
- Animated statistics counters
- Featured projects showcase

### 2. Architecture
- Blueprint aesthetic overlays
- Rotating line animations
- Architectural excellence showcase

### 3. Interior Design & Contracting
- Split design/execution presentation
- Premium materials highlight
- Before/after capabilities

### 4. Renovation & Redesign
- Process breakdown (4 steps)
- Heritage restoration expertise
- Modern transformation showcase

## 🗄️ Database Structure

### Projects Table Schema
```
id              UUID (Primary Key)
name            TEXT (Required)
slug            TEXT (Unique, Auto-generated)
category        ENUM (real_estate, architecture, interior_contracting, renovation)
location        TEXT
year            INTEGER
cover_image_url TEXT (Required)
gallery         JSONB Array
summary         TEXT
story           TEXT
scope           TEXT
materials       TEXT
area_sqm        INTEGER
client_name     TEXT
is_featured     BOOLEAN (Default: false)
created_at      TIMESTAMP (Auto-generated)
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Public read-only access via anon key
- Write operations only via service role (server-side)
- Cookie-based admin authentication
- Protected admin routes via middleware
- Service role key never exposed to client

## 📦 API Routes

All admin operations use secure API routes:

- **POST** `/api/admin/login` - Admin authentication
- **POST** `/api/admin/projects/create` - Create project
- **PUT** `/api/admin/projects/update` - Update project
- **DELETE** `/api/admin/projects/delete` - Delete project
- **POST** `/api/admin/upload` - Upload images to Supabase storage

## 🎯 Performance Optimizations

- Next.js Image optimization
- Static page generation where possible
- Lazy loading for images
- Optimized bundle size
- Minimal JavaScript for animations
- Responsive images with proper sizing

## 📱 Responsive Design

Fully responsive across all device sizes:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large Desktop (1440px+)

## 🚢 Deployment Ready

The application is production-ready and can be deployed to:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

### Environment Variables for Production

Ensure these are set in your production environment:
```
NEXT_PUBLIC_SUPABASE_URL=https://jqnkwsfitruveecnyqst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_secure_password
```

## 📝 Next Steps

1. ✅ Run database setup SQL in Supabase
2. ✅ Create storage bucket named "projects"
3. ✅ Insert sample projects (optional)
4. ✅ Test the application locally
5. ✅ Login to admin dashboard
6. ✅ Create your own projects
7. ✅ Customize content and images
8. ✅ Deploy to production

## 🆘 Support

For any issues or questions, refer to:
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Framer Motion**: https://www.framer.com/motion/

---

**Built with ❤️ for INVERA**
