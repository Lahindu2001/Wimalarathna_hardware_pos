-- Remove reorder_level column from products table
ALTER TABLE products DROP COLUMN IF EXISTS reorder_level;