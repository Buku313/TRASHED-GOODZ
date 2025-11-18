// TRASHEDGOODS.STORE - Enhanced Marketplace Admin Panel
// Product management with image upload, status workflow, and inventory tracking

// Global state
var currentProductId = null;
var uploadedImages = [];
var productsDraft = [];
var productsPublished = [];

// UUID generator for product IDs
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Initialize marketplace data structure
function initializeMarketplaceData() {
    if (!localStorage.getItem('tgs_products')) {
        localStorage.setItem('tgs_products', JSON.stringify([]));
    }
    if (!localStorage.getItem('tgs_orders')) {
        localStorage.setItem('tgs_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('tgs_categories')) {
        var defaultCategories = [
            {id: 1, name: "Electronics", link: "#"},
            {id: 2, name: "Fashion", link: "#"},
            {id: 3, name: "Home & Garden", link: "#"},
            {id: 4, name: "Collectibles", link: "#"},
            {id: 5, name: "Sports & Outdoors", link: "#"},
            {id: 6, name: "Toys & Hobbies", link: "#"},
            {id: 7, name: "Art & Crafts", link: "#"},
            {id: 8, name: "Books & Media", link: "#"},
            {id: 9, name: "Automotive", link: "#"},
            {id: 10, name: "Everything Else", link: "#"}
        ];
        localStorage.setItem('tgs_categories', JSON.stringify(defaultCategories));
    }
}

// Load marketplace data from GitHub
function loadMarketplaceData() {
    fetch('data.json')
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('No data.json file found');
        })
        .then(function(data) {
            // Convert old format to new format if needed
            if (data.items && !data.products) {
                // Migration from old format
                var products = data.items.map(function(item) {
                    return {
                        id: generateUUID(),
                        name: item.name,
                        description: item.info || '',
                        price: parseFloat(item.price),
                        images: [item.image],
                        category: 'Everything Else',
                        status: 'published',
                        stock: 1,
                        condition: 'used',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                });
                localStorage.setItem('tgs_products', JSON.stringify(products));
            } else if (data.products) {
                localStorage.setItem('tgs_products', JSON.stringify(data.products));
            }

            if (data.categories) {
                localStorage.setItem('tgs_categories', JSON.stringify(data.categories));
            }

            if (data.orders) {
                localStorage.setItem('tgs_orders', JSON.stringify(data.orders));
            }

            loadProducts();
            loadDashboard();
        })
        .catch(function(error) {
            initializeMarketplaceData();
            loadProducts();
            loadDashboard();
        });
}

// Load products and categorize by status
function loadProducts() {
    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];

    productsDraft = products.filter(function(p) { return p.status === 'draft'; });
    productsPublished = products.filter(function(p) { return p.status === 'published'; });

    renderProductsList('draft', productsDraft);
    renderProductsList('published', productsPublished);

    updateProductCounts();
}

// Render products list
function renderProductsList(status, products) {
    var listId = status === 'draft' ? 'draftProductsList' : 'publishedProductsList';
    var listElement = document.getElementById(listId);

    if (!listElement) return;

    if (products.length === 0) {
        listElement.innerHTML = '<tr><td colspan="7" align="center"><i>No ' + status + ' products</i></td></tr>';
        return;
    }

    var html = '';
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        var thumbnail = p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/50x50?text=No+Image';

        html += '<tr>';
        html += '<td><img src="' + thumbnail + '" width="50" height="50" style="object-fit:cover;" /></td>';
        html += '<td>' + p.name + '</td>';
        html += '<td>' + p.category + '</td>';
        html += '<td>$' + p.price.toFixed(2) + '</td>';
        html += '<td>' + p.stock + '</td>';
        html += '<td>' + p.condition + '</td>';
        html += '<td>';
        html += '<a href="#" onclick="editProduct(\'' + p.id + '\'); return false;">Edit</a> | ';

        if (status === 'draft') {
            html += '<a href="#" onclick="publishProduct(\'' + p.id + '\'); return false;">Publish</a> | ';
        } else {
            html += '<a href="#" onclick="unpublishProduct(\'' + p.id + '\'); return false;">Unpublish</a> | ';
            html += '<a href="#" onclick="markAsSold(\'' + p.id + '\'); return false;">Mark Sold</a> | ';
        }

        html += '<a href="#" onclick="deleteProduct(\'' + p.id + '\'); return false;">Delete</a>';
        html += '</td>';
        html += '</tr>';
    }

    listElement.innerHTML = html;
}

// Update product counts in dashboard
function updateProductCounts() {
    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];

    var draftCount = products.filter(function(p) { return p.status === 'draft'; }).length;
    var publishedCount = products.filter(function(p) { return p.status === 'published'; }).length;
    var soldCount = products.filter(function(p) { return p.status === 'sold'; }).length;
    var totalStock = products.reduce(function(sum, p) {
        return sum + (p.status === 'published' ? p.stock : 0);
    }, 0);

    document.getElementById('draftCount').textContent = draftCount;
    document.getElementById('publishedCount').textContent = publishedCount;
    document.getElementById('soldCount').textContent = soldCount;
    document.getElementById('totalStock').textContent = totalStock;
}

// Load dashboard analytics
function loadDashboard() {
    updateProductCounts();

    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];
    var orders = JSON.parse(localStorage.getItem('tgs_orders')) || [];

    // Calculate revenue from sold products
    var totalRevenue = products
        .filter(function(p) { return p.status === 'sold'; })
        .reduce(function(sum, p) { return sum + p.price; }, 0);

    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
    document.getElementById('orderCount').textContent = orders.length;
}

// Preview product images from URLs
function previewProductImages() {
    var urlsText = document.getElementById('productImageUrls').value;
    var urls = urlsText.split('\n').filter(function(url) {
        return url.trim().length > 0;
    });

    uploadedImages = urls;
    renderImagePreviews();
}

// Render image previews
function renderImagePreviews() {
    var container = document.getElementById('imagePreviewContainer');

    if (uploadedImages.length === 0) {
        container.innerHTML = '<p>No images uploaded yet</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < uploadedImages.length; i++) {
        var url = uploadedImages[i];
        html += '<div style="display:inline-block; margin:5px; position:relative;">';
        html += '<img src="' + url + '" width="100" height="100" style="object-fit:cover; border:1px solid #ccc;" />';
        html += '<br /><a href="#" onclick="removeImage(' + i + '); return false;">Remove</a>';
        html += '</div>';
    }

    container.innerHTML = html;
}

// Remove image from upload list
function removeImage(index) {
    if (confirm('Remove this image?')) {
        uploadedImages.splice(index, 1);
        renderImagePreviews();
    }
}

// Save product (draft or published)
function saveProduct(event, publishNow) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    // Get image URLs from textarea
    var urlsText = document.getElementById('productImageUrls').value;
    var imageUrls = urlsText.split('\n').filter(function(url) {
        return url.trim().length > 0;
    }).map(function(url) {
        return url.trim();
    });

    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];
    var productId = currentProductId || generateUUID();

    var product = {
        id: productId,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        images: imageUrls,
        category: document.getElementById('productCategory').value,
        status: publishNow ? 'published' : 'draft',
        stock: parseInt(document.getElementById('productStock').value),
        condition: document.getElementById('productCondition').value,
        createdAt: currentProductId ?
            products.find(function(p) { return p.id === currentProductId; }).createdAt :
            new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (imageUrls.length === 0) {
        if (!confirm('No images added. Continue anyway?')) {
            return;
        }
    }

    if (currentProductId) {
        // Update existing product
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === currentProductId) {
                products[i] = product;
                break;
            }
        }
    } else {
        // Add new product
        products.push(product);
    }

    localStorage.setItem('tgs_products', JSON.stringify(products));
    clearProductForm();
    loadProducts();
    alert('Product saved as ' + (publishNow ? 'published' : 'draft') + '!');

    // Auto-save to GitHub
    autoSaveToGitHub();
}

// Edit product
function editProduct(id) {
    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];
    var product = products.find(function(p) { return p.id === id; });

    if (!product) return;

    currentProductId = id;
    uploadedImages = product.images.slice();

    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productCondition').value = product.condition;

    // Set image URLs
    document.getElementById('productImageUrls').value = product.images.join('\n');

    renderImagePreviews();

    // Show form section and scroll to top
    showTab('addProduct');
    window.scrollTo(0, 0);
}

// Delete product
function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];
    products = products.filter(function(p) { return p.id !== id; });

    localStorage.setItem('tgs_products', JSON.stringify(products));
    loadProducts();
    alert('Product deleted!');

    autoSaveToGitHub();
}

// Publish product
function publishProduct(id) {
    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];

    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products[i].status = 'published';
            products[i].updatedAt = new Date().toISOString();
            break;
        }
    }

    localStorage.setItem('tgs_products', JSON.stringify(products));
    loadProducts();
    alert('Product published!');

    autoSaveToGitHub();
}

// Unpublish product
function unpublishProduct(id) {
    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];

    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products[i].status = 'draft';
            products[i].updatedAt = new Date().toISOString();
            break;
        }
    }

    localStorage.setItem('tgs_products', JSON.stringify(products));
    loadProducts();
    alert('Product unpublished!');

    autoSaveToGitHub();
}

// Mark product as sold
function markAsSold(id) {
    var products = JSON.parse(localStorage.getItem('tgs_products')) || [];

    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products[i].status = 'sold';
            products[i].stock = 0;
            products[i].updatedAt = new Date().toISOString();

            // Create order record
            var orders = JSON.parse(localStorage.getItem('tgs_orders')) || [];
            orders.push({
                id: generateUUID(),
                productId: id,
                productName: products[i].name,
                price: products[i].price,
                status: 'completed',
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('tgs_orders', JSON.stringify(orders));

            break;
        }
    }

    localStorage.setItem('tgs_products', JSON.stringify(products));
    loadProducts();
    loadDashboard();
    alert('Product marked as sold!');

    autoSaveToGitHub();
}

// Clear product form
function clearProductForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productImageUrls').value = '';
    currentProductId = null;
    uploadedImages = [];
    renderImagePreviews();
}

// Auto-save to GitHub with debounce
function autoSaveToGitHub() {
    showSavingIndicator();

    if (window.marketplaceAutoSaveTimeout) {
        clearTimeout(window.marketplaceAutoSaveTimeout);
    }

    window.marketplaceAutoSaveTimeout = setTimeout(function() {
        saveMarketplaceToGitHub(function(success) {
            hideSavingIndicator(success);
        });
    }, 2000);
}

// Save marketplace data to GitHub
function saveMarketplaceToGitHub(callback) {
    if (typeof GITHUB_CONFIG === 'undefined' || !isGitHubConfigured()) {
        if (callback) callback(false);
        return;
    }

    var data = {
        products: JSON.parse(localStorage.getItem('tgs_products')) || [],
        categories: JSON.parse(localStorage.getItem('tgs_categories')) || [],
        orders: JSON.parse(localStorage.getItem('tgs_orders')) || []
    };

    var content = JSON.stringify(data, null, 2);
    var encodedContent = btoa(unescape(encodeURIComponent(content)));

    var url = 'https://api.github.com/repos/' + GITHUB_CONFIG.owner + '/' +
              GITHUB_CONFIG.repo + '/contents/' + GITHUB_CONFIG.dataFile;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + GITHUB_CONFIG.token,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Failed to get current file');
        return response.json();
    })
    .then(function(fileData) {
        var updateData = {
            message: 'Update marketplace data from admin panel',
            content: encodedContent,
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
        };

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'token ' + GITHUB_CONFIG.token,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Failed to update file');
        return response.json();
    })
    .then(function(result) {
        if (callback) callback(true);
    })
    .catch(function(error) {
        console.error('GitHub save error:', error);
        if (callback) callback(false);
    });
}

// Tab switching
function showTab(tabName) {
    // Hide all sections
    var sections = ['dashboardSection', 'addProductSection', 'draftProductsSection', 'publishedProductsSection', 'categoriesSection'];
    for (var i = 0; i < sections.length; i++) {
        var section = document.getElementById(sections[i]);
        if (section) section.style.display = 'none';
    }

    // Show selected section
    var selectedSection = document.getElementById(tabName + 'Section');
    if (selectedSection) selectedSection.style.display = 'block';

    // Update tab highlighting
    var tabs = ['dashboardTab', 'addProductTab', 'draftProductsTab', 'publishedProductsTab', 'categoriesTab'];
    for (var i = 0; i < tabs.length; i++) {
        var tab = document.getElementById(tabs[i]);
        if (tab) {
            tab.style.backgroundColor = '';
            var font = tab.getElementsByTagName('font')[0];
            if (font) font.color = '#000000';
        }
    }

    var activeTab = document.getElementById(tabName + 'Tab');
    if (activeTab) {
        activeTab.style.backgroundColor = '#3366CC';
        var font = activeTab.getElementsByTagName('font')[0];
        if (font) font.color = '#FFFFFF';
    }
}

// Export marketplace data
function exportMarketplaceData() {
    var data = {
        products: JSON.parse(localStorage.getItem('tgs_products')) || [],
        categories: JSON.parse(localStorage.getItem('tgs_categories')) || [],
        orders: JSON.parse(localStorage.getItem('tgs_orders')) || []
    };

    var jsonStr = JSON.stringify(data, null, 2);
    var blob = new Blob([jsonStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'marketplace-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Marketplace data exported!');
}

// Category management functions
function loadCategories() {
    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];
    var html = '';

    for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        html += '<tr>';
        html += '<td>' + cat.id + '</td>';
        html += '<td>' + cat.name + '</td>';
        html += '<td><a href="#" onclick="editCategory(' + cat.id + '); return false;">Edit</a> | ';
        html += '<a href="#" onclick="deleteCategory(' + cat.id + '); return false;">Delete</a></td>';
        html += '</tr>';
    }

    document.getElementById('categoriesList').innerHTML = html;
    updateCategoryDropdown();
}

function updateCategoryDropdown() {
    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];
    var select = document.getElementById('productCategory');

    if (!select) return;

    var currentValue = select.value;
    select.innerHTML = '';

    for (var i = 0; i < categories.length; i++) {
        var option = document.createElement('option');
        option.value = categories[i].name;
        option.textContent = categories[i].name;
        select.appendChild(option);
    }

    if (currentValue) select.value = currentValue;
}

function saveCategory(event) {
    event.preventDefault();

    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];
    var categoryId = document.getElementById('categoryId').value;

    var category = {
        id: categoryId ? parseInt(categoryId) : (categories.length > 0 ?
            Math.max.apply(Math, categories.map(function(c) { return c.id; })) + 1 : 1),
        name: document.getElementById('categoryName').value,
        link: '#'
    };

    if (categoryId) {
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id == categoryId) {
                categories[i] = category;
                break;
            }
        }
    } else {
        categories.push(category);
    }

    localStorage.setItem('tgs_categories', JSON.stringify(categories));
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    loadCategories();
    alert('Category saved!');

    autoSaveToGitHub();
}

function editCategory(id) {
    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];

    for (var i = 0; i < categories.length; i++) {
        if (categories[i].id == id) {
            document.getElementById('categoryId').value = categories[i].id;
            document.getElementById('categoryName').value = categories[i].name;
            window.scrollTo(0, document.getElementById('categoriesSection').offsetTop);
            break;
        }
    }
}

function deleteCategory(id) {
    if (!confirm('Delete this category?')) return;

    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];
    categories = categories.filter(function(c) { return c.id != id; });

    localStorage.setItem('tgs_categories', JSON.stringify(categories));
    loadCategories();
    alert('Category deleted!');

    autoSaveToGitHub();
}
