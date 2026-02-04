# Professional Color Scheme Guide
## Wimalarathne Hardware POS System

### 🎨 Primary Colors

#### Blue (Primary Brand Color)
- **blue-600** `#2563eb` - Primary buttons, headers, active states
- **blue-700** `#1d4ed8` - Hover states, gradients
- **blue-500** `#3b82f6` - Focus borders, links
- **blue-100** `#dbeafe` - Light backgrounds, subtle accents
- **blue-50** `#eff6ff` - Very light backgrounds

**Usage:**
- Main navigation headers: `bg-gradient-to-r from-blue-600 to-blue-700`
- Primary buttons: `bg-blue-600 hover:bg-blue-700`
- Focus states: `focus:border-blue-600 focus:ring-blue-600`
- Product ID badges: `bg-blue-600 text-white`
- Active filter buttons: `bg-blue-600`

---

### ✅ Success Colors (Green)

#### Green (Actions & Success)
- **green-600** `#16a34a` - Success buttons, add actions
- **green-700** `#15803d` - Hover states
- **green-50** `#f0fdf4` - Success alert backgrounds
- **green-200** `#bbf7d0` - Success borders
- **green-900** `#14532d` - Success text

**Usage:**
- Add Product button: `bg-green-600 hover:bg-green-700`
- Success messages: `bg-green-50 text-green-900 border-green-200`
- Increment buttons: `bg-green-600 hover:bg-green-700`

---

### ❌ Danger/Error Colors (Red)

#### Red (Destructive Actions)
- **red-600** `#dc2626` - Danger buttons, error states
- **red-700** `#b91c1c` - Hover states
- **red-50** `#fef2f2` - Error backgrounds
- **red-200** `#fecaca` - Error borders
- **red-900** `#7f1d1d` - Error text

**Usage:**
- Logout button: `bg-red-600 hover:bg-red-700`
- Delete/Remove buttons: `bg-red-600 hover:bg-red-700`
- Error alerts: `bg-red-50 text-red-900 border-red-200`
- Decrement buttons: `bg-red-600 hover:bg-red-700`

---

### 📝 Text Colors (Gray Scale)

#### Gray (Text & Backgrounds)
- **gray-900** `#111827` - Primary text, headings, input text
- **gray-800** `#1f2937` - Secondary headings, table text
- **gray-700** `#374151` - Labels
- **gray-600** `#4b5563` - Secondary text, descriptions
- **gray-400** `#9ca3af` - Placeholder text, icons
- **gray-300** `#d1d5db` - Borders, dividers
- **gray-200** `#e5e7eb` - Light borders, table borders
- **gray-100** `#f3f4f6` - Light backgrounds, hover states
- **gray-50** `#f9fafb` - Page backgrounds

**Usage:**
- Main text: `text-gray-900`
- Labels: `text-gray-900 font-semibold`
- Placeholders: `placeholder:text-gray-400`
- Borders: `border-gray-300`
- Page background: `bg-gray-50`
- Card backgrounds: `bg-white`
- Table rows hover: `hover:bg-gray-50`

---

### 🎯 Component-Specific Colors

#### Headers/Navigation
```tsx
className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
```

#### Buttons

**Primary:**
```tsx
className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
```

**Success:**
```tsx
className="bg-green-600 hover:bg-green-700 text-white font-semibold"
```

**Danger:**
```tsx
className="bg-red-600 hover:bg-red-700 text-white font-semibold"
```

**Outline:**
```tsx
className="border-2 border-gray-300 hover:bg-gray-100 text-gray-900"
```

#### Inputs/Forms
```tsx
className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
```

#### Cards
```tsx
className="bg-white shadow-md border border-gray-200 rounded-lg"
```

#### Tables

**Header:**
```tsx
className="bg-gray-50 text-gray-900 font-bold"
```

**Rows:**
```tsx
className="border-b border-gray-200 hover:bg-gray-50"
```

**Cell Text:**
```tsx
className="text-gray-900"
```

#### Alerts

**Success:**
```tsx
className="bg-green-50 text-green-900 border-green-200"
```

**Error:**
```tsx
className="bg-red-50 text-red-900 border-red-200"
```

**Info:**
```tsx
className="bg-blue-50 text-blue-900 border-blue-200"
```

#### Badges

**Status Approved:**
```tsx
className="px-3 py-1 rounded-full bg-green-50 text-green-600 font-medium"
```

**Status Pending:**
```tsx
className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 font-medium"
```

**Status Rejected:**
```tsx
className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-medium"
```

**Product ID:**
```tsx
className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold"
```

---

### 🔄 Interactive States

#### Focus States
```tsx
focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none
```

#### Hover States
- Buttons: Add 100 to color value (600 → 700)
- Cards: `hover:shadow-md hover:border-blue-500`
- Table rows: `hover:bg-gray-50`

#### Active States
```tsx
active:scale-95
```

#### Disabled States
```tsx
disabled:opacity-50 disabled:cursor-not-allowed
```

---

### 📏 Consistent Sizing

#### Heights
- Standard input: `h-11`
- Search box: `h-12`
- Small buttons: `h-8` or `h-9`
- Standard buttons: `h-11`

#### Text Sizes
- Page titles: `text-2xl` or `text-3xl`
- Section headings: `text-xl`
- Card titles: `text-lg`
- Body text: `text-base`
- Small text: `text-sm`
- Extra small: `text-xs`

#### Font Weights
- Headers: `font-bold`
- Labels: `font-semibold`
- Body: `font-normal` (default)
- Emphasis: `font-medium`

---

### ✨ Best Practices

1. **Consistency**: Always use the same color for the same action
   - Add/Create: Green-600
   - Edit: Blue-600
   - Delete/Remove: Red-600
   - Cancel: Gray-300 outline

2. **Accessibility**: Ensure proper contrast ratios
   - Dark text (gray-900) on white backgrounds
   - White text on blue-600/green-600/red-600 backgrounds

3. **Visual Hierarchy**:
   - Primary actions: Solid blue-600
   - Secondary actions: Outline buttons
   - Destructive actions: Solid red-600

4. **Spacing**: Use consistent padding and margins
   - Page padding: `p-6`
   - Card padding: `p-4` or `p-6`
   - Button gaps: `gap-2` or `gap-3`

5. **Borders**: Use 2px borders for important interactive elements
   - Inputs: `border-2 border-gray-300`
   - Cards: `border border-gray-200`
   - Focus: `border-2 border-blue-600`

---

### 🎭 Dark Mode (Future Consideration)

Currently using light theme. For dark mode, consider:
- Background: `bg-gray-900`
- Cards: `bg-gray-800`
- Text: `text-gray-100`
- Borders: `border-gray-700`

---

### 📦 Component Classes Reference

```tsx
// Page Layout
<main className="min-h-screen bg-gray-50">

// Header
<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">

// Card
<Card className="bg-white shadow-md border border-gray-200">

// Primary Button
<Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11">

// Input Field
<Input className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400" />

// Table Header
<TableHead className="bg-gray-50 text-gray-900 font-bold">

// Table Row
<TableRow className="border-b border-gray-200 hover:bg-gray-50">
```

---

**Last Updated:** February 5, 2026
**Version:** 1.0
**Project:** Wimalarathne Hardware POS System
