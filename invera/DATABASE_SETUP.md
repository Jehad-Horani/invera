# INVERA Database Setup Instructions

## Run these SQL commands in your Supabase SQL Editor:

### 1. Create Projects Table

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

### 2. Enable Row Level Security (RLS)

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

### 3. Create Storage Bucket

Go to Storage in Supabase Dashboard:
- Create a new bucket named: **projects**
- Set it to **PUBLIC**
- Create folders: **covers/** and **gallery/**

### 4. Insert Sample Projects (Optional)

```sql
INSERT INTO projects (name, slug, category, location, year, cover_image_url, summary, story, is_featured, area_sqm) VALUES
('Pearl Towers Residences', 'pearl-towers-residences', 'real_estate', 'Amman, Jordan', 2024, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', 'Luxury residential development featuring twin towers with premium amenities.', 'A landmark development that redefines urban luxury living.', true, 45000),
('Modern Villa Architecture', 'modern-villa-architecture', 'architecture', 'Dead Sea Area', 2023, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'Contemporary villa design blending minimalism with natural surroundings.', 'Architectural excellence meeting environmental harmony.', true, 850),
('Executive Office Interior', 'executive-office-interior', 'interior_contracting', 'Abdali, Amman', 2024, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200', 'High-end corporate office with cutting-edge design and functionality.', 'Where productivity meets elegance.', false, 1200),
('Historic Home Renovation', 'historic-home-renovation', 'renovation', 'Jabal Amman', 2023, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200', 'Transforming a heritage property into a modern masterpiece.', 'Preserving history while embracing contemporary living.', true, 320);
```

## Setup Complete!

Your database is now ready for INVERA.
