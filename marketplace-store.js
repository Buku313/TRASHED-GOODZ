// TRASHEDGOODS.STORE - Enhanced Marketplace Frontend
// Supports both old format (items) and new format (products)

var storeData = {
    items: [],
    products: [],
    categories: [],
    hotCategories: []
};

// Main function to load marketplace data
function loadStoreData() {
    fetch('data.json')
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('No data.json file found');
        })
        .then(function(data) {
            storeData = data;

            // Convert new product format to legacy items format for display
            if (data.products && data.products.length > 0) {
                // Filter only published products
                var publishedProducts = data.products.filter(function(p) {
                    return p.status === 'published' && p.stock > 0;
                });

                // Convert to legacy format
                storeData.items = publishedProducts.map(function(product) {
                    return {
                        id: product.id,
                        name: product.name,
                        price: product.price.toFixed(2),
                        image: product.images && product.images.length > 0 ?
                               product.images[0] :
                               'https://via.placeholder.com/150x150?text=No+Image',
                        bids: '0',
                        timeLeft: '',
                        info: product.condition.charAt(0).toUpperCase() + product.condition.slice(1) +
                              (product.stock > 1 ? ' | ' + product.stock + ' in stock' : '')
                    };
                });
            }

            // Load the UI
            loadCategories();
            loadHotCategories();
            loadFeaturedItems();
        })
        .catch(function(error) {
            console.error('Failed to load data.json:', error);

            // Try to show something useful
            document.getElementById('featuredItemsContainer').innerHTML =
                '<tr><td colspan="3" align="center">' +
                '<br /><br /><font size="3" color="#CC0000"><b>Store temporarily unavailable</b></font><br />' +
                '<font size="2">Please check back soon!</font><br /><br />' +
                '</td></tr>';
        });
}

// Load sidebar categories
function loadCategories() {
    var categories = storeData.categories || [];
    var html = '';

    for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        if (i === categories.length - 1) {
            html += '<a href="' + cat.link + '"><b>' + cat.name + '</b></a>';
        } else {
            html += '<a href="' + cat.link + '">' + cat.name + '</a><br />\n';
        }
    }

    var container = document.getElementById('categoriesContainer');
    if (container) {
        container.innerHTML = html;
    }
}

// Load hot categories grid
function loadHotCategories() {
    var hotCategories = storeData.hotCategories || [];

    // If no hot categories in new format, create from categories
    if (hotCategories.length === 0 && storeData.categories && storeData.categories.length > 0) {
        hotCategories = storeData.categories.slice(0, 4).map(function(cat) {
            return {
                id: cat.id,
                name: cat.name,
                description: 'Browse ' + cat.name,
                image: 'https://via.placeholder.com/100x100?text=' + encodeURIComponent(cat.name),
                link: cat.link
            };
        });
    }

    var html = '';
    var width = hotCategories.length > 0 ? Math.floor(100 / hotCategories.length) : 25;

    for (var i = 0; i < hotCategories.length; i++) {
        var hotCat = hotCategories[i];
        html += '<td width="' + width + '%" align="center" valign="top">';
        html += '<table border="1" cellpadding="5" cellspacing="0" bordercolor="#CCCCCC" width="100%">';
        html += '<tr><td align="center">';
        html += '<img src="' + hotCat.image + '" width="100" height="100" alt="' + hotCat.name + '" /><br />';
        html += '<b><a href="' + hotCat.link + '">' + hotCat.name + '</a></b><br />';
        html += '<font size="1">' + hotCat.description + '</font>';
        html += '</td></tr></table>';
        html += '</td>';
    }

    var container = document.getElementById('hotCategoriesContainer');
    if (container) {
        container.innerHTML = html;
    }
}

// Load featured items (products)
function loadFeaturedItems() {
    var items = storeData.items || [];
    var html = '';

    if (items.length === 0) {
        html = '<tr><td colspan="3" align="center">' +
               '<br /><br /><font size="3">No products available yet</font><br />' +
               '<font size="2">Check back soon for new items!</font><br /><br />' +
               '</td></tr>';
    } else {
        // Display items in rows of 3
        for (var i = 0; i < items.length; i++) {
            if (i % 3 === 0) {
                html += '<tr>';
            }

            var item = items[i];
            html += '<td width="33%" valign="top">';
            html += '<table width="100%" border="1" cellpadding="5" cellspacing="0" bordercolor="#CCCCCC">';
            html += '<tr><td align="center">';
            html += '<img src="' + item.image + '" width="150" height="150" alt="' + item.name + '" style="object-fit: cover;" /><br />';
            html += '<a href="#"><b>' + item.name + '</b></a><br />';
            html += '<font size="2" color="#CC0000"><b>$' + item.price + '</b></font><br />';

            // Only show bid info if it exists
            if (item.bids && item.timeLeft) {
                html += '<font size="1">' + item.bids + ' bids | ' + item.timeLeft + '</font><br />';
            }

            if (item.info) {
                html += '<font size="1">' + item.info + '</font>';
            }
            html += '</td></tr></table>';
            html += '</td>';

            if (i % 3 === 2 || i === items.length - 1) {
                // Fill remaining cells if not a complete row
                if (i === items.length - 1 && i % 3 !== 2) {
                    var remaining = 2 - (i % 3);
                    for (var j = 0; j < remaining; j++) {
                        html += '<td width="33%">&nbsp;</td>';
                    }
                }
                html += '</tr>';
            }
        }
    }

    var container = document.getElementById('featuredItemsContainer');
    if (container) {
        container.innerHTML = html;
    }
}

// Search functionality (can be enhanced later)
function performSearch() {
    var query = document.getElementById('searchQuery').value;
    if (query) {
        alert('Search for: ' + query + '\n\n(Search functionality coming soon!)');
    }
    return false;
}
