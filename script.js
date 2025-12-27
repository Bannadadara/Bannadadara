import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function init() {
    renderProducts();
    updateUI();
    setupCartControls();
    setupFilters();
    setupModals();
}

window.renderProducts = (category = 'All', search = '', sort = 'default') => {
    const list = document.getElementById('product-list');
    let filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === 'low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'high') filtered.sort((a, b) => b.price - a.price);

    list.innerHTML = filtered.map(p => {
        const displayPrice = p.price === 0 ? "As per order request" : `Rs. ${p.price}`;
        return `
        <div class="product-card">
            <div class="card-image-wrapper">
                <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
                <div class="card-actions">
                    <button onclick="window.openViewer('${p.img}', '${p.name}')" title="View Product"><i class="fas fa-expand"></i></button>
                    <button onclick="window.shareProduct('${p.name}', ${p.id})" title="Share Product"><i class="fas fa-share-alt"></i></button>
                </div>
            </div>
            <div class="card-info">
                <h4 class="product-name">${p.name}</h4>
                <p class="product-price">${displayPrice}</p>
                <button class="gold-btn add-btn" onclick="window.addToCart(${p.id})">
                    <i class="fas fa-shopping-bag"></i> ADD TO BAG
                </button>
            </div>
        </div>
    `}).join('');
};

window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    cart.push(p);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeCartItem = (idx) => {
    cart.splice(idx, 1);
    updateUI();
};

window.clearCart = () => {
    if(confirm("Remove all items from your bag?")) {
        cart = [];
        updateUI();
    }
};

function updateUI() {
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    const itemsDiv = document.getElementById('cart-items');
    
    itemsDiv.innerHTML = cart.length === 0 ? 
        '<p style="text-align:center; padding:20px; color:#888;">Your bag is empty</p>' :
        cart.map((item, idx) => `
        <div class="cart-item-row">
            <div>
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">${item.price === 0 ? 'Request Price' : 'Rs. ' + item.price}</p>
            </div>
            <button onclick="window.removeCartItem(${idx})" class="remove-item">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

window.shareProduct = async (name, id) => {
    const shareData = {
        title: 'Bannada Daara',
        text: `Check out this handcrafted ${name}!`,
        url: window.location.href
    };
    try {
        await navigator.share(shareData);
    } catch (err) {
        alert("Link copied to clipboard!");
    }
};

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty!");
        const list = cart.map(i => `- ${i.name} (${i.price === 0 ? 'Price Request' : 'Rs.' + i.price})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=New Order Request:%0A${list}`, '_blank');
    };
}

function setupFilters() {
    const searchBar = document.getElementById('search-bar');
    const sortSelect = document.getElementById('sort-select');
    
    const update = () => {
        const cat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(cat, searchBar.value, sortSelect.value);
    };

    searchBar.oninput = update;
    sortSelect.onchange = update;
    
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            update();
        };
    });
}

function setupModals() {
    // Image Viewer
    window.openViewer = (imgSrc, title) => {
        const modal = document.getElementById('image-modal');
        document.getElementById('full-res-image').src = imgSrc;
        document.getElementById('viewer-caption').innerText = title;
        modal.classList.add('active');
    };
    
    document.querySelector('.close-viewer').onclick = () => document.getElementById('image-modal').classList.remove('active');

    // Legacy Page
    window.toggleLegacy = () => {
        document.getElementById('legacy-page').classList.toggle('active');
    };
}

init();
