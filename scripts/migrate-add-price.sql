-- Add price column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- Update any existing products with a default price if they don't have one
UPDATE products SET price = 0 WHERE price IS NULL;

-- Make the price column NOT NULL
ALTER TABLE products ALTER COLUMN price SET NOT NULL;
