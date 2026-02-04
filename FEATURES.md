# Wimalarathne Hardware POS System - Complete Feature Guide

## 📱 Platform Support
- **Fully Mobile Responsive** - Works on phones, tablets, and desktop computers
- **Touch-Friendly Interface** - Optimized button sizes and layouts for touch screens
- **Adaptive Layout** - Automatically adjusts for screen size

---

## 🔐 Authentication & User Management

### User Registration
- Create new user accounts with username and password
- **Status-based Access Control**: All new registrations start with "pending" status
- Users must wait for admin approval before they can login
- Success message displayed after registration

### User Login
- Secure login with username and password validation
- **Status Check**: Only "approved" users can access the system
- Rejected or pending users cannot login
- Automatic redirect to POS system after successful login

### Admin User Management
- **Admin Dashboard** at `/admin/users`
- View all registered users with their status
- **User Approval System**:
  - Approve pending users (status: approved ✅)
  - Reject users (status: rejected ❌)
  - View user registration timestamps
- Color-coded status badges (Green=approved, Yellow=pending, Red=rejected)

---

## 🛒 POS (Point of Sale) System

### Product Search & Selection
- **Search by Product ID or Name**
- **Auto-focus Search**: Press `Ctrl+/` to focus search bar from anywhere
- **Quick Add by ID**: Type product ID and press Enter to add directly to cart
- **Quick Add by Search**: If search matches one product, press Enter to add it
- **Visual Product Grid**:
  - 3 columns on desktop, 2 on tablet, 1 on mobile
  - Product ID badge display
  - Real-time stock status (In stock / Low stock / Out of stock)
  - Color-coded stock indicators (Green/Orange/Red)
  - Click any product to add to cart

### Shopping Cart Management
- **Smart Cart Display**: Shows on top on mobile, on right side on desktop
- **Real-time Totals**:
  - Total amount (Rs.)
  - Product count
  - Item count
- **Price Editing**:
  - Click on any price to edit it
  - Auto-select text when editing (just type new value)
  - Press Enter to save, Esc to cancel
- **Quantity Management**:
  - Manual input field (auto-selects on click)
  - Plus button to increase
  - Minus button to decrease
  - Can't exceed available stock
- **Remove Items**: X button on each item
- **Keyboard Shortcuts for Last Cart Item**:
  - `+` key: Increase quantity
  - `-` key: Decrease quantity  
  - `Delete` or `Backspace`: Remove item

### Checkout Process
- **F9 Quick Checkout**: Press F9 from anywhere to checkout
- Click "Checkout" button
- Enter customer name (or leave blank for "Walk-in")
- Automatic bill generation with unique bill number
- Auto-redirect to receipt page
- Cart automatically clears after successful checkout
- Inventory automatically updated (stock reduced)

---

## 📦 Inventory Management

### Product Listing
- View all products in organized table
- **Search Products**: Real-time search by name or ID
- **Keyboard Shortcut**: `Ctrl+/` to focus search
- **Quick Add**: `Shift++` to open Add Product dialog
- **Product Information**:
  - Product ID (unique identifier)
  - Product Name
  - Price (Rs.)
  - Current Stock level

### Add New Products
- Click "Add Product" button or press `Shift++`
- Enter product details:
  - Product Name (required)
  - Price in rupees (supports decimals like 150.50)
  - Initial Stock quantity
- Instant addition to inventory
- Product immediately available in POS

### Edit Products
- Click Edit button (pencil icon) on any product
- Inline editing for:
  - Product Name
  - Price (step: 0.01 for accurate decimals)
  - Stock quantity
- Save or Cancel buttons
- Changes reflect immediately across system

---

## 📊 Bill History & Reports

### View Sales History
- **Access**: Click "History" button or press `Ctrl+H`
- **Search Bills**: 
  - Search by bill number
  - Search by customer name
  - Press `Ctrl+/` to focus search
- **Date Filters**:
  - All (complete history)
  - Today
  - Yesterday
  - Last 7 Days
  - Last 30 Days
  - Custom Date Range (select start and end dates)
- **Sort Options**:
  - Newest First (default)
  - Oldest First
- **Bill Information Display**:
  - Bill Number
  - Customer Name
  - Total Amount
  - Number of Items
  - Date & Time
  - Complete item list (expandable)

### Bill Details
- Click on any bill to see full details
- View all purchased items with quantities and prices
- See subtotals and grand total
- Timestamp information

---

## 🧾 Receipt System

### Receipt Display
- **Auto-Print**: Receipt automatically prints when page loads
- **Professional Thermal Receipt Format**:
  - 80mm width (standard thermal printer)
  - Company header with name and address
  - Contact information (Phone & Email)
  - Bill number and timestamp
  - Customer name
  - Itemized product list with quantities
  - Subtotals and Grand Total
  - Thank you message

### Receipt Actions
- **Print Button**: Reprint receipt anytime
- **Download Button**: Save receipt as CSV file for records
- **Return to POS Button**: Go back to POS system
- **Auto-Navigation**: Automatically returns to POS after printing
- **Keyboard Shortcut**: Press `ESC` to return to POS immediately

---

## ⌨️ Keyboard Shortcuts

### Global Shortcuts (Work from Anywhere)
- `Ctrl+/` - Focus search bar
- `F9` - Quick checkout
- `Ctrl+H` - Go to History page
- `Ctrl+I` - Go to Inventory page
- `Ctrl+L` - Logout
- `Ctrl+?` - Show keyboard shortcuts help
- `ESC` - Close dialogs / Cancel edits / Return to POS (on receipt page)

### Cart Management Shortcuts
- `+` - Increase quantity of last cart item
- `-` - Decrease quantity of last cart item
- `Delete` or `Backspace` - Remove last item from cart

### Inventory Shortcuts
- `Shift++` - Open Add Product dialog
- `Ctrl+/` - Focus product search

### POS Product Search
- Type product ID + `Enter` - Add product by ID
- Search text + `Enter` - Add product if single match

---

## 🎯 Tab Navigation Order

Optimized keyboard navigation flow:
1. **Tab 1**: Search input (add products)
2. **Tab 2**: Checkout button
3. **Tab 3**: Price edit input (when editing)
4. **Tab 4**: Quantity manual input
5. **Tab 5**: Returns to Search input (cycles)

Note: Plus/Minus buttons excluded from Tab order for streamlined workflow

---

## 🎨 Professional Design Features

### Color Scheme
- **Primary Color**: Blue-600 (#2563eb)
- **Professional Gray Scale**: No pure black colors used
- **Text Colors**: Gray-900 for darkest text (#111827)
- **Status Colors**:
  - Success/Approved: Green-600
  - Warning/Pending: Yellow-500
  - Error/Rejected: Red-600
- **Accessible Contrast**: All colors meet WCAG accessibility standards

### Visual Elements
- Gradient headers (Blue-600 to Blue-700)
- White content cards with shadow
- Color-coded status badges
- Icon-based navigation
- Stock level indicators with colors
- Professional receipt styling

### Mobile Optimizations
- Icon-only buttons on small screens
- Text appears on medium+ screens
- Responsive padding (3px mobile, 6px desktop)
- Smaller text sizes on mobile
- Wrap-friendly button layouts
- Touch-friendly 44px minimum button size
- Horizontal scrolling for wide tables

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Passwords encrypted with bcrypt
- **Protected Routes**: Middleware checks authentication
- **Session Management**: Auto-logout on token expiry
- **Admin-Only Access**: User management restricted to admins
- **Status-Based Access Control**: Three-tier user status system

---

## 💾 Database Features

### Neon PostgreSQL Integration
- Serverless PostgreSQL database
- Connection pooling for performance
- TIMESTAMPTZ for accurate timestamps

### Database Schema
**Users Table**:
- id (primary key)
- username (unique)
- password_hash
- status (pending/approved/rejected)
- created_at (timestamp)

**Products Table**:
- id (primary key)
- name
- price (decimal)
- stock (integer)
- created_at (timestamp)
- updated_at (timestamp)

**Bills Table**:
- id (primary key)
- bill_no (unique)
- customer_name
- items (JSONB - flexible item storage)
- total_amount (decimal)
- created_at (timestamp)

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
  - Single column layouts
  - Icon-only navigation
  - Cart appears above products
  - Stacked forms

- **Tablet**: 640px - 1024px (md)
  - Two-column product grid
  - Text appears in navigation
  - Balanced layouts

- **Desktop**: > 1024px (lg)
  - Three-column product grid
  - Side-by-side cart and products
  - Full navigation with shortcuts
  - Optimal spacing

---

## 🚀 Performance Features

- **Next.js 16** with Turbopack for fast development
- **Server Components** for optimal loading
- **Real-time Updates**: Inventory updates immediately after checkout
- **Session Storage**: Receipt data cached for fast display
- **Optimized Images**: Next.js automatic image optimization
- **Code Splitting**: Automatic by Next.js App Router

---

## 📋 Business Information

**Store Name**: Wimalarathne Hardware  
**Address**: 213/1F, Medalanda, Dompe  
**Phone**: 0778-683-489  
**Email**: wimalarathne@hardware.lk

---

## 🛠️ Technical Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Database**: Neon PostgreSQL (Serverless)
- **Authentication**: JWT with jose library
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

---

## 📖 User Workflow Examples

### Example 1: New Sale
1. Customer enters store
2. Cashier presses `Ctrl+/` to focus search
3. Types product ID "123" and presses Enter
4. Product added to cart
5. Cashier clicks quantity and types "3"
6. Presses Tab to move to next field
7. Presses F9 to checkout
8. Enters customer name "John Doe"
9. Receipt prints automatically
10. Page returns to POS automatically

### Example 2: Price Adjustment
1. Product added to cart at Rs. 500
2. Customer negotiates discount
3. Cashier clicks on "Rs. 500.00" in cart
4. Text auto-selects
5. Types "450" and presses Enter
6. New price Rs. 450.00 saved

### Example 3: Daily Report
1. Manager presses `Ctrl+H`
2. Clicks "Today" filter
3. Sees all today's sales
4. Clicks on bill to see details
5. Reviews total amount and items sold

### Example 4: Stock Management
1. Staff member presses `Ctrl+I`
2. Searches for "hammer"
3. Clicks Edit on "Claw Hammer"
4. Updates stock from 5 to 20
5. Clicks Save
6. Product immediately available in POS with new stock

---

## 🎯 Key Benefits

✅ **Fast Operation**: Keyboard shortcuts for all common tasks  
✅ **Error Prevention**: Stock validation, status checks, auto-calculations  
✅ **Mobile Ready**: Works on any device, anywhere in store  
✅ **User Friendly**: Intuitive interface with visual feedback  
✅ **Secure**: Multiple security layers protect data  
✅ **Scalable**: Serverless architecture handles growth  
✅ **Professional**: Clean design builds customer trust  
✅ **Comprehensive**: Complete POS solution in one system  

---

**Last Updated**: February 5, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
