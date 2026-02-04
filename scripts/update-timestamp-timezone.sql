-- Update bill_history table to use TIMESTAMPTZ instead of TIMESTAMP
ALTER TABLE bill_history 
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- Set default to NOW() which is timezone aware
ALTER TABLE bill_history 
ALTER COLUMN created_at SET DEFAULT NOW();
