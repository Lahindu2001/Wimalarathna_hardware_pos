-- Master Hardware Products List for Wimalarathne Hardware
-- This script adds comprehensive hardware products with models and measurements

-- Clear existing sample products if needed (optional)
-- DELETE FROM products WHERE id > 0;

-- HAMMERS (Different weights and types)
INSERT INTO products (name, price, stock) VALUES 
    ('Hammer Claw 250g', 350.00, 20),
    ('Hammer Claw 500g', 450.00, 25),
    ('Hammer Claw 750g', 550.00, 18),
    ('Hammer Claw 1kg', 650.00, 15),
    ('Hammer Ball Peen 500g', 480.00, 12),
    ('Hammer Ball Peen 1kg', 680.00, 10),
    ('Hammer Rubber 450g', 420.00, 15),
    ('Hammer Sledge 2kg', 1200.00, 8),
    ('Hammer Sledge 4kg', 1800.00, 5),
    ('Hammer Sledge 6kg', 2400.00, 4)
ON CONFLICT DO NOTHING;

-- NAILS (Different sizes and types)
INSERT INTO products (name, price, stock) VALUES 
    ('Nails Common 1 inch (1kg)', 120.00, 100),
    ('Nails Common 1.5 inch (1kg)', 130.00, 100),
    ('Nails Common 2 inch (1kg)', 140.00, 100),
    ('Nails Common 2.5 inch (1kg)', 150.00, 80),
    ('Nails Common 3 inch (1kg)', 160.00, 80),
    ('Nails Common 4 inch (1kg)', 180.00, 60),
    ('Nails Finishing 1 inch (500g)', 100.00, 50),
    ('Nails Finishing 2 inch (500g)', 120.00, 50),
    ('Nails Roofing 2 inch (1kg)', 180.00, 40),
    ('Nails Concrete 2.5 inch (500g)', 200.00, 30)
ON CONFLICT DO NOTHING;

-- SCREWS (Different sizes and types)
INSERT INTO products (name, price, stock) VALUES 
    ('Wood Screws #6 x 1 inch (100pcs)', 150.00, 40),
    ('Wood Screws #8 x 1.5 inch (100pcs)', 180.00, 40),
    ('Wood Screws #10 x 2 inch (100pcs)', 220.00, 35),
    ('Wood Screws #12 x 2.5 inch (50pcs)', 180.00, 30),
    ('Self Tapping Screws 1 inch (100pcs)', 200.00, 35),
    ('Self Tapping Screws 2 inch (100pcs)', 250.00, 30),
    ('Drywall Screws 1.25 inch (200pcs)', 280.00, 25),
    ('Drywall Screws 2 inch (200pcs)', 320.00, 25),
    ('Machine Screws M4 x 20mm (50pcs)', 150.00, 30),
    ('Machine Screws M6 x 30mm (50pcs)', 180.00, 30),
    ('Concrete Screws 2 inch (25pcs)', 280.00, 20)
ON CONFLICT DO NOTHING;

-- BOLTS & NUTS (Different sizes)
INSERT INTO products (name, price, stock) VALUES 
    ('Bolt Hex M6 x 20mm (10pcs)', 80.00, 50),
    ('Bolt Hex M8 x 30mm (10pcs)', 120.00, 50),
    ('Bolt Hex M10 x 40mm (10pcs)', 180.00, 40),
    ('Bolt Hex M12 x 50mm (10pcs)', 250.00, 30),
    ('Bolt Carriage M8 x 40mm (10pcs)', 150.00, 35),
    ('Bolt Carriage M10 x 50mm (10pcs)', 220.00, 30),
    ('Nuts Hex M6 (20pcs)', 50.00, 60),
    ('Nuts Hex M8 (20pcs)', 70.00, 60),
    ('Nuts Hex M10 (20pcs)', 100.00, 50),
    ('Nuts Hex M12 (20pcs)', 140.00, 40),
    ('Washers M6 Flat (50pcs)', 60.00, 50),
    ('Washers M8 Flat (50pcs)', 80.00, 50),
    ('Washers M10 Flat (50pcs)', 120.00, 40),
    ('Lock Washers M8 (25pcs)', 90.00, 40)
ON CONFLICT DO NOTHING;

-- WRENCHES (Different sizes)
INSERT INTO products (name, price, stock) VALUES 
    ('Wrench Adjustable 6 inch', 350.00, 20),
    ('Wrench Adjustable 8 inch', 480.00, 18),
    ('Wrench Adjustable 10 inch', 650.00, 15),
    ('Wrench Adjustable 12 inch', 850.00, 12),
    ('Wrench Combination 8mm', 120.00, 25),
    ('Wrench Combination 10mm', 140.00, 25),
    ('Wrench Combination 12mm', 160.00, 22),
    ('Wrench Combination 14mm', 180.00, 20),
    ('Wrench Combination 17mm', 220.00, 18),
    ('Wrench Combination Set (8pcs)', 1200.00, 10),
    ('Wrench Socket Set 1/4 inch (20pcs)', 1800.00, 8),
    ('Wrench Socket Set 1/2 inch (25pcs)', 2800.00, 6),
    ('Wrench Pipe 14 inch', 680.00, 10),
    ('Wrench Pipe 18 inch', 950.00, 8)
ON CONFLICT DO NOTHING;

-- PLIERS (Different types and sizes)
INSERT INTO products (name, price, stock) VALUES 
    ('Pliers Combination 6 inch', 220.00, 20),
    ('Pliers Combination 8 inch', 280.00, 20),
    ('Pliers Long Nose 6 inch', 250.00, 18),
    ('Pliers Long Nose 8 inch', 320.00, 15),
    ('Pliers Cutting 6 inch', 280.00, 18),
    ('Pliers Cutting 8 inch', 350.00, 15),
    ('Pliers Slip Joint 8 inch', 300.00, 15),
    ('Pliers Locking 7 inch', 380.00, 12),
    ('Pliers Water Pump 10 inch', 420.00, 12),
    ('Pliers Stripping Wire 6 inch', 320.00, 15)
ON CONFLICT DO NOTHING;

-- SAWS (Different types)
INSERT INTO products (name, price, stock) VALUES 
    ('Saw Hand 18 inch', 450.00, 15),
    ('Saw Hand 22 inch', 580.00, 12),
    ('Saw Hack 12 inch Frame', 320.00, 18),
    ('Saw Hack Blade 12 inch (10pcs)', 150.00, 30),
    ('Saw Coping 6 inch', 280.00, 12),
    ('Saw Keyhole 12 inch', 300.00, 10),
    ('Saw Bow 24 inch', 650.00, 8),
    ('Saw Blade Wood 18 inch', 350.00, 20),
    ('Saw Blade Metal 12 inch', 280.00, 25)
ON CONFLICT DO NOTHING;

-- SCREWDRIVERS (Different types and sizes)
INSERT INTO products (name, price, stock) VALUES 
    ('Screwdriver Flat 3mm x 75mm', 80.00, 30),
    ('Screwdriver Flat 5mm x 100mm', 100.00, 30),
    ('Screwdriver Flat 6mm x 125mm', 120.00, 25),
    ('Screwdriver Flat 8mm x 150mm', 150.00, 20),
    ('Screwdriver Phillips #0 x 75mm', 80.00, 30),
    ('Screwdriver Phillips #1 x 100mm', 100.00, 30),
    ('Screwdriver Phillips #2 x 125mm', 120.00, 25),
    ('Screwdriver Phillips #3 x 150mm', 150.00, 20),
    ('Screwdriver Set 6pcs', 350.00, 15),
    ('Screwdriver Set Precision 8pcs', 420.00, 12)
ON CONFLICT DO NOTHING;

-- DRILL BITS (Different sizes)
INSERT INTO products (name, price, stock) VALUES 
    ('Drill Bit HSS 2mm', 45.00, 40),
    ('Drill Bit HSS 3mm', 50.00, 40),
    ('Drill Bit HSS 4mm', 55.00, 38),
    ('Drill Bit HSS 5mm', 60.00, 35),
    ('Drill Bit HSS 6mm', 70.00, 35),
    ('Drill Bit HSS 8mm', 90.00, 30),
    ('Drill Bit HSS 10mm', 120.00, 28),
    ('Drill Bit HSS 12mm', 150.00, 25),
    ('Drill Bit Set HSS 1-13mm (13pcs)', 850.00, 10),
    ('Drill Bit Masonry 6mm', 80.00, 30),
    ('Drill Bit Masonry 8mm', 100.00, 28),
    ('Drill Bit Masonry 10mm', 130.00, 25),
    ('Drill Bit Masonry 12mm', 160.00, 22),
    ('Drill Bit Wood 6mm', 70.00, 30),
    ('Drill Bit Wood 8mm', 85.00, 28),
    ('Drill Bit Wood 10mm', 100.00, 25),
    ('Drill Bit Wood 12mm', 120.00, 25)
ON CONFLICT DO NOTHING;

-- SANDPAPER (Different grits)
INSERT INTO products (name, price, stock) VALUES 
    ('Sandpaper 60 Grit (10 sheets)', 120.00, 40),
    ('Sandpaper 80 Grit (10 sheets)', 100.00, 50),
    ('Sandpaper 100 Grit (10 sheets)', 90.00, 50),
    ('Sandpaper 120 Grit (10 sheets)', 85.00, 55),
    ('Sandpaper 150 Grit (10 sheets)', 80.00, 60),
    ('Sandpaper 180 Grit (10 sheets)', 85.00, 50),
    ('Sandpaper 220 Grit (10 sheets)', 90.00, 45),
    ('Sandpaper 320 Grit (10 sheets)', 100.00, 35),
    ('Sandpaper Assorted Pack (50 sheets)', 380.00, 25)
ON CONFLICT DO NOTHING;

-- ADHESIVES & SEALANTS
INSERT INTO products (name, price, stock) VALUES 
    ('Wood Glue 250ml', 120.00, 30),
    ('Wood Glue 500ml', 180.00, 25),
    ('Wood Glue 1L', 320.00, 15),
    ('Super Glue 3g', 80.00, 50),
    ('Super Glue 20g', 180.00, 35),
    ('Epoxy Adhesive 2 Part 50ml', 280.00, 20),
    ('Epoxy Adhesive 2 Part 250ml', 650.00, 12),
    ('Silicone Sealant Clear 300ml', 280.00, 25),
    ('Silicone Sealant White 300ml', 280.00, 25),
    ('Silicone Sealant Black 300ml', 280.00, 20),
    ('PVC Cement 100ml', 180.00, 30),
    ('PVC Cement 250ml', 320.00, 20),
    ('Contact Adhesive 250ml', 280.00, 18),
    ('Contact Adhesive 500ml', 480.00, 12)
ON CONFLICT DO NOTHING;

-- TAPE & BINDING
INSERT INTO products (name, price, stock) VALUES 
    ('Masking Tape 1 inch x 20m', 120.00, 40),
    ('Masking Tape 2 inch x 20m', 200.00, 30),
    ('Duct Tape 2 inch x 20m', 280.00, 35),
    ('Electrical Tape Black 3/4 inch', 80.00, 50),
    ('Electrical Tape Assorted (5pcs)', 350.00, 20),
    ('Double Sided Tape 1 inch x 5m', 150.00, 30),
    ('Packing Tape 2 inch x 50m', 180.00, 40),
    ('Thread Seal Tape (PTFE) 1/2 inch', 60.00, 60),
    ('Cable Ties 4 inch (100pcs)', 120.00, 35),
    ('Cable Ties 8 inch (100pcs)', 180.00, 30),
    ('Wire Rope 3mm (per meter)', 45.00, 100),
    ('Wire Rope 5mm (per meter)', 75.00, 80)
ON CONFLICT DO NOTHING;

-- PAINTS & PAINTING SUPPLIES
INSERT INTO products (name, price, stock) VALUES 
    ('Paint Brush 1 inch', 80.00, 40),
    ('Paint Brush 2 inch', 120.00, 35),
    ('Paint Brush 3 inch', 180.00, 30),
    ('Paint Brush 4 inch', 250.00, 25),
    ('Paint Brush Set 5pcs', 420.00, 20),
    ('Paint Roller 9 inch Frame', 280.00, 25),
    ('Paint Roller Refill 9 inch', 120.00, 50),
    ('Paint Roller Tray', 180.00, 30),
    ('Paint Thinner 500ml', 180.00, 30),
    ('Paint Thinner 1L', 320.00, 20),
    ('Turpentine 500ml', 200.00, 25),
    ('Turpentine 1L', 350.00, 18),
    ('Primer White 1L', 450.00, 20),
    ('Primer White 4L', 1600.00, 10),
    ('Paint Spray Can White 400ml', 380.00, 25),
    ('Paint Spray Can Black 400ml', 380.00, 25)
ON CONFLICT DO NOTHING;

-- MEASURING TOOLS
INSERT INTO products (name, price, stock) VALUES 
    ('Measuring Tape 3m', 120.00, 30),
    ('Measuring Tape 5m', 150.00, 30),
    ('Measuring Tape 7.5m', 220.00, 20),
    ('Measuring Tape 10m', 320.00, 15),
    ('Steel Ruler 30cm', 80.00, 40),
    ('Steel Ruler 50cm', 120.00, 30),
    ('Steel Ruler 1m', 200.00, 20),
    ('Level Spirit 12 inch', 280.00, 18),
    ('Level Spirit 24 inch', 450.00, 15),
    ('Level Spirit 48 inch', 850.00, 10),
    ('Try Square 6 inch', 220.00, 20),
    ('Try Square 12 inch', 380.00, 15),
    ('Angle Finder Digital', 1200.00, 8),
    ('Caliper Vernier 6 inch', 650.00, 12),
    ('Caliper Digital 6 inch', 1500.00, 8)
ON CONFLICT DO NOTHING;

-- SAFETY EQUIPMENT
INSERT INTO products (name, price, stock) VALUES 
    ('Safety Glasses Clear', 120.00, 50),
    ('Safety Glasses Tinted', 150.00, 35),
    ('Safety Goggles', 220.00, 30),
    ('Dust Mask (10pcs)', 180.00, 40),
    ('Respirator Half Face', 850.00, 15),
    ('Work Gloves Cotton (pair)', 80.00, 60),
    ('Work Gloves Leather (pair)', 280.00, 40),
    ('Work Gloves Rubber (pair)', 120.00, 45),
    ('Ear Plugs (10 pairs)', 150.00, 30),
    ('Ear Muffs', 480.00, 20),
    ('Hard Hat Yellow', 650.00, 25),
    ('Hard Hat White', 650.00, 20),
    ('Safety Vest Reflective', 380.00, 30),
    ('Knee Pads Foam', 420.00, 20),
    ('First Aid Kit Small', 850.00, 15),
    ('Fire Extinguisher 1kg', 1200.00, 10)
ON CONFLICT DO NOTHING;

-- ELECTRICAL SUPPLIES
INSERT INTO products (name, price, stock) VALUES 
    ('Wire Electrical 1.5mm² (per meter)', 35.00, 200),
    ('Wire Electrical 2.5mm² (per meter)', 55.00, 150),
    ('Wire Electrical 4mm² (per meter)', 80.00, 100),
    ('Wire Electrical 6mm² (per meter)', 120.00, 80),
    ('Extension Cord 5m', 450.00, 25),
    ('Extension Cord 10m', 750.00, 18),
    ('Extension Cord 20m', 1400.00, 12),
    ('Socket Outlet 13A', 150.00, 40),
    ('Switch 1 Gang', 120.00, 50),
    ('Switch 2 Gang', 180.00, 40),
    ('Light Bulb LED 9W', 180.00, 60),
    ('Light Bulb LED 12W', 220.00, 50),
    ('Light Bulb LED 15W', 280.00, 40),
    ('Tube Light LED 18W 4ft', 480.00, 30),
    ('Fuse 5A (5pcs)', 60.00, 40),
    ('Fuse 13A (5pcs)', 70.00, 40),
    ('Circuit Breaker 16A', 280.00, 25),
    ('Circuit Breaker 32A', 380.00, 20),
    ('Junction Box 4x4 inch', 120.00, 35),
    ('Conduit PVC 16mm (per meter)', 45.00, 100),
    ('Conduit PVC 20mm (per meter)', 60.00, 80)
ON CONFLICT DO NOTHING;

-- PLUMBING SUPPLIES
INSERT INTO products (name, price, stock) VALUES 
    ('PVC Pipe 1/2 inch (per meter)', 120.00, 60),
    ('PVC Pipe 3/4 inch (per meter)', 180.00, 50),
    ('PVC Pipe 1 inch (per meter)', 220.00, 45),
    ('PVC Pipe 1.5 inch (per meter)', 280.00, 40),
    ('PVC Pipe 2 inch (per meter)', 350.00, 35),
    ('PVC Pipe 3 inch (per meter)', 520.00, 25),
    ('PVC Pipe 4 inch (per meter)', 720.00, 20),
    ('PVC Elbow 1/2 inch', 25.00, 100),
    ('PVC Elbow 1 inch', 45.00, 80),
    ('PVC Elbow 2 inch', 85.00, 60),
    ('PVC Tee 1/2 inch', 35.00, 80),
    ('PVC Tee 1 inch', 60.00, 60),
    ('PVC Tee 2 inch', 120.00, 50),
    ('PVC Socket 1/2 inch', 20.00, 100),
    ('PVC Socket 1 inch', 35.00, 80),
    ('PVC Socket 2 inch', 70.00, 60),
    ('PVC Reducer 1x1/2 inch', 40.00, 60),
    ('PVC Reducer 2x1 inch', 80.00, 50),
    ('Tap Basin Chrome', 850.00, 15),
    ('Tap Sink Chrome', 1200.00, 12),
    ('Tap Garden 1/2 inch', 380.00, 20),
    ('Ball Valve 1/2 inch', 280.00, 25),
    ('Ball Valve 1 inch', 450.00, 20),
    ('Gate Valve 1/2 inch', 320.00, 20),
    ('Gate Valve 1 inch', 520.00, 15),
    ('Flexible Hose 1/2 inch 30cm', 180.00, 30),
    ('Flexible Hose 1/2 inch 50cm', 250.00, 25)
ON CONFLICT DO NOTHING;

-- CEMENT & BUILDING MATERIALS
INSERT INTO products (name, price, stock) VALUES 
    ('Cement Ordinary 50kg', 850.00, 100),
    ('Cement White 50kg', 1200.00, 50),
    ('Sand River (per kg)', 8.00, 5000),
    ('Sand Washed (per kg)', 12.00, 3000),
    ('Gravel 10mm (per kg)', 15.00, 2000),
    ('Gravel 20mm (per kg)', 18.00, 2000),
    ('Brick Red Common (per piece)', 45.00, 1000),
    ('Brick Red Wire Cut (per piece)', 65.00, 800),
    ('Block Concrete 4 inch (per piece)', 85.00, 500),
    ('Block Concrete 6 inch (per piece)', 120.00, 400),
    ('Block Concrete 8 inch (per piece)', 180.00, 300),
    ('Tile Floor 12x12 inch', 120.00, 200),
    ('Tile Wall 8x12 inch', 95.00, 250),
    ('Tile Adhesive 20kg', 680.00, 40),
    ('Grout White 5kg', 380.00, 30),
    ('Grout Grey 5kg', 350.00, 35)
ON CONFLICT DO NOTHING;

-- WOOD & TIMBER
INSERT INTO products (name, price, stock) VALUES 
    ('Wood Pine 2x2 inch (per foot)', 85.00, 200),
    ('Wood Pine 2x4 inch (per foot)', 160.00, 150),
    ('Wood Pine 2x6 inch (per foot)', 240.00, 100),
    ('Wood Pine 4x4 inch (per foot)', 320.00, 80),
    ('Plywood 4x8 ft 6mm', 1800.00, 40),
    ('Plywood 4x8 ft 9mm', 2400.00, 35),
    ('Plywood 4x8 ft 12mm', 3200.00, 30),
    ('Plywood 4x8 ft 18mm', 4500.00, 20),
    ('MDF Board 4x8 ft 6mm', 1500.00, 30),
    ('MDF Board 4x8 ft 12mm', 2800.00, 25),
    ('Chipboard 4x8 ft 18mm', 2200.00, 25),
    ('Hardboard 4x8 ft 3mm', 1200.00, 30)
ON CONFLICT DO NOTHING;

-- FASTENING & HANGING
INSERT INTO products (name, price, stock) VALUES 
    ('Wall Plug 6mm (50pcs)', 80.00, 40),
    ('Wall Plug 8mm (50pcs)', 100.00, 35),
    ('Wall Plug 10mm (50pcs)', 130.00, 30),
    ('Anchor Hollow Wall (10pcs)', 150.00, 30),
    ('Anchor Toggle (10pcs)', 180.00, 25),
    ('Hook Ceiling (5pcs)', 120.00, 35),
    ('Hook Picture (20pcs)', 100.00, 40),
    ('Hinge Butt 3 inch (pair)', 120.00, 50),
    ('Hinge Butt 4 inch (pair)', 160.00, 40),
    ('Hinge Piano 1m', 380.00, 20),
    ('Lock Padlock 40mm', 280.00, 35),
    ('Lock Padlock 50mm', 380.00, 30),
    ('Lock Door Mortise', 850.00, 20),
    ('Lock Door Cylindrical', 650.00, 25),
    ('Handle Door Lever', 480.00, 30),
    ('Handle Door Knob', 420.00, 30)
ON CONFLICT DO NOTHING;

-- POWER TOOL ACCESSORIES
INSERT INTO products (name, price, stock) VALUES 
    ('Grinding Disc 4 inch', 80.00, 50),
    ('Grinding Disc 5 inch', 100.00, 45),
    ('Grinding Disc 7 inch', 150.00, 35),
    ('Cutting Disc Metal 4 inch', 70.00, 60),
    ('Cutting Disc Metal 5 inch', 90.00, 50),
    ('Cutting Disc Stone 4 inch', 75.00, 50),
    ('Cutting Disc Stone 7 inch', 130.00, 35),
    ('Sanding Disc 5 inch 80 Grit (5pcs)', 120.00, 30),
    ('Sanding Disc 5 inch 120 Grit (5pcs)', 120.00, 30),
    ('Polishing Pad 5 inch', 180.00, 25),
    ('Wire Wheel Brush 6 inch', 280.00, 20),
    ('Jigsaw Blade Wood (5pcs)', 220.00, 25),
    ('Jigsaw Blade Metal (5pcs)', 250.00, 20),
    ('Circular Saw Blade 7 inch 24T', 650.00, 15),
    ('Circular Saw Blade 10 inch 40T', 1200.00, 10)
ON CONFLICT DO NOTHING;

-- MISCELLANEOUS TOOLS
INSERT INTO products (name, price, stock) VALUES 
    ('Chisel Wood 6mm', 180.00, 25),
    ('Chisel Wood 12mm', 220.00, 22),
    ('Chisel Wood 19mm', 280.00, 20),
    ('Chisel Wood 25mm', 350.00, 18),
    ('Chisel Cold 12mm', 250.00, 20),
    ('Chisel Cold 19mm', 320.00, 18),
    ('Plane Block 6 inch', 850.00, 12),
    ('Plane Smooth 10 inch', 1500.00, 8),
    ('Clamp G 4 inch', 220.00, 25),
    ('Clamp G 6 inch', 320.00, 20),
    ('Clamp G 8 inch', 450.00, 15),
    ('Clamp Bar 12 inch', 480.00, 18),
    ('Clamp Bar 24 inch', 850.00, 12),
    ('Clamp Spring 4 inch (2pcs)', 150.00, 30),
    ('File Flat 8 inch', 220.00, 25),
    ('File Flat 10 inch', 280.00, 20),
    ('File Round 8 inch', 200.00, 25),
    ('File Half Round 8 inch', 220.00, 22),
    ('Rasp Wood 10 inch', 280.00, 20),
    ('Punch Center 4 inch', 180.00, 25),
    ('Punch Pin 6 inch', 220.00, 20),
    ('Utility Knife Retractable', 150.00, 40),
    ('Utility Knife Blades (10pcs)', 80.00, 50),
    ('Scissors Metal Tin Snips', 420.00, 18),
    ('Trowel Brick 11 inch', 380.00, 20),
    ('Trowel Pointing 6 inch', 220.00, 25),
    ('Trowel Plastering 12 inch', 450.00, 18),
    ('Float Wood 12 inch', 320.00, 20),
    ('Float Sponge 8 inch', 180.00, 25),
    ('Bucket Plastic 10L', 280.00, 30),
    ('Bucket Plastic 20L', 420.00, 25),
    ('Wheelbarrow Steel 80L', 4500.00, 10),
    ('Ladder Aluminum 6 ft', 4800.00, 8),
    ('Ladder Aluminum 10 ft', 7500.00, 6),
    ('Step Ladder 5 Steps', 3500.00, 10),
    ('Tool Box Metal 16 inch', 850.00, 20),
    ('Tool Box Plastic 18 inch', 650.00, 25),
    ('Tool Belt Leather', 680.00, 15),
    ('Apron Work Canvas', 420.00, 20)
ON CONFLICT DO NOTHING;

-- GARDEN & OUTDOOR TOOLS
INSERT INTO products (name, price, stock) VALUES 
    ('Spade Garden Long Handle', 850.00, 15),
    ('Shovel Square Point', 780.00, 18),
    ('Shovel Round Point', 780.00, 18),
    ('Fork Garden 4 Prong', 680.00, 15),
    ('Rake Garden 14 Teeth', 620.00, 18),
    ('Rake Leaf Plastic', 380.00, 20),
    ('Hoe Garden 6 inch', 480.00, 20),
    ('Axe Felling 3 lb', 1200.00, 10),
    ('Axe Splitting 6 lb', 1800.00, 8),
    ('Machete 18 inch', 650.00, 15),
    ('Pruners Hand 8 inch', 480.00, 20),
    ('Pruners Lopper 24 inch', 950.00, 12),
    ('Shears Hedge 24 inch', 1200.00, 10),
    ('Garden Hose 1/2 inch 15m', 850.00, 15),
    ('Garden Hose 1/2 inch 30m', 1500.00, 10),
    ('Sprinkler Oscillating', 650.00, 15),
    ('Watering Can 10L', 380.00, 20)
ON CONFLICT DO NOTHING;

-- CLEANING & MAINTENANCE
INSERT INTO products (name, price, stock) VALUES 
    ('Broom Soft Indoor', 320.00, 25),
    ('Broom Hard Outdoor', 380.00, 20),
    ('Mop Cotton Head', 220.00, 30),
    ('Mop Microfiber Head', 350.00, 25),
    ('Mop Handle Aluminum', 280.00, 25),
    ('Dustpan Long Handle', 350.00, 20),
    ('Brush Wire Hand', 180.00, 30),
    ('Brush Scrubbing', 220.00, 25),
    ('Sponge Scrub (5pcs)', 120.00, 40),
    ('Steel Wool (pack)', 100.00, 35),
    ('Trash Bag Large (10pcs)', 180.00, 40),
    ('Trash Bag Extra Large (10pcs)', 250.00, 30),
    ('Lubricant Spray WD-40 400ml', 480.00, 25),
    ('Grease Multi-Purpose 500g', 380.00, 20),
    ('Oil Machine 250ml', 180.00, 30)
ON CONFLICT DO NOTHING;

-- Update the updated_at timestamp for all products
UPDATE products SET updated_at = CURRENT_TIMESTAMP;

-- Create indexes if not exists for better performance
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Optional: View product count by category (for verification)
-- SELECT 
--     CASE 
--         WHEN name LIKE 'Hammer%' THEN 'Hammers'
--         WHEN name LIKE 'Nail%' THEN 'Nails'
--         WHEN name LIKE '%Screw%' THEN 'Screws'
--         WHEN name LIKE 'Bolt%' OR name LIKE 'Nut%' OR name LIKE 'Washer%' THEN 'Bolts & Nuts'
--         WHEN name LIKE 'Wrench%' THEN 'Wrenches'
--         WHEN name LIKE 'Pliers%' THEN 'Pliers'
--         WHEN name LIKE 'Saw%' THEN 'Saws'
--         WHEN name LIKE 'Screwdriver%' THEN 'Screwdrivers'
--         WHEN name LIKE 'Drill Bit%' THEN 'Drill Bits'
--         WHEN name LIKE 'Sandpaper%' THEN 'Sandpaper'
--         WHEN name LIKE '%Glue%' OR name LIKE '%Adhesive%' OR name LIKE '%Sealant%' OR name LIKE '%Cement%' THEN 'Adhesives'
--         WHEN name LIKE '%Tape%' OR name LIKE '%Ties%' THEN 'Tape & Binding'
--         WHEN name LIKE 'Paint%' OR name LIKE 'Primer%' OR name LIKE 'Thinner%' OR name LIKE 'Turpentine%' THEN 'Paint Supplies'
--         WHEN name LIKE 'Measuring%' OR name LIKE '%Ruler%' OR name LIKE 'Level%' OR name LIKE '%Square%' OR name LIKE '%Caliper%' THEN 'Measuring Tools'
--         WHEN name LIKE 'Safety%' OR name LIKE 'Work Gloves%' OR name LIKE 'Dust Mask%' OR name LIKE 'Respirator%' THEN 'Safety Equipment'
--         WHEN name LIKE 'Wire Electrical%' OR name LIKE 'Extension%' OR name LIKE 'Socket%' OR name LIKE 'Switch%' OR name LIKE 'Light%' THEN 'Electrical'
--         WHEN name LIKE 'PVC%' OR name LIKE 'Tap%' OR name LIKE '%Valve%' OR name LIKE 'Flexible Hose%' THEN 'Plumbing'
--         WHEN name LIKE 'Cement%' OR name LIKE 'Sand%' OR name LIKE 'Gravel%' OR name LIKE 'Brick%' OR name LIKE 'Block%' OR name LIKE 'Tile%' THEN 'Building Materials'
--         WHEN name LIKE 'Wood%' OR name LIKE 'Plywood%' OR name LIKE 'MDF%' OR name LIKE 'Chipboard%' OR name LIKE 'Hardboard%' THEN 'Wood & Timber'
--         WHEN name LIKE 'Wall Plug%' OR name LIKE 'Anchor%' OR name LIKE 'Hook%' OR name LIKE 'Hinge%' OR name LIKE 'Lock%' OR name LIKE 'Handle%' THEN 'Fastening'
--         WHEN name LIKE '%Disc%' OR name LIKE '%Blade%' OR name LIKE '%Pad%' OR name LIKE '%Wheel%' THEN 'Power Tool Accessories'
--         WHEN name LIKE 'Chisel%' OR name LIKE 'Plane%' OR name LIKE 'Clamp%' OR name LIKE 'File%' OR name LIKE 'Trowel%' THEN 'Hand Tools'
--         WHEN name LIKE 'Spade%' OR name LIKE 'Shovel%' OR name LIKE 'Fork%' OR name LIKE 'Rake%' OR name LIKE 'Axe%' THEN 'Garden Tools'
--         WHEN name LIKE 'Broom%' OR name LIKE 'Mop%' OR name LIKE 'Brush%' OR name LIKE 'Lubricant%' THEN 'Cleaning'
--         ELSE 'Other'
--     END AS category,
--     COUNT(*) as product_count
-- FROM products
-- GROUP BY category
-- ORDER BY category;
