-- Add reorder_level column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS reorder_level INTEGER DEFAULT 50;

-- Update existing products to have reorder level of 50
UPDATE products 
SET reorder_level = 50 
WHERE reorder_level IS NULL;
