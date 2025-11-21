# TRASHEDGOODS.STORE - Frontend Only

This folder contains **only the files needed** to display your store products on the front-end.

## 🎉 New Features

### ✅ Fully Featured Product Detail Pages
- Click any product to view detailed information
- Image gallery with thumbnail navigation
- Complete product specifications
- Add to cart functionality
- Breadcrumb navigation

## Files Included

1. **index.html** - The main store page (displays products)
2. **product-detail.html** - Individual product detail pages (NEW!)
3. **style.css** - Styling for the store
4. **db-config.js** - Database configuration helper
5. **db-api.js** - Database API for loading products from JSONBin
6. **store-frontend.js** - Frontend logic to display products

## How It Works

The store automatically:
1. Loads products from your JSONBin database
2. Filters to show only **published** products with stock > 0
3. Displays them in the "Featured Listings" section

## Setup

### Option 1: Use with existing JSONBin database

If you already have products in the admin panel:

1. Open `index.html` in your browser
2. Products will automatically load from your configured JSONBin database
3. Done!

### Option 2: Start fresh

If you want to start over:

1. Delete your localStorage data (in browser console):
   ```javascript
   localStorage.clear()
   ```
2. Open `index.html`
3. Go to admin panel to configure new JSONBin API key
4. Add products in admin panel
5. They'll appear on the frontend automatically

## No Admin Features

This folder does **NOT** include:
- ❌ Admin panel
- ❌ Login page
- ❌ Product upload/edit functionality
- ❌ Image upload system

It **ONLY** displays products that are already published.

## To Add/Edit Products

You need to use the enhanced admin panel:
1. Go back to the main project folder
2. Open `admin-panel.html`
3. Login and manage products there
4. Products will appear on this frontend automatically

**New Admin Features:**
- 📸 Drag & drop image upload (desktop)
- 📱 Mobile camera support
- 🖼️ Image reordering (drag thumbnails)
- 📊 Real-time progress bar
- ✨ Better compression (1200px, 85% quality)
- 🔄 Multi-service fallback (imgbb/Cloudinary/base64)

See [../IMAGE_UPLOAD_GUIDE.md](../IMAGE_UPLOAD_GUIDE.md) for complete guide.

## Hosting

You can host just these 5 files on any web server:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

The products will load from your JSONBin database automatically.

---

**This is a clean, minimal frontend** - perfect for deploying just the customer-facing store!
