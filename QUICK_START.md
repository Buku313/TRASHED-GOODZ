# ⚡ QUICK START - Upload Products in 3 Easy Steps

## Step 1: Get Free API Key (2 minutes)

1. Go to https://jsonbin.io
2. Sign up free (just email + password)
3. Click "API Keys" → "Create Access Key"
4. Copy the API key (starts with `$2a$10$...`)

## Step 2: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Add product upload system"
git push
```

## Step 3: Open Admin Panel (1 minute)

1. Go to: `https://yourusername.github.io/yourrepo/admin-panel.html`
2. **First time only**: Paste your API key from Step 1
3. Set a password (or use default: `trashedgoods2008`)
4. Click "Save & Continue"
5. Login and start adding products!

---

## That's It! 🎉

Now you can:
- ✅ Upload products with images (stored on Imgur - free!)
- ✅ Manage inventory (draft/published/sold statuses)
- ✅ Edit and delete products
- ✅ Products automatically appear on your store

---

## How It Works

**Your Setup:**
- Admin panel hosted on GitHub Pages
- API key stored in your browser (never committed to Git)
- Products saved to JSONBin.io (free database)
- Images uploaded to Imgur (free hosting)

**100% Free. No Credit Card. Forever.**

---

## Need to Change Settings?

Click the ⚙️ Settings icon (top right) in the admin panel to:
- Update your API key
- Change your password
- View your Bin ID

---

## Add Products to Your Store

In your [index.html](index.html), add these lines before `</head>`:

```html
<script src="db-config.js"></script>
<script src="db-api.js"></script>
<script src="store-frontend.js"></script>
```

Products will automatically load from your database!

---

Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed documentation and troubleshooting.
