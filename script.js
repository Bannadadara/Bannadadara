import { products } from './data.js';

// Initialize cart from LocalStorage or empty array
let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

/**
 * Initialize the Application
 */
function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

/**
 * Render Product Grid
 * @param {string} category - Category filter
 * @param {string} searchTerm - Search query filter
 */
function renderProducts(category = 'All', searchTerm = '') {
    const list = document.getElementById('product-list');
    
    // Multi-level filtering: Category + Search Term
    const filtered = products.filter(p => {
        const matchesCategory = category === 'All' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">
                <i class="fas fa-search" style="font-size: 2rem; color: #c5a059; margin-bottom: 15px;"></i>
                <p>No treasures found matching your search.</p>
            </div>`;
        return;
    }

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="img-container" onclick="window.viewImage('${p.img}', '${p.name}')">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">Rs. ${p.price}</div>
                <div class="card-actions">
                    <button class="add-btn" onclick="window.addToCart(${p.id})">
                        <i class="fas fa-plus"></i> ADD
                    </button>
                    <button class="icon-btn" onclick="window.viewImage('${p.img}', '${p.name}')" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn" onclick="window.shareProduct('${p.name}')" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Global Functions (Attached to Window for HTML Access)
 */

// Image Modal Logic
window.viewImage = (src, title) => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    
    modalImg.src = src;
    modalCaption.innerText = title;
    modal.style.display = "flex";
};

// Share Product Logic
window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({ title: 'Bannada Daara', text: text, url: url });
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert("Link copied to clipboard!");
    }
};

// Cart Logic: Add Item
window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    const exists = cart.find(i => i.id === id);
    
    if (exists) {
        exists.qty++;
    } else {
        cart.push({ ...p, qty: 1 });
    }
    
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

// Cart Logic: Change Quantity (+ or -)
window.changeQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += delta;
    
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    
    saveAndUpdate();
};

/**
 * Persistence & UI Sync
 */
function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const itemsDiv = document.getElementById('cart-items');

    // Update Totals
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    cartCount.innerText = totalQty;
    cartTotal.innerText = `Rs. ${totalPrice}`;

    // Render Bag Items with Controls
    if (cart.length === 0) {
        itemsDiv.innerHTML = '<p style="text-align:center; padding:40px; color:#888;">Your bag is empty.</p>';
    } else {
        itemsDiv.innerHTML = cart.map(item => `
            <div class="cart-item-row" style="display:flex; gap:15px; padding:15px 0; border-bottom:1px solid #333; color:white;">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:0.9rem; margin-bottom: 2px;">${item.name}</div>
                    <div style="color:#c5a059; font-size: 0.85rem; margin-bottom: 8px;">Rs. ${item.price}</div>
                    <div class="qty-controls" style="display:flex; align-items:center; gap:10px;">
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, -1)">-</button>
                        <span class="item-qty" style="color:#c5a059; font-weight:bold;">${item.qty}</span>
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div style="font-weight:600; font-size:0.9rem;">Rs. ${item.price * item.qty}</div>
            </div>
        `).join('');
    }
}

/**
 * Event Listeners
 */
function setupEventListeners() {
    // Sidebar Controls
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    // Modal Close
    document.querySelector('.close-modal').onclick = () => document.getElementById('image-modal').style.display = "none";
    
    // Clear Cart
    document.getElementById('clear-cart').onclick = () => {
        if (cart.length > 0 && confirm("Do you want to clear your bag?")) {
            cart = [];
            saveAndUpdate();
        }
    };

    // Category Filter Logic
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, document.getElementById('search-bar').value);
        };
    });

    // Search Bar Real-time Filter
    document.getElementById('search-bar').oninput = (e) => {
        const activeCat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(activeCat, e.target.value);
    };

    // Footer & Checkout
    document.getElementById('footer-feedback-btn').onclick = () => {
        window.open('https://wa.me/918105750221?text=Hi, I have feedback regarding Bannada Daara:', '_blank');
    };

    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty!");
        const msg = cart.map(i => `• ${i.name} (Qty: ${i.qty}) - Rs.${i.price * i.qty}`).join('%0A');
        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        window.open(`https://wa.me/918105750221?text=Hello! I'd like to place an order:%0A%0A${msg}%0A%0A*Total: Rs.${total}*`, '_blank');
    };
}

// Start the app
init();
