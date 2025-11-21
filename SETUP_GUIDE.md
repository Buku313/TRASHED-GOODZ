# 🚀 EASY SETUP GUIDE - Product Upload System

## What You're Getting

A **super simple** admin panel to upload and manage products for your GitHub Pages store:

- ✅ Password-protected admin panel
- ✅ Upload product images (free image hosting via Imgur)
- ✅ Save products to free database (JSONBin.io)
- ✅ **API key stored in browser** (not in code!)
- ✅ No backend server needed!
- ✅ Works perfectly with GitHub Pages

---

## 3-Step Setup

### Step 1: Get a Free JSONBin API Key

1. Go to https://jsonbin.io
2. Click **"Sign Up Free"** (just email + password, no credit card!)
3. After login, click **"API Keys"** in the sidebar
4. Click **"Create Access Key"**
5. **Copy the API Key** (looks like: `$2a$10$abc123...`)
6. Keep this handy - you'll need it in Step 3

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Add product upload system"
git push
```

Wait 1-2 minutes for GitHub Pages to deploy.

### Step 3: Open Admin Panel & Configure

1. Go to: `https://yourusername.github.io/yourrepo/admin-panel.html`
2. You'll see a welcome screen!
3. **Paste your API key** from Step 1
4. **Set a password** (or leave blank to use default: `trashedgoods2008`)
5. Click **"Save & Continue"**
6. Login and start adding products!

**That's it!** Your API key is saved in your browser's localStorage. You never have to enter it again!

---

## How to Use

### Add a Product

1. Open [admin-panel.html](admin-panel.html) (on GitHub Pages)
2. Login with your password
3. Fill in product details:
   - **Name** (required)
   - **Description**
   - **Price** (required) in dollars
   - **Category** (required) - pick from dropdown
   - **Condition** (new/used/refurbished)
   - **Stock** quantity
4. Click **"📷 Click to upload images"**
   - Select 1 or more images from your computer
   - Images are compressed and uploaded to Imgur
   - Wait for "Images uploaded successfully!"
5. Choose:
   - **"✅ Save & Publish"** - Makes it live on your store immediately
   - **"💾 Save as Draft"** - Saves but keeps it hidden

### Manage Products

Your products appear below the add form:

- **Edit** - Click Edit, make changes, save again
- **Publish** - Turn a draft into a live product
- **Mark Sold** - Archives the product (no longer visible on store)
- **Delete** - Permanently removes the product

---

## Product Statuses

- **📝 Draft**: Saved but not visible on your store
- **✅ Published**: Live and visible to customers
- **🎉 Sold**: Archived (no longer shown on store)

---

## Settings

Click the **⚙️ Settings** icon (top right) in admin panel to:

- Update your JSONBin API key
- Change your admin password
- View your database Bin ID

---

## How It Works

### The Magic:
1. **Admin Panel**: Hosted on GitHub Pages (free static hosting)
2. **API Key**: Stored in your browser's localStorage (never in code)
3. **Products**: Saved to JSONBin.io cloud database (free 100k requests/month)
4. **Images**: Uploaded to Imgur CDN (free unlimited images)
5. **Your Store**: Loads products from JSONBin automatically

### Security:
- ✅ API key never committed to Git (stays in your browser)
- ✅ Password required to access admin panel
- ✅ Database is private (requires your API key)
- ✅ Only you can edit products

---

## Add Products to Your Store

Your storefront ([index.html](index.html)) needs to load products from the database.

Add these lines before `</head>`:

```html
<script src="db-config.js"></script>
<script src="db-api.js"></script>
<script src="store-frontend.js"></script>
```

Make sure you have an element with `id="store-items"` where products should display:

```html
<table>
    <tbody id="store-items">
        <!-- Products load here automatically -->
    </tbody>
</table>
```

---

## Free Services Used

### JSONBin.io (Database)
- **Free tier**: 100,000 API requests/month
- **Storage**: Unlimited bins
- **No credit card needed**
- Your products are stored here as JSON

### Imgur (Image Hosting)
- **Free tier**: Unlimited uploads
- **Anonymous uploads** (no account needed)
- **Fast CDN**: Images load quickly worldwide
- Professional image hosting

### Cost: **$0/month forever** ✨

---

## Troubleshooting

### First Time Setup Issues

**"Please configure your JSONBin API key"**
- Make sure you completed the setup wizard
- Check that you pasted the API key correctly
- API key should start with `$2a$10$`

**Can't see setup wizard**
- Clear browser cache and reload
- Try in incognito/private mode
- Make sure admin-panel.html loaded from GitHub Pages

### Login Issues

**"Incorrect password"**
- Use the password you set in the setup wizard
- Default password is: `trashedgoods2008`
- Click ⚙️ Settings to change password

**Forgot password**
- Open browser console (F12)
- Type: `localStorage.clear()` and press Enter
- Reload the page - you'll see setup wizard again

### Product Issues

**Images not uploading**
- Check internet connection
- Try smaller images (< 5MB)
- Make sure file is JPG or PNG
- Check browser console (F12) for errors

**Products not showing on store**
- Make sure product status is "published"
- Check stock is > 0
- Verify store-frontend.js is loaded in index.html
- Refresh the page (Ctrl+F5)

**Can't save products**
- Check API key is configured (click ⚙️ Settings)
- Check internet connection
- Check browser console for errors

---

## Advanced Tips

### Using Multiple Browsers/Devices

The API key is stored in your browser. To access admin panel from another device:

1. Open admin-panel.html on new device
2. You'll see setup wizard again
3. Enter the same API key
4. All your products will load!

### Backup Your Data

JSONBin keeps your data safe, but you can export:

1. Login to jsonbin.io
2. Go to "Bins" section
3. Find "trashedgoods-products"
4. Click "View" and copy the JSON
5. Save to a file on your computer

### Custom Categories

Default categories:
- Electronics, Fashion, Home & Garden, Collectibles, Sports, Music, Books, Toys, Other

To add more, edit [db-api.js:186](db-api.js#L186):

```javascript
categories: [
    'Electronics',
    'Fashion',
    'Your New Category',  // ← Add here
    'Home & Garden',
    ...
]
```

Commit and push the change.

### Image Optimization

Images are auto-compressed to 800px max width at 80% quality.

To change, edit [db-api.js:149](db-api.js#L149):

```javascript
async compressImage(file, maxWidth = 1200, quality = 0.9) {
    // Change maxWidth or quality here
}
```

---

## Files Included

```
your-repo/
├── admin-panel.html          (★ Admin interface)
├── db-config.js              (★ Config - safe to commit)
├── db-api.js                 (★ Database handler)
├── store-frontend.js         (★ Loads products on store)
├── index.html                (Your store - add scripts here)
├── QUICK_START.md            (Quick setup guide)
└── SETUP_GUIDE.md            (This file - detailed docs)
```

---

## FAQ

**Q: Can I use this with my existing store?**
Yes! Just add the scripts to your index.html and products will load.

**Q: What happens if I reach the 100k request limit?**
Very unlikely unless you have massive traffic. If you do, upgrade JSONBin ($5/month for 1M requests) or switch to another free service.

**Q: Are my products backed up?**
Yes! JSONBin stores your data safely. You can also export manually anytime.

**Q: Can multiple admins manage products?**
Yes! Share your API key and password with trusted people. They can access from any browser.

**Q: Can I sell actual products with this?**
This is a product listing system. For actual payments, integrate Stripe, PayPal, or use "Contact to Buy" buttons.

**Q: Does this work offline?**
No, it needs internet to save/load products from JSONBin and upload images to Imgur.

---

## Next Steps

1. ✅ Complete the 3-step setup
2. ✅ Add your first product with images
3. ✅ Test it live on your store
4. 🎨 Customize store-frontend.js to match your design
5. 📱 Share your store URL!

---

**Questions?** Check browser console (F12) for error messages.

**Made for TRASHEDGOODS.STORE** 🛒
Simple. Free. Works Forever.
