// Shared inventory loader for the storefront and detail pages
const INVENTORY_SOURCE_PATH = 'data/products.json';

async function fetchInventoryData() {
    if (window.__trashedGoodsData) {
        return window.__trashedGoodsData;
    }

    const response = await fetch(INVENTORY_SOURCE_PATH);
    if (!response.ok) {
        throw new Error(`Unable to load inventory (${response.status})`);
    }

    const data = await response.json();
    window.__trashedGoodsData = data;
    return data;
}
