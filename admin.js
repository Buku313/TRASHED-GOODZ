// TRASHEDGOODS.STORE Admin Panel JavaScript
// Using localStorage for data persistence

// Initialize default data
function initializeData() {
    if (!localStorage.getItem('tgs_items')) {
        var defaultItems = [
            {
                id: 1,
                name: "Apple iPod Classic 80GB",
                price: "89.99",
                image: "https://via.placeholder.com/150x150?text=Item+1",
                bids: "0",
                timeLeft: "2h 15m left",
                info: "Buy It Now available"
            },
            {
                id: 2,
                name: "Sony PlayStation 3 Console",
                price: "249.00",
                image: "https://via.placeholder.com/150x150?text=Item+2",
                bids: "12",
                timeLeft: "1h 32m left",
                info: "Free shipping"
            },
            {
                id: 3,
                name: "Canon EOS Digital Rebel XTi",
                price: "399.99",
                image: "https://via.placeholder.com/150x150?text=Item+3",
                bids: "5",
                timeLeft: "3h 45m left",
                info: "New in box"
            },
            {
                id: 4,
                name: "Nintendo Wii Console Bundle",
                price: "199.99",
                image: "https://via.placeholder.com/150x150?text=Item+4",
                bids: "8",
                timeLeft: "4h 12m left",
                info: "Ships worldwide"
            },
            {
                id: 5,
                name: "Dell Inspiron Laptop 15.4\"",
                price: "449.00",
                image: "https://via.placeholder.com/150x150?text=Item+5",
                bids: "3",
                timeLeft: "5h 28m left",
                info: "Refurbished"
            },
            {
                id: 6,
                name: "Vintage Levi's Jeans Collection",
                price: "59.99",
                image: "https://via.placeholder.com/150x150?text=Item+6",
                bids: "1",
                timeLeft: "6h 03m left",
                info: "Excellent condition"
            }
        ];
        localStorage.setItem('tgs_items', JSON.stringify(defaultItems));
    }

    if (!localStorage.getItem('tgs_categories')) {
        var defaultCategories = [
            {id: 1, name: "Antiques", link: "#"},
            {id: 2, name: "Art", link: "#"},
            {id: 3, name: "Books", link: "#"},
            {id: 4, name: "Business & Industrial", link: "#"},
            {id: 5, name: "Cameras & Photo", link: "#"},
            {id: 6, name: "Cell Phones & PDAs", link: "#"},
            {id: 7, name: "Clothing, Shoes & Accessories", link: "#"},
            {id: 8, name: "Coins & Paper Money", link: "#"},
            {id: 9, name: "Collectibles", link: "#"},
            {id: 10, name: "Computers & Networking", link: "#"},
            {id: 11, name: "Consumer Electronics", link: "#"},
            {id: 12, name: "Crafts", link: "#"},
            {id: 13, name: "Dolls & Bears", link: "#"},
            {id: 14, name: "DVDs & Movies", link: "#"},
            {id: 15, name: "Entertainment Memorabilia", link: "#"},
            {id: 16, name: "Gift Certificates", link: "#"},
            {id: 17, name: "Health & Beauty", link: "#"},
            {id: 18, name: "Home & Garden", link: "#"},
            {id: 19, name: "Jewelry & Watches", link: "#"},
            {id: 20, name: "Music", link: "#"},
            {id: 21, name: "Musical Instruments", link: "#"},
            {id: 22, name: "Pet Supplies", link: "#"},
            {id: 23, name: "Pottery & Glass", link: "#"},
            {id: 24, name: "Real Estate", link: "#"},
            {id: 25, name: "Sporting Goods", link: "#"},
            {id: 26, name: "Sports Mem, Cards & Fan Shop", link: "#"},
            {id: 27, name: "Stamps", link: "#"},
            {id: 28, name: "Tickets", link: "#"},
            {id: 29, name: "Toys & Hobbies", link: "#"},
            {id: 30, name: "Travel", link: "#"},
            {id: 31, name: "Video Games", link: "#"},
            {id: 32, name: "Everything Else", link: "#"}
        ];
        localStorage.setItem('tgs_categories', JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem('tgs_hotCategories')) {
        var defaultHotCategories = [
            {
                id: 1,
                name: "Electronics",
                description: "Hot deals on laptops, cameras, and more!",
                image: "https://via.placeholder.com/100x100?text=Electronics",
                link: "#"
            },
            {
                id: 2,
                name: "Fashion",
                description: "Latest trends in clothing & shoes",
                image: "https://via.placeholder.com/100x100?text=Fashion",
                link: "#"
            },
            {
                id: 3,
                name: "Home & Garden",
                description: "Everything for your home",
                image: "https://via.placeholder.com/100x100?text=Home",
                link: "#"
            },
            {
                id: 4,
                name: "Collectibles",
                description: "Find rare & unique items",
                image: "https://via.placeholder.com/100x100?text=Collectibles",
                link: "#"
            }
        ];
        localStorage.setItem('tgs_hotCategories', JSON.stringify(defaultHotCategories));
    }
}

// Load admin data on page load
function loadAdminData() {
    initializeData();
    loadItems();
    loadCategories();
    loadHotCategories();
}

// Tab switching
function showTab(tabName) {
    // Hide all sections
    document.getElementById('itemsSection').style.display = 'none';
    document.getElementById('categoriesSection').style.display = 'none';
    document.getElementById('hotCategoriesSection').style.display = 'none';

    // Reset tab colors
    document.getElementById('itemsTab').style.backgroundColor = '';
    document.getElementById('categoriesTab').style.backgroundColor = '';
    document.getElementById('hotCategoriesTab').style.backgroundColor = '';
    document.getElementById('itemsTab').getElementsByTagName('font')[0].color = '#000000';
    document.getElementById('categoriesTab').getElementsByTagName('font')[0].color = '#000000';
    document.getElementById('hotCategoriesTab').getElementsByTagName('font')[0].color = '#000000';

    // Show selected section and highlight tab
    if (tabName === 'items') {
        document.getElementById('itemsSection').style.display = 'block';
        document.getElementById('itemsTab').style.backgroundColor = '#3366CC';
        document.getElementById('itemsTab').getElementsByTagName('font')[0].color = '#FFFFFF';
    } else if (tabName === 'categories') {
        document.getElementById('categoriesSection').style.display = 'block';
        document.getElementById('categoriesTab').style.backgroundColor = '#3366CC';
        document.getElementById('categoriesTab').getElementsByTagName('font')[0].color = '#FFFFFF';
    } else if (tabName === 'hotCategories') {
        document.getElementById('hotCategoriesSection').style.display = 'block';
        document.getElementById('hotCategoriesTab').style.backgroundColor = '#3366CC';
        document.getElementById('hotCategoriesTab').getElementsByTagName('font')[0].color = '#FFFFFF';
    }
}

// ITEMS MANAGEMENT
function loadItems() {
    var items = JSON.parse(localStorage.getItem('tgs_items')) || [];
    var html = '';

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += '<tr>';
        html += '<td>' + item.id + '</td>';
        html += '<td>' + item.name + '</td>';
        html += '<td>$' + item.price + '</td>';
        html += '<td>' + item.bids + '</td>';
        html += '<td>' + item.timeLeft + '</td>';
        html += '<td>' + item.info + '</td>';
        html += '<td><a href="#" onclick="editItem(' + item.id + '); return false;">Edit</a></td>';
        html += '<td><a href="#" onclick="deleteItem(' + item.id + '); return false;">Delete</a></td>';
        html += '</tr>';
    }

    document.getElementById('itemsList').innerHTML = html;
}

function saveItem(event) {
    event.preventDefault();

    var items = JSON.parse(localStorage.getItem('tgs_items')) || [];
    var itemId = document.getElementById('itemId').value;

    var item = {
        id: itemId ? parseInt(itemId) : (items.length > 0 ? Math.max.apply(Math, items.map(function(o) { return o.id; })) + 1 : 1),
        name: document.getElementById('itemName').value,
        price: document.getElementById('itemPrice').value,
        image: document.getElementById('itemImage').value || 'https://via.placeholder.com/150x150?text=Item',
        bids: document.getElementById('itemBids').value,
        timeLeft: document.getElementById('itemTime').value,
        info: document.getElementById('itemInfo').value
    };

    if (itemId) {
        // Update existing item
        for (var i = 0; i < items.length; i++) {
            if (items[i].id == itemId) {
                items[i] = item;
                break;
            }
        }
    } else {
        // Add new item
        items.push(item);
    }

    localStorage.setItem('tgs_items', JSON.stringify(items));
    clearItemForm();
    loadItems();
    alert('Item saved successfully!');
}

function editItem(id) {
    var items = JSON.parse(localStorage.getItem('tgs_items')) || [];

    for (var i = 0; i < items.length; i++) {
        if (items[i].id == id) {
            var item = items[i];
            document.getElementById('itemId').value = item.id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemImage').value = item.image;
            document.getElementById('itemBids').value = item.bids;
            document.getElementById('itemTime').value = item.timeLeft;
            document.getElementById('itemInfo').value = item.info;
            window.scrollTo(0, 0);
            break;
        }
    }
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        var items = JSON.parse(localStorage.getItem('tgs_items')) || [];
        items = items.filter(function(item) { return item.id != id; });
        localStorage.setItem('tgs_items', JSON.stringify(items));
        loadItems();
        alert('Item deleted successfully!');
    }
}

function clearItemForm() {
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
}

// CATEGORIES MANAGEMENT
function loadCategories() {
    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];
    var html = '';

    for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        html += '<tr>';
        html += '<td>' + cat.id + '</td>';
        html += '<td>' + cat.name + '</td>';
        html += '<td>' + cat.link + '</td>';
        html += '<td><a href="#" onclick="editCategory(' + cat.id + '); return false;">Edit</a></td>';
        html += '<td><a href="#" onclick="deleteCategory(' + cat.id + '); return false;">Delete</a></td>';
        html += '</tr>';
    }

    document.getElementById('categoriesList').innerHTML = html;
}

function saveCategory(event) {
    event.preventDefault();

    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];
    var categoryId = document.getElementById('categoryId').value;

    var category = {
        id: categoryId ? parseInt(categoryId) : (categories.length > 0 ? Math.max.apply(Math, categories.map(function(o) { return o.id; })) + 1 : 1),
        name: document.getElementById('categoryName').value,
        link: document.getElementById('categoryLink').value || '#'
    };

    if (categoryId) {
        // Update existing category
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id == categoryId) {
                categories[i] = category;
                break;
            }
        }
    } else {
        // Add new category
        categories.push(category);
    }

    localStorage.setItem('tgs_categories', JSON.stringify(categories));
    clearCategoryForm();
    loadCategories();
    alert('Category saved successfully!');
}

function editCategory(id) {
    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];

    for (var i = 0; i < categories.length; i++) {
        if (categories[i].id == id) {
            var cat = categories[i];
            document.getElementById('categoryId').value = cat.id;
            document.getElementById('categoryName').value = cat.name;
            document.getElementById('categoryLink').value = cat.link;
            window.scrollTo(0, 0);
            break;
        }
    }
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];
        categories = categories.filter(function(cat) { return cat.id != id; });
        localStorage.setItem('tgs_categories', JSON.stringify(categories));
        loadCategories();
        alert('Category deleted successfully!');
    }
}

function clearCategoryForm() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
}

// HOT CATEGORIES MANAGEMENT
function loadHotCategories() {
    var hotCategories = JSON.parse(localStorage.getItem('tgs_hotCategories')) || [];
    var html = '';

    for (var i = 0; i < hotCategories.length; i++) {
        var hotCat = hotCategories[i];
        html += '<tr>';
        html += '<td>' + hotCat.id + '</td>';
        html += '<td>' + hotCat.name + '</td>';
        html += '<td>' + hotCat.description + '</td>';
        html += '<td>' + hotCat.link + '</td>';
        html += '<td><a href="#" onclick="editHotCategory(' + hotCat.id + '); return false;">Edit</a></td>';
        html += '<td><a href="#" onclick="deleteHotCategory(' + hotCat.id + '); return false;">Delete</a></td>';
        html += '</tr>';
    }

    document.getElementById('hotCategoriesList').innerHTML = html;
}

function saveHotCategory(event) {
    event.preventDefault();

    var hotCategories = JSON.parse(localStorage.getItem('tgs_hotCategories')) || [];
    var hotCategoryId = document.getElementById('hotCategoryId').value;

    var hotCategory = {
        id: hotCategoryId ? parseInt(hotCategoryId) : (hotCategories.length > 0 ? Math.max.apply(Math, hotCategories.map(function(o) { return o.id; })) + 1 : 1),
        name: document.getElementById('hotCategoryName').value,
        description: document.getElementById('hotCategoryDesc').value,
        image: document.getElementById('hotCategoryImage').value || 'https://via.placeholder.com/100x100?text=Category',
        link: document.getElementById('hotCategoryLink').value || '#'
    };

    if (hotCategoryId) {
        // Update existing hot category
        for (var i = 0; i < hotCategories.length; i++) {
            if (hotCategories[i].id == hotCategoryId) {
                hotCategories[i] = hotCategory;
                break;
            }
        }
    } else {
        // Add new hot category
        hotCategories.push(hotCategory);
    }

    localStorage.setItem('tgs_hotCategories', JSON.stringify(hotCategories));
    clearHotCategoryForm();
    loadHotCategories();
    alert('Hot Category saved successfully!');
}

function editHotCategory(id) {
    var hotCategories = JSON.parse(localStorage.getItem('tgs_hotCategories')) || [];

    for (var i = 0; i < hotCategories.length; i++) {
        if (hotCategories[i].id == id) {
            var hotCat = hotCategories[i];
            document.getElementById('hotCategoryId').value = hotCat.id;
            document.getElementById('hotCategoryName').value = hotCat.name;
            document.getElementById('hotCategoryDesc').value = hotCat.description;
            document.getElementById('hotCategoryImage').value = hotCat.image;
            document.getElementById('hotCategoryLink').value = hotCat.link;
            window.scrollTo(0, 0);
            break;
        }
    }
}

function deleteHotCategory(id) {
    if (confirm('Are you sure you want to delete this hot category?')) {
        var hotCategories = JSON.parse(localStorage.getItem('tgs_hotCategories')) || [];
        hotCategories = hotCategories.filter(function(hotCat) { return hotCat.id != id; });
        localStorage.setItem('tgs_hotCategories', JSON.stringify(hotCategories));
        loadHotCategories();
        alert('Hot Category deleted successfully!');
    }
}

function clearHotCategoryForm() {
    document.getElementById('hotCategoryForm').reset();
    document.getElementById('hotCategoryId').value = '';
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}