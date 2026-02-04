# Wimalarathne Hardware POS System

A modern, full-featured Point of Sale (POS) system built with Next.js 16, TypeScript, and PostgreSQL. Designed for retail hardware stores with mobile-first responsive design, real-time inventory management, and comprehensive sales tracking.

![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Tablet-blue)
![Framework](https://img.shields.io/badge/Framework-Next.js%2016-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL-316192)

## 🚀 Live Demo

**Deployment**: [Vercel](https://vercel.com)  
**Store**: Wimalarathne Hardware, 213/1F, Medalanda, Dompe

---

## ✨ Key Features

### 🔐 Authentication & User Management
- **Multi-tier User System**: Admin approval required for new registrations
- **Secure Login**: JWT-based authentication with bcrypt password hashing
- **User Status Control**: Pending, Approved, and Rejected user states
- **Admin Dashboard**: Full user management interface

### 🛒 Point of Sale (POS)
- **Quick Product Search**: Search by ID or name with instant results
- **Smart Cart Management**: Real-time totals, editable prices, quantity control
- **One-Key Checkout**: Press F9 to process payment instantly
- **Auto-Print Receipts**: Thermal receipt format (80mm) with auto-print
- **Stock Validation**: Prevents overselling with real-time stock checks

### 📦 Inventory Management
- **Product CRUD**: Full create, read, update operations
- **Real-time Search**: Instant filtering by name or ID
- **Inline Editing**: Quick updates without page reload
- **Stock Tracking**: Live inventory counts with color-coded alerts

### 📊 Sales History & Reports
- **Advanced Filtering**: Search by bill number, customer, or date range
- **Date Presets**: Today, Yesterday, Last 7/30 Days, Custom Range
- **Detailed Reports**: Complete transaction history with item breakdowns
- **Export Options**: CSV download for external reporting

### ⌨️ Keyboard Shortcuts
- **Productivity Focused**: 15+ keyboard shortcuts for common tasks
- **F9 Quick Checkout**: Fastest checkout in any POS system
- **Ctrl+/ Search Focus**: Jump to search from anywhere
- **Tab Navigation**: Optimized flow through cart and checkout

### 📱 Mobile Responsive
- **Fully Responsive**: Works on phones (320px+), tablets, and desktops
- **Touch Optimized**: Large buttons, easy-to-tap controls
- **Adaptive Layout**: Cart on top (mobile) or side (desktop)
- **Icon Navigation**: Space-efficient mobile interface

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16.0.10** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom theme
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Neon PostgreSQL** - Serverless Postgres database
- **Jose** - JWT token handling
- **Bcrypt** - Password hashing

### DevOps
- **Vercel** - Deployment and hosting
- **Git** - Version control
- **Vercel Analytics** - Performance monitoring

---

##  Project Structure

```
wimalarathne_hardware_pos_system/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── admin/           # Admin endpoints
│   │   ├── bills/           # Bill management
│   │   ├── checkout/        # Checkout process
│   │   ├── inventory/       # Inventory CRUD
│   │   ├── login/           # Authentication
│   │   ├── logout/          # Session management
│   │   ├── products/        # Product listing
│   │   └── register/        # User registration
│   ├── admin/               # Admin pages
│   │   └── users/           # User management
│   ├── auth/                # Login/Register page
│   ├── history/             # Sales history
│   ├── inventory/           # Inventory management
│   ├── pos/                 # Main POS interface
│   ├── receipt/             # Receipt display
│   ├── globals.css          # Global styles & theme
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── keyboard-help.tsx    # Shortcuts dialog
│   ├── pos-cart.tsx         # Shopping cart
│   └── pos-products.tsx     # Product grid
├── lib/                     # Utilities
│   ├── auth.ts              # JWT helpers
│   ├── db.ts                # Database queries
│   └── utils.ts             # Helper functions
├── scripts/                 # Database scripts
│   ├── init-db.sql          # Initial schema
│   └── migrate-add-price.sql # Migrations
├── public/                  # Static assets
├── COLOR-SCHEME.md          # Design system docs
├── FEATURES.md              # Complete feature guide
└── README.md               # This file
```

---

## ⌨️ Keyboard Shortcuts Reference

### Global Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+/` | Focus search bar |
| `F9` | Quick checkout |
| `Ctrl+H` | View history |
| `Ctrl+I` | Go to inventory |
| `Ctrl+L` | Logout |
| `Ctrl+?` | Show help |
| `ESC` | Close dialogs / Return to POS |

### Cart Operations
| Shortcut | Action |
|----------|--------|
| `+` | Increase last item quantity |
| `-` | Decrease last item quantity |
| `Delete` / `Backspace` | Remove last item |
| Click Price | Edit item price |
| Click Quantity | Edit item quantity |

### Inventory
| Shortcut | Action |
|----------|--------|
| `Shift++` | Add new product |
| `Ctrl+/` | Search products |

### POS Search
| Shortcut | Action |
|----------|--------|
| `ID + Enter` | Add product by ID |
| `Search + Enter` | Add if single match |

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue-600 (#2563eb)
- **Success**: Green-600 (#16a34a)
- **Warning**: Yellow-500 (#eab308)
- **Error**: Red-600 (#dc2626)
- **Text**: Gray-900 (#111827)
- **Background**: Gray-50 (#f9fafb)

### Typography
- **Font**: Geist (primary), Geist Mono (code)
- **Headings**: Bold, Blue-600
- **Body**: Gray-900

### Responsive Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

---

## 🔒 Security Features

- ✅ JWT-based authentication with secure tokens
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Protected API routes with middleware
- ✅ Admin-only user management endpoints
- ✅ Status-based access control (pending/approved/rejected)
- ✅ SQL injection protection via parameterized queries
- ✅ Session management with auto-logout

---

## 📱 Mobile Optimization

- ✅ Viewport meta tag for proper scaling
- ✅ Touch-friendly 44px minimum button size
- ✅ Responsive grid layouts (1/2/3 columns)
- ✅ Icon-only navigation on small screens
- ✅ Cart positioned above products on mobile
- ✅ Horizontal scroll for wide tables
- ✅ Adaptive padding and text sizes

---

## 📈 Performance

- ⚡ Server Components for fast initial load
- ⚡ Automatic code splitting by Next.js
- ⚡ Image optimization with next/image
- ⚡ Turbopack for development builds
- ⚡ Connection pooling for database
- ⚡ Session storage for receipt caching

---

## 📖 User Guide

### For Cashiers
1. Login with approved account
2. Search for products by ID or name
3. Add items to cart (click or Enter)
4. Adjust quantities or prices as needed
5. Press F9 or click Checkout
6. Enter customer name
7. Receipt prints automatically

### For Managers
1. Use Inventory (Ctrl+I) to add/update products
2. View History (Ctrl+H) for sales reports
3. Filter by date range for daily/weekly reports
4. Download CSV for external analysis

### For Admins
1. Access Admin Dashboard from top menu
2. Approve or reject pending users
3. Monitor user registration activity
4. Manage user access levels

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary software for Wimalarathne Hardware.

---

## 📞 Support & Contact

**Store Information:**
- **Name**: Wimalarathne Hardware
- **Address**: 213/1F, Medalanda, Dompe
- **Phone**: 0778-683-489
- **Email**: wimalarathne@hardware.lk

**Developer:**
- **GitHub**: [@Lahindu2001](https://github.com/Lahindu2001)
- **Repository**: [Wimalarathna_hardware_pos](https://github.com/Lahindu2001/Wimalarathna_hardware_pos)

---

## 🎯 Roadmap

### Current Version (1.0)
- ✅ Complete POS system
- ✅ Inventory management
- ✅ Bill history and reports
- ✅ User authentication and approval
- ✅ Mobile responsive design
- ✅ Keyboard shortcuts
- ✅ Receipt printing

### Planned Features
- 🔄 Barcode scanner integration
- 🔄 Multiple payment methods
- 🔄 Discount and promotion system
- 🔄 Employee shift management
- 🔄 Advanced analytics dashboard
- 🔄 SMS/Email receipt delivery
- 🔄 Multi-store support

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment platform
- Neon for serverless PostgreSQL
- Shadcn/ui for component inspiration
- Radix UI for accessible components
- Lucide for beautiful icons

---

**Built with ❤️ for Wimalarathne Hardware**  
**Version 1.0 | Production Ready ✅**  
**Last Updated: February 5, 2026**
