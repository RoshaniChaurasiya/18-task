$(document).ready(function () {
    let products = [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Hide the modal initially
    $('#product-modal').hide();


    // Fetch product data from JSON
    $.getJSON('products.json', function (data) {
        products = data;
        displayProducts(products); // Display all products initially
    }).fail(function () {
        alert('Failed to load product data. Please try again later.');
    });

    // Display products based on selected category
    function displayProducts(productsToShow) {
        $('#product-list').empty();
        $('#product-list').append('<h2>Our Exclusive Products</h2>');
        productsToShow.forEach(product => {
            $('#product-list').append(`
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>$${product.price.toFixed(2)}</p>
                    <button class="details-button">Details</button>
                    <button class="favorites-button">${favorites.includes(product.id) ? 'Remove from' : 'Add to'} Favorites</button>
                </div>
            `);
        });
    }

    // Filter products based on category
    function filterProducts(category) {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }

    // Initial display of all products
    filterProducts('all');

    // Handle category filter clicks
    $('.category-filter').on('click', function () {
        const category = $(this).data('category');
        filterProducts(category);
    });

    // Search functionality
    $('#search').on('input', function () {
        const searchTerm = $(this).val().toLowerCase();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
        displayProducts(filteredProducts);
    });

    // Sort functionality
    $('#sort').on('change', function () {
        const sortBy = $(this).val();
        const sortedProducts = [...products].sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'price') return a.price - b.price;
        });
        displayProducts(sortedProducts);
    });

    // Handle product details
    $(document).on('click', '.details-button', function () {
        const productId = $(this).parent().data('id');
        const product = products.find(p => p.id === productId);
        $('#modal-body').html(`
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
        `);
        $('#product-modal').show();
    });

    $(document).on('click', '.close-button', function () {
        $('#modal-body').empty();
        $('#product-modal').hide();
    });
    
    // Handle favorites
    $(document).on('click', '.favorites-button', function () {
        const productId = $(this).parent().data('id');
        if (favorites.includes(productId)) {
            const index = favorites.indexOf(productId);
            favorites.splice(index, 1);
            $(this).text('Add to Favorites');
        } else {
            favorites.push(productId);
            $(this).text('Remove from Favorites');
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    });    
});
