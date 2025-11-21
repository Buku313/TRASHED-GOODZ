// Storefront logic that reads inventory from a local JSON file

function populateStoreMetadata(data) {
    if (!data) {
        renderCategories([]);
        renderHotCategories([]);
        return;
    }

    const categories = Array.isArray(data.categories) ? data.categories : [];
    renderCategories(categories);
    renderHotCategories(getHotCategories({ products: data.products || [], categories }));
}

function renderCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;

    if (categories.length === 0) {
        container.innerHTML = '<span>No categories configured yet.</span>';
        return;
    }

    container.innerHTML = categories.map(category => `
        <a href="index.html?category=${encodeURIComponent(category)}">${category}</a><br />
    `).join('');
}

function renderHotCategories(categories) {
    const container = document.getElementById('hotCategoriesContainer');
    if (!container) return;

    if (categories.length === 0) {
        container.innerHTML = '<td colspan="4"><font size="2">Hot categories coming soon.</font></td>';
        return;
    }

    const width = Math.max(Math.floor(100 / categories.length), 1);
    container.innerHTML = categories.map(category => `
        <td width="${width}%" valign="top">
            <font size="2">
                <a href="index.html?category=${encodeURIComponent(category)}" style="color:#FFFFFF;">
                    ${category}
                </a>
            </font>
        </td>
    `).join('');
}

function getHotCategories(data) {
    const categoryCounts = {};
    (data.products || []).forEach(product => {
        const category = product.category || 'Other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const sortedProductCategories = Object.keys(categoryCounts).sort(
        (a, b) => categoryCounts[b] - categoryCounts[a]
    );

    const combined = Array.from(new Set([
        ...sortedProductCategories,
        ...(Array.isArray(data.categories) ? data.categories : [])
    ]));

    if (combined.length === 0) {
        return ['Other'];
    }

    return combined.slice(0, 4);
}

async function loadStoreData() {
    try {
        const data = window.__trashedGoodsData || await fetchInventoryData();
        populateStoreMetadata(data);
    } catch (error) {
        console.error('Error loading store metadata:', error);
        populateStoreMetadata({ products: [], categories: [] });
    }
}

async function loadStoreProducts() {
    try {
        const data = await fetchInventoryData();
        populateStoreMetadata(data);

        const products = data.products || [];
        const publishedProducts = products.filter(p => p.status === 'published' && p.stock > 0);

        displayStoreProducts(publishedProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        displayStoreProducts([]);
    }
}

function displayStoreProducts(products) {
    let container = document.getElementById('featuredItemsContainer');
    if (!container) {
        container = document.getElementById('store-items');
    }
    if (!container) {
        console.warn('Store items container not found');
        return;
    }

    if (products.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No products available at the moment. Check back soon!</td></tr>';
        return;
    }

    let html = '';
    products.forEach(product => {
        const imageUrl = (product.images && product.images[0]) || 'https://via.placeholder.com/150';
        const price = parseFloat(product.price).toFixed(2);

        html += `
            <tr>
                <td width="150" align="center" valign="top">
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${imageUrl}" width="150" height="150" style="object-fit: cover; border: 1px solid #CCCCCC;" alt="${product.name}" />
                    </a>
                </td>
                <td valign="top">
                    <font size="3"><b><a href="product-detail.html?id=${product.id}">${product.name}</a></b></font><br />
                    <font size="2" color="#666">
                        ${product.description || 'No description available'}
                    </font><br />
                    <font size="2" color="#666">
                        Condition: ${product.condition || 'Used'} | Stock: ${product.stock}
                    </font>
                </td>
                <td width="80" align="right" valign="top">
                    <font size="3" color="#CC0000"><b>$${price}</b></font>
                </td>
                <td width="120" align="center" valign="top">
                    <a href="product-detail.html?id=${product.id}" style="text-decoration: none;">
                        <font size="2" color="#28a745"><b>Buy It Now</b></font>
                    </a>
                </td>
                <td width="100" align="center" valign="top">
                    <font size="2" color="#666">${product.category || 'Other'}</font>
                </td>
            </tr>
            <tr>
                <td colspan="5" height="1" bgcolor="#CCCCCC"></td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

function initializeFrontPage() {
    initThemeToggle('themeToggle');
    loadStoreData();
    loadStoreProducts();
}
