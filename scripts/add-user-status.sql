-- Add status column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Update existing users to approved status
UPDATE users 
SET status = 'approved' 
WHERE status IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
