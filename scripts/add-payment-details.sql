-- Add amount_paid and change_returned columns to bill_history table

ALTER TABLE bill_history 
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS change_returned DECIMAL(10, 2);

-- Add comment to describe the columns
COMMENT ON COLUMN bill_history.amount_paid IS 'Amount paid by customer';
COMMENT ON COLUMN bill_history.change_returned IS 'Change returned to customer (positive = change, negative = shortage)';
