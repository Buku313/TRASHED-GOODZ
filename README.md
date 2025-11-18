# TRASHEDGOODS.STORE

A nostalgic 2008-style eBay marketplace built with classic HTML tables and minimal CSS.

## Live Site

Visit the store at: https://buku313.github.io/TRASHED-GOODZ/

## Admin Access

**Login Page:** https://buku313.github.io/TRASHED-GOODZ/login.html

**Default Credentials:**
- Username: `admin`
- Password: `trashedgoods2008`

## 🚀 Auto-Save Feature (Seamless Experience)

**NEW!** Changes now automatically save to GitHub and go live in 1-2 minutes!

### Setup Auto-Save (One-Time Configuration)

1. **Create GitHub Token:** https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Enable "repo" permission
   - Copy the token

2. **Configure (LOCAL ONLY):**
   ```bash
   cp github-config.example.js github-config.js
   ```
   Then edit `github-config.js` and paste your token (this file is gitignored - never commit it!)

3. **Done!** Now when you add/edit/delete items in the admin panel, they automatically save to GitHub!

**See [SETUP_AUTO_SAVE.md](SETUP_AUTO_SAVE.md) for detailed instructions.**

## How to Update Products

### With Auto-Save (Recommended)
1. Login to admin panel
2. Make your changes (add/edit/delete items, categories, etc.)
3. Wait 2 seconds - you'll see "✓ Saved to GitHub!"
4. Done! Changes go live in 1-2 minutes

### Manual Method (If Auto-Save Not Configured)
1. Login to admin panel
2. Make your changes
3. Click "Export Data to File"
4. Save as `data.json` and replace the file in your repo
5. Commit and push to GitHub

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
