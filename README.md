# TRASHEDGOODS.STORE - Frontend Only

This folder contains the **customer-facing storefront** for TRASHEDGOODS. It no longer talks to JSONBin or any hosted database—everything is driven from the local `data/products.json` file so you can keep the repo private and just edit one JSON file whenever you want to publish products.

## Files Included

1. **index.html** – Main store page that renders featured listings, categories, and highlights.
2. **product-detail.html** – Standalone detail view with gallery, specs, and stock indicator.
3. **style.css** – Shared styling for tables, buttons, and layout.
4. **inventory-data.js** – Shared helper that loads `data/products.json`.
5. **store-frontend.js** – Page logic for loading products, categories, and rendering the listing grid.
6. **data/products.json** – Source of truth for inventory. Contains demo products so the site works immediately.

## How It Works

1. `inventory-data.js` fetches `data/products.json` and caches it in `window.__trashedGoodsData`.
2. `store-frontend.js` renders categories, hot categories, and featured listings from that data.
3. `product-detail.html` reuses the same inventory file to show the individual product page.
4. All products must be marked with `"status": "published"` and have `stock > 0` to appear on the storefront.

The navigation bar includes a Dark Mode toggle that stores your preference in `localStorage`, so the theme persists between visits across both the storefront and product-detail pages via `theme-utils.js`.

## Inventory Data (JSON-Managed CMS)

When you need to add or update products, edit `data/products.json`. The file follows this shape:

```json
{
  "categories": ["Electronics", "Fashion", "Home & Garden"],
  "products": [
    {
      "id": "prod-005",
      "name": "Rebuilt Game Console",
      "description": "Been refurbished with new internals and a modern finish.",
      "price": 349.99,
      "condition": "used",
      "stock": 8,
      "status": "published",
      "category": "Electronics",
      "images": [
        "https://example.com/path/to/image.jpg"
      ]
    }
  ]
}
```

Key requirements:

- `id` should be unique for each product (it’s what the detail page uses).
- `price` can be a number or numeric string; the storefront formats it.
- `images` is an array of URLs; the first image is used for listings.
- `status` must be `"published"` and `stock` must be > 0 for the product to show up.

After editing `data/products.json`, reload `index.html` and every customer will immediately see the change. There is no admin panel or database configuration in this folder—this is a static JSON-managed CMS.

## Hosting

The folder can be deployed anywhere static files are supported (GitHub Pages, Netlify, Vercel, S3, etc.). Simply upload the files and ensure `data/products.json` is included. Because the data is local, the storefront works offline as long as the JSON file is present.

---

**This is a lean, front-end-only storefront**—perfect for a private rollout or quick demo where the catalog is maintained by editing one JSON file. Adjust `data/products.json`, commit, and redeploy whenever new inventory is ready.
