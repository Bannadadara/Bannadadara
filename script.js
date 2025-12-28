import { products } from './data.js';

// 1. STATE MANAGEMENT
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
 * Render Product Grid with Staggered Animations & Dynamic Badges
 */
function renderProducts(category = 'All', searchTerm = '') {
    const list = document.getElementById('product-list');
    if (!list) return;

    // Filtering Logic: Category + Search Term
    const filtered = products.filter(p => {
        const matchesCategory = category === 'All' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle Empty State
    if (filtered.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px; color: #888;">
                <i class="fas fa-search" style="font-size: 3rem; color: #c5a059; opacity: 0.5; margin-bottom: 20px;"></i>
                <h3 style="color: #333; margin-bottom: 10px;">No Treasures Found</h3>
                <p>Try adjusting your search or category filters.</p>
            </div>`;
        return;
    }

    // Render Grid with staggered animation delays
    list.innerHTML = filtered.map((p, index) => {
        const isRequestOnly = p.on_request === true || p.price === 0;
        const priceDisplay = isRequestOnly ? "Price on Request" : `Rs. ${p.price}`;
        const btnText = isRequestOnly ? "INQUIRE" : "ADD TO BAG";
        const btnIcon = isRequestOnly ? "fa-envelope" : "fa-plus";
        const badgeHTML = isRequestOnly ? `<div class="request-badge">Custom Order</div>` : '';

        return `
        <div class="product-card" style="animation-delay: ${index * 0.05}s">
            <div class="img-container" onclick="window.viewImage('${p.img}', '${p.name}')">
                ${badgeHTML}
                <img src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price" style="color: ${isRequestOnly ? 'var(--gold)' : '#B12704'}">${priceDisplay}</div>
                <div class="card-actions">
                    <button class="add-btn" onclick="window.addToCart(${p.id})">
                        <i class="fas ${btnIcon}"></i> ${btnText}
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
    `;}).join('');
}

/**
 * Global Window Functions (for HTML onclick access)
 */
window.viewImage = (src, title) => {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-caption').innerText = title;
    modal.style.display = "flex";
};

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

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    const exists = cart.find(i => i.id === id);
    if (exists) {
        exists.qty++;
    } else {
        cart.push({ ...p, qty: 1 });
    }
    saveAndUpdate();
    document.getElementById('cart-sidebar')?.classList.add('open');
};

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
 * Persistence & UI Refresh
 */
function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const itemsDiv = document.getElementById('cart-items');

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    if (cartCount) cartCount.innerText = totalQty;
    if (cartTotal) cartTotal.innerText = `Rs. ${totalPrice}`;

    if (!itemsDiv) return;

    if (cart.length === 0) {
        itemsDiv.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:#888;">
                <i class="fas fa-shopping-basket" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.3;"></i>
                <p>Your bag is empty.</p>
            </div>`;
    } else {
        itemsDiv.innerHTML = cart.map(item => {
            const isRequest = item.on_request === true || item.price === 0;
            return `
            <div class="cart-item-row" style="display:flex; gap:15px; padding:15px 0; border-bottom:1px solid #333; color:white;">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:0.9rem; margin-bottom: 2px;">${item.name}</div>
                    <div style="color:#c5a059; font-size: 0.85rem; margin-bottom: 8px;">
                        ${isRequest ? 'Price on Request' : 'Rs. ' + item.price}
                    </div>
                    <div class="qty-controls" style="display:flex; align-items:center; gap:10px;">
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, -1)">-</button>
                        <span class="item-qty" style="color:#c5a059; font-weight:bold;">${item.qty}</span>
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div style="font-weight:600; font-size:0.9rem;">
                    ${isRequest ? '--' : 'Rs. ' + (item.price * item.qty)}
                </div>
            </div>`;
        }).join('');
    }
}

/**
 * Event Listeners Logic
 */
function setupEventListeners() {
    // Cart Sidebar Toggle
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    
    // Support for both possible close button IDs
    const closeBtn = document.getElementById('close-cart') || document.getElementById('close-cart-back');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('cart-sidebar').classList.remove('open');

    // Image Modal Closing
    const imageModal = document.getElementById('image-modal');
    if (imageModal) {
        const closeMod = document.querySelector('.close-modal');
        if (closeMod) closeMod.onclick = () => imageModal.style.display = "none";
        window.addEventListener('click', (e) => { if (e.target == imageModal) imageModal.style.display = "none"; });
    }

    // Clear Cart Functionality
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (cart.length > 0 && confirm("Remove all items from your bag?")) {
                cart = [];
                saveAndUpdate();
            }
        };
    }

    // Category Filter Buttons
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, document.getElementById('search-bar').value);
        };
    });

    // Search Bar Input
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const activeCat = document.querySelector('.cat-item.active').dataset.cat;
            renderProducts(activeCat, e.target.value);
        });
    }

    // Footer Feedback
    const feedbackBtn = document.getElementById('footer-feedback-btn');
    if (feedbackBtn) {
        feedbackBtn.onclick = () => {
            window.open('https://wa.me/918105750221?text=Hi, I have feedback regarding Bannada Daara:', '_blank');
        };
    }

    // Checkout / Order Processing
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) return alert("Please add items to your bag first!");
            const orderModal = document.getElementById('order-modal');
            
            // If the Order Modal exists, open it. Otherwise, send direct WhatsApp.
            if (orderModal) {
                orderModal.style.display = 'flex';
            } else {
                sendDirectWhatsApp();
            }
        };
    }

    // Modal Closing Logic (Order Modal)
    const closeOrderBtn = document.querySelector('.close-order-modal');
    if (closeOrderBtn) {
        closeOrderBtn.onclick = () => document.getElementById('order-modal').style.display = 'none';
    }

    // Final WhatsApp Confirmation from Modal
    const confirmBtn = document.getElementById('confirm-order-btn');
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            const name = document.getElementById('cust-name').value;
            const addr = document.getElementById('cust-address').value;
            if (!name || !addr) return alert("Please fill in your delivery details.");

            const cartList = cart.map(i => {
                const isRequest = i.price === 0 || i.on_request === true;
                const priceLabel = isRequest ? "[Price on Request]" : `Rs.${i.price * i.qty}`;
                return `• ${i.name} [x${i.qty}] - ${priceLabel}`;
            }).join('%0A');

            const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
            const totalText = total > 0 ? `%0A%0A*Total: Rs.${total}*` : '%0A%0A*Quote Requested for Custom Items*';
            
            const msg = `*New Order - Bannada Daara*%0A%0A*Name:* ${name}%0A*Address:* ${addr}%0A%0A*Treasures:*%0A${cartList}${totalText}`;
            window.open(`https://wa.me/918105750221?text=${msg}`, '_blank');
            
            document.getElementById('order-modal').style.display = 'none';
        };
    }
}

// Fallback: Direct WhatsApp send (no delivery form)
function sendDirectWhatsApp() {
    const cartList = cart.map(i => `• ${i.name} [x${i.qty}]`).join('%0A');
    window.open(`https://wa.me/918105750221?text=Hi Bannada Daara! I am interested in these treasures:%0A%0A${cartList}`, '_blank');
}

// Start Application
init();
