# TRASHEDGOODS.STORE

A nostalgic 2008-style eBay marketplace built with classic HTML tables and minimal CSS.

## Live Site

Visit the store at: https://buku313.github.io/TRASHED-GOODZ/

## Admin Access

**Login Page:** https://buku313.github.io/TRASHED-GOODZ/login.html

**Default Credentials:**
- Username: `admin`
- Password: `trashedgoods2008`

## How to Update Products (For Everyone to See)

Products are stored in `data.json` which is loaded by all visitors. To update products visible to everyone:

### Step 1: Login to Admin Panel
1. Go to the login page (or click "Admin" in the header)
2. Enter credentials (admin/trashedgoods2008)

### Step 2: Make Your Changes
- Add/edit/delete items in the "Manage Items" tab
- Customize categories in "Manage Categories" tab
- Update featured categories in "Hot Categories" tab

### Step 3: Export Your Changes
1. Click **"Export Data to File"** button
2. Save the downloaded file as `store-data.json`

### Step 4: Update GitHub Repository
1. Rename `store-data.json` to `data.json`
2. Replace the existing `data.json` in your repository
3. Commit and push:
   ```bash
   git add data.json
   git commit -m "Update store products"
   git push
   ```

### Step 5: Wait for GitHub Pages to Deploy
GitHub Pages will automatically rebuild your site (usually takes 1-2 minutes). Your changes will then be visible to everyone!

## Important Notes

- **Changes in admin panel are LOCAL only** - They're saved in your browser's localStorage
- **Everyone sees the data.json file** - You must export and commit to make changes public
- Admin session expires after 24 hours
- To change the admin password, edit `login.html` (lines 17-18)

## Files Structure

- `index.html` - Main store page
- `login.html` - Admin login page
- `admin.html` - Admin control panel
- `data.json` - **Product data (everyone sees this)**
- `store.js` - Frontend JavaScript (loads data.json)
- `admin.js` - Admin panel JavaScript
- `style.css` - 2008-style CSS

## Features

- 2008 eBay-inspired design with heavy HTML tables
- Password-protected admin panel
- Manage featured items, categories, and hot categories
- Export/import functionality for data persistence
- Works on GitHub Pages (static hosting)

## Tech Stack

- Pure HTML (XHTML 1.0 Transitional)
- Vanilla JavaScript (ES5 for compatibility)
- Minimal CSS
- localStorage for admin editing
- JSON file for public data storage

---

**2008 TRASHEDGOODS.STORE Inc. All Rights Reserved.**
