-- EXAMPLE SEED DATA 
-- This is a reference file showing what sample data looks like
-- The actual seed data is created automatically for each user via JavaScript
-- when they first log in (see src/lib/seed-data.js)

-- NOTE: Replace 'your-user-id-here' with actual user ID from auth.users
-- This is just for reference - the app handles seed data creation automatically

-- Example Projects
/*
INSERT INTO projects (id, name, description, user_id, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Modern Living Room', 'Contemporary living space with clean lines and neutral tones', 'your-user-id-here', NOW(), NOW()),
  (gen_random_uuid(), 'Luxury Hotel Suite', 'High-end hospitality design with premium finishes', 'your-user-id-here', NOW(), NOW()),
  (gen_random_uuid(), 'Cozy Bedroom Retreat', 'Warm and inviting bedroom design with natural textures', 'your-user-id-here', NOW(), NOW());
*/

-- Example Packages  
/*
INSERT INTO packages (id, name, description, project_id, user_id, is_public, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Furniture & Seating', 'Main furniture pieces including sofa, chairs, and coffee table', 'project-id-1', 'your-user-id-here', true, NOW(), NOW()),
  (gen_random_uuid(), 'Lighting & Accessories', 'Lighting fixtures, lamps, and decorative accessories', 'project-id-1', 'your-user-id-here', false, NOW(), NOW()),
  (gen_random_uuid(), 'Bedroom Suite', 'Premium bedroom furniture and linens', 'project-id-2', 'your-user-id-here', false, NOW(), NOW());
*/

-- Example Items
/*
INSERT INTO items (id, name, description, vendor_link, package_id, user_id, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Mid-Century Modern Sofa', 'A sleek 3-seater sofa in charcoal fabric with walnut legs. Perfect centerpiece for contemporary living spaces.', 'https://www.westelm.com/products/mid-century-modern-sofa', 'package-id-1', 'your-user-id-here', NOW(), NOW()),
  (gen_random_uuid(), 'Glass Coffee Table', 'Minimalist tempered glass coffee table with chrome legs. Creates an open, airy feel in the room.', 'https://www.cb2.com/glass-coffee-table', 'package-id-1', 'your-user-id-here', NOW(), NOW()),
  (gen_random_uuid(), 'Accent Armchair', 'Velvet upholstered swivel chair in deep emerald green. Adds a pop of color and comfort.', 'https://www.anthropologie.com/accent-chair', 'package-id-1', 'your-user-id-here', NOW(), NOW()),
  (gen_random_uuid(), 'Pendant Light Fixture', 'Brass and black pendant light with geometric design. Provides focused lighting over seating area.', 'https://www.schoolhouse.com/pendant-lighting', 'package-id-2', 'your-user-id-here', NOW(), NOW()),
  (gen_random_uuid(), 'King Size Platform Bed', 'Upholstered platform bed in cream bouclé fabric with brass accents. Hotel-quality comfort and style.', 'https://www.restorationhardware.com/platform-bed', 'package-id-3', 'your-user-id-here', NOW(), NOW());
*/

-- Sample data structure:
-- 
-- Projects (2-3 sample projects):
-- ├── Modern Living Room
-- │   ├── Furniture & Seating (Public)
-- │   │   ├── Mid-Century Modern Sofa
-- │   │   ├── Glass Coffee Table  
-- │   │   └── Accent Armchair
-- │   └── Lighting & Accessories (Private)
-- │       ├── Pendant Light Fixture
-- │       ├── Table Lamp Set
-- │       ├── Abstract Wall Art
-- │       └── Decorative Throw Pillows
-- │
-- ├── Luxury Hotel Suite
-- │   └── Bedroom Suite (Private)
-- │       ├── King Size Platform Bed
-- │       ├── Luxury Bedding Set
-- │       └── Bedside Nightstands
-- │
-- └── Cozy Bedroom Retreat (Empty - shows empty state)

-- The actual seed data creation happens automatically in the application
-- when a new user logs in for the first time via src/lib/seed-data.js