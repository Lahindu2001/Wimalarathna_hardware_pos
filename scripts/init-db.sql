-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bill History Table
CREATE TABLE IF NOT EXISTS bill_history (
    id SERIAL PRIMARY KEY,
    bill_no VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100),
    items JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2),
    change_returned DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_bill_history_bill_no ON bill_history(bill_no);
CREATE INDEX IF NOT EXISTS idx_bill_history_created_at ON bill_history(created_at);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert sample products for Wimalarathne Hardware
INSERT INTO products (name, price, stock) VALUES 
    ('Hammer 500g', 450.00, 25),
    ('Nails 1kg', 120.00, 100),
    ('Screwdriver Set', 350.00, 15),
    ('Wood Screws Box', 280.00, 30),
    ('Wrench Set', 1200.00, 10),
    ('Pliers 8inch', 280.00, 20),
    ('Saw Blade', 350.00, 12),
    ('Sandpaper 150 grit', 80.00, 50),
    ('Wood Glue 500ml', 180.00, 18),
    ('Drill Bits Set', 420.00, 8),
    ('Measuring Tape 5m', 150.00, 20),
    ('Level Tool', 280.00, 12),
    ('Paint Brush Set', 220.00, 25),
    ('Safety Glasses', 120.00, 40),
    ('Work Gloves', 180.00, 35),
    ('Steel Ruler 1m', 200.00, 15),
    ('Pencil Box', 60.00, 60),
    ('Cement 50kg', 350.00, 20),
    ('Brick per piece', 45.00, 500),
    ('PVC Pipe 2inch', 280.00, 30)
ON CONFLICT DO NOTHING;
