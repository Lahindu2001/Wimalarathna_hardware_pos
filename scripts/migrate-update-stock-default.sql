-- Migration: Update default stock value in products table
ALTER TABLE products ALTER COLUMN stock SET DEFAULT 9999;
-- Optionally update existing products with stock = 0 to 9999
UPDATE products SET stock = 9999 WHERE stock = 0;
