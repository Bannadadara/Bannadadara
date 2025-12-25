import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCart();
    setupAnimations();

    // Search bar functionality
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    if (searchBar && categoryFilter) {
        searchBar.addEventListener('input', () => {
            renderProducts(categoryFilter.value, searchBar.value);
        });

        categoryFilter.addEventListener('change', () => {
            renderProducts(categoryFilter.value, searchBar.value);
        });
    }

    // Checkout Logic
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) return alert("Your bag is empty.");
            
            const items = cart.map(i => `- ${i.name} (${i.on_request ? "Price on Request" : "Rs. " + i.price})`).join('\n');
            const total = document.getElementById('cart-total').innerText;
            const msg = `*Order from Bannada Daara*\n\n*Selection:*\n${items}\n\n*Subtotal:* ${total}`;
            
            window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
            
            // Show Success Overlay
            document.getElementById('thank-you-overlay').style.display = "block";
            
            // Clear Cart
            cart = []; 
            updateUI();
            document.getElementById('cart-sidebar').classList.remove('open');
        };
    }

    document.getElementById('close-success').onclick = () => {
        document.getElementById('thank-you-overlay').style.display = "none";
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    
    const filtered = products.filter(p => 
        (cat === 'All' || p.category === cat) && 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) {
        list.innerHTML = `<p style="text-align:center; width:100%; padding: 50px;">No products found in this category.</p>`;
        return;
    }

    list.innerHTML = filtered.map(p => `
        <div class="card reveal active">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300?text=Image+Coming+Soon'">
            <h4>${p.name}</h4>
            <p>${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-btns">
                <a href="${p.img}" target="_blank" class="view-btn">VIEW</a>
                <button class="add-btn" onclick="addToCart(${p.id})">ADD TO BAG</button>
            </div>
        </div>
    `).join('');
    
    // Re-run animation observer for new elements
    setupAnimations();
}

window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        updateUI();
        document.getElementById('cart-sidebar').classList.add('open');
    }
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-items').innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:15px 0; border-bottom:1px solid #f9f9f9;">
            <div style="display:flex; flex-direction:column;">
                <span style="font-family:var(--heading-font); font-size:1.1rem;">${item.name}</span>
                <span style="font-size:0.8rem; color:#888;">${item.on_request ? 'Price on Request' : 'Rs. ' + item.price}</span>
            </div>
            <button onclick="window.removeItem(${idx})" style="color:#ccc; border:none; background:none; cursor:pointer; font-size:1.5rem;">&times;</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
    
    // Handle the "Price on Request" notice
    const notice = document.getElementById('request-notice');
    if (notice) {
        notice.style.display = cart.some(i => i.on_request) ? 'block' : 'none';
    }
}

window.removeItem = (idx) => { 
    cart.splice(idx, 1); 
    updateUI(); 
};

function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.getElementById('close-cart');
    
    if (cartToggle) cartToggle.onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    if (closeCart) closeCart.onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', init);
