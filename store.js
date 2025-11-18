// TRASHEDGOODS.STORE - Main Store JavaScript
// Load data from localStorage and display on the page

// Initialize default data (same as admin.js)
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

// Main function to load all store data
function loadStoreData() {
    // Try to load from data.json first (for GitHub Pages)
    fetch('data.json')
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('No data.json file found');
        })
        .then(function(data) {
            // Save fetched data to localStorage
            if (data.items) {
                localStorage.setItem('tgs_items', JSON.stringify(data.items));
            }
            if (data.categories) {
                localStorage.setItem('tgs_categories', JSON.stringify(data.categories));
            }
            if (data.hotCategories) {
                localStorage.setItem('tgs_hotCategories', JSON.stringify(data.hotCategories));
            }
            // Load the UI
            loadCategories();
            loadHotCategories();
            loadFeaturedItems();
        })
        .catch(function(error) {
            // Fallback to localStorage or initialize defaults
            initializeData();
            loadCategories();
            loadHotCategories();
            loadFeaturedItems();
        });
}

// Load sidebar categories
function loadCategories() {
    var categories = JSON.parse(localStorage.getItem('tgs_categories')) || [];
    var html = '';

    for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        if (i === categories.length - 1) {
            html += '<a href="' + cat.link + '"><b>' + cat.name + '</b></a>';
        } else {
            html += '<a href="' + cat.link + '">' + cat.name + '</a><br />\n';
        }
    }

    document.getElementById('categoriesContainer').innerHTML = html;
}

// Load hot categories grid
function loadHotCategories() {
    var hotCategories = JSON.parse(localStorage.getItem('tgs_hotCategories')) || [];
    var html = '';

    // Calculate width percentage based on number of categories
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

    document.getElementById('hotCategoriesContainer').innerHTML = html;
}

// Load featured items
function loadFeaturedItems() {
    var items = JSON.parse(localStorage.getItem('tgs_items')) || [];
    var html = '';

    // Display items in rows of 3
    for (var i = 0; i < items.length; i++) {
        if (i % 3 === 0) {
            html += '<tr>';
        }

        var item = items[i];
        html += '<td width="33%" valign="top">';
        html += '<table width="100%" border="1" cellpadding="5" cellspacing="0" bordercolor="#CCCCCC">';
        html += '<tr><td align="center">';
        html += '<img src="' + item.image + '" width="150" height="150" alt="Product" /><br />';
        html += '<a href="#"><b>' + item.name + '</b></a><br />';
        html += '<font size="2" color="#CC0000"><b>$' + item.price + '</b></font><br />';
        html += '<font size="1">' + item.bids + ' bids | ' + item.timeLeft + '</font><br />';
        html += '<font size="1">' + item.info + '</font>';
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

    document.getElementById('featuredItemsContainer').innerHTML = html;
}