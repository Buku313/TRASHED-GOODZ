// Simple Store Frontend
// Loads products from JSONBin database

async function loadStoreProducts() {
    try {
        const data = await window.db.loadProducts();
        const products = data.products || [];

        // Filter only published products
        const publishedProducts = products.filter(p => p.status === 'published' && p.stock > 0);

        displayStoreProducts(publishedProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fall back to old data.json if database fails
        loadFallbackProducts();
    }
}

function displayStoreProducts(products) {
    // Find the items container - try both IDs
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

async function loadFallbackProducts() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        // Convert old format to new format
        const products = (data.items || []).map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            images: [item.image],
            description: item.info || '',
            status: 'published',
            stock: 1,
            category: 'Other'
        }));

        displayStoreProducts(products);
    } catch (error) {
        console.error('Error loading fallback products:', error);
    }
}

// Auto-load products when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStoreProducts);
} else {
    loadStoreProducts();
}
