-- Add bill_discount column to bill_history table
ALTER TABLE bill_history ADD COLUMN bill_discount DECIMAL(10,2) DEFAULT 0;
-- Optionally, update bill_discount for existing rows if needed
UPDATE bill_history SET bill_discount = 0 WHERE bill_discount IS NULL;