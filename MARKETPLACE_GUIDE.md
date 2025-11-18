# 🛒 TRASHEDGOODS.STORE Marketplace System Guide

## 🎯 What's New?

Your store has been upgraded from a basic listing site to a **full marketplace system** with:

- ✅ **Product Upload with Images** - Upload photos directly from the admin panel
- ✅ **Draft/Published Workflow** - Save products as drafts before publishing
- ✅ **Inventory Management** - Track stock levels for each product
- ✅ **Status System** - Mark items as draft, published, or sold
- ✅ **Image Compression** - Automatic compression to keep your site fast
- ✅ **GitHub Storage** - All images stored in your repository
- ✅ **Sales Dashboard** - Track revenue and inventory at a glance

---

## 🚀 Quick Start

### Step 1: Access the New Manager Panel

Open **marketplace-admin.html** instead of admin.html:
- Login with same credentials: `admin` / `trashedgoods2008`
- You'll see a new dashboard with stats and tabs

### Step 2: Upload Your First Product

1. Click the **"Add Product"** tab
2. Fill in product details:
   - **Name**: Product title
   - **Description**: Full description (optional but recommended)
   - **Price**: In dollars (e.g., 49.99)
   - **Category**: Select from dropdown
   - **Condition**: New, Used, or Refurbished
   - **Stock**: How many available
3. Click **"📷 Click to Upload Images"**
   - Select one or more images (JPG, PNG)
   - Images are automatically compressed
   - Wait for "Images uploaded successfully!"
4. Choose:
   - **💾 Save as Draft** - Keep private, not visible to customers
   - **✅ Save & Publish** - Make live immediately

### Step 3: Manage Products

**Drafts Tab**: Products not yet public
- Edit before publishing
- Perfect for products you're still photographing

**Published Tab**: Live products visible to customers
- Edit anytime
- Unpublish to make private again
- Mark as Sold when item sells

---

## 📊 Dashboard Overview

### Statistics Tracked:
- **Draft Products**: Items saved but not published
- **Published**: Live items available for sale
- **Sold**: Items marked as sold
- **Total Stock**: Combined inventory of all published items
- **Total Revenue**: Sum of all sold item prices
- **Total Orders**: Number of sales

---

## 🖼️ Image Management

### How Image Upload Works:
1. You select images from your computer
2. JavaScript compresses them to **max 800x800px** at **80% quality**
3. Images are uploaded to GitHub in the `/images` folder
4. GitHub returns a permanent URL
5. URL is saved with your product

### Image Requirements:
- **Formats**: JPG, PNG (will be converted to JPG)
- **Size**: Any size (auto-resized to 800x800 max)
- **Count**: Upload multiple images per product
- **Storage**: All images stored in your GitHub repo

### Tips for Best Results:
- Use clear, well-lit photos
- Square photos work best (1:1 ratio)
- Compress large images before upload for faster processing
- First image becomes the main thumbnail

---

## 🔄 Product Workflow

### Draft → Published → Sold

```
[Create Product]
     ↓
💾 Save as Draft ----→ ✅ Publish
     ↑                      ↓
     |                [Visible on Store]
     |                      ↓
     └──── Unpublish ←─────┤
                            ↓
                      Mark as Sold
                            ↓
                      [Archived]
```

### Actions Available:

**On Draft Products:**
- Edit - Modify details
- Publish - Make live
- Delete - Remove permanently

**On Published Products:**
- Edit - Update details (stays published)
- Unpublish - Move back to drafts
- Mark Sold - Archive and add to sales
- Delete - Remove permanently

---

## 📦 Data Structure

### New Format:
```json
{
  "products": [
    {
      "id": "uuid-string",
      "name": "Product Name",
      "description": "Full description",
      "price": 99.99,
      "images": ["https://...image1.jpg", "https://...image2.jpg"],
      "category": "Electronics",
      "status": "published",
      "stock": 5,
      "condition": "new",
      "createdAt": "2025-01-15T12:00:00.000Z",
      "updatedAt": "2025-01-15T12:00:00.000Z"
    }
  ],
  "categories": [...],
  "orders": [...]
}
```

### Backward Compatibility:
- Your **index.html** can still use the old store.js
- Or switch to **marketplace-store.js** for new features
- Old data format is automatically converted

---

## 🔧 Technical Details

### Files Added:
- **marketplace-admin.html** - New manager interface
- **marketplace-admin.js** - Product management logic
- **marketplace-store.js** - Enhanced frontend
- **image-utils.js** - Image compression & upload
- **images/** folder - Stores uploaded images

### Files Updated:
- **data.json** - Now includes products array
- **github-api.js** - Already supports image uploads

### Auto-Save Feature:
- Works exactly like before
- Saves to GitHub after 2-second delay
- All changes (products, categories, orders) saved together

---

## 🛠️ Advanced Features

### Category Management:
- Add/edit/delete categories from the Categories tab
- Categories automatically update product dropdown
- Default categories provided

### Inventory Tracking:
- Stock decreases when marked as sold
- Out-of-stock items can stay published (shows "0 in stock")
- Edit stock levels anytime

### Order Tracking:
- When you mark a product as sold, an order record is created
- Orders stored in data.json
- Track all sales over time

---

## 🔐 Security Notes

### GitHub Token:
- **CRITICAL**: Never commit github-config.js with real token
- Token is already in your .gitignore
- If exposed, revoke and regenerate immediately

### Image Permissions:
- Images are public once uploaded to GitHub
- Anyone with the URL can view them
- Don't upload sensitive/private photos

---

## 🎨 Customization Ideas

### Enhance the Frontend:
- Update index.html to show product descriptions
- Add "Buy Now" buttons
- Implement shopping cart
- Add product detail pages

### Add Features:
- Customer accounts
- Payment integration (Stripe/PayPal)
- Email notifications
- Product reviews
- Search functionality

### Improve Workflow:
- Bulk upload products
- Import from CSV
- Scheduled publishing
- Duplicate products

---

## 📱 Mobile Compatibility

The marketplace system works on mobile browsers:
- Upload images from phone camera
- Manage products on the go
- Responsive tables (may need horizontal scroll)

---

## 🐛 Troubleshooting

### Images Not Uploading:
1. Check github-config.js is configured
2. Verify GitHub token has "repo" permissions
3. Ensure images folder exists in repository
4. Check browser console for errors

### Products Not Showing:
1. Make sure product status is "published"
2. Check stock is greater than 0
3. Verify data.json is updated on GitHub
4. Clear browser cache and reload

### Auto-Save Not Working:
1. Verify github-config.js is loaded
2. Check token is valid (not expired/revoked)
3. Ensure internet connection is stable
4. Use manual "Save to GitHub Now" button

---

## 📚 Migration from Old System

### Keep Old System:
- Keep using admin.html for basic edits
- Both systems can coexist
- Old data automatically converted

### Full Migration:
1. Backup your data (export from admin.html)
2. Open marketplace-admin.html
3. Add products with full details
4. Upload images for each
5. Publish when ready
6. Update index.html to load marketplace-store.js instead of store.js

### Hybrid Approach:
- Use marketplace-admin.html for new products
- Keep old products as-is
- Gradually migrate as you add images

---

## 💡 Best Practices

### Product Naming:
- Use descriptive titles
- Include brand/model if applicable
- Keep under 60 characters for best display

### Pricing:
- Be consistent with decimal places (e.g., 19.99 not 19.9)
- Include shipping in price or mention in description
- Update prices before publishing

### Images:
- Use 3-5 images per product
- Show multiple angles
- Include close-ups of details
- Use natural lighting

### Categories:
- Create 5-10 main categories
- Keep names short and clear
- Use logical groupings

### Stock Management:
- Update stock when items sell
- Set realistic quantities
- Use 0 for out-of-stock (keeps listing visible)
- Use "Mark Sold" to archive completely

---

## 🎯 Next Steps

1. **Test the system**: Upload a test product with image
2. **Configure auto-save**: Ensure github-config.js is set up
3. **Migrate products**: Add images to existing items
4. **Customize**: Update index.html styling/layout
5. **Go live**: Share your store URL!

---

## 📞 Need Help?

- Check browser console for errors (F12)
- Review this guide thoroughly
- Test with dummy products first
- Keep backups of data.json

---

**Built for TRASHEDGOODS.STORE** | 2008 Style, 2025 Features ✨
