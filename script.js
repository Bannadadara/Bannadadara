import { products } from './data.js';

let cart = [];

function init() {
    renderProducts(); // This now renders all 24 items on load
    setupCart();
    
    // Search Listener
    const searchBar = document.getElementById('search-bar');
    const filterSelect = document.getElementById('category-filter');

    searchBar.addEventListener('input', () => {
        renderProducts(filterSelect.value, searchBar.value);
    });

    filterSelect.addEventListener('change', () => {
        renderProducts(filterSelect.value, searchBar.value);
    });

    // Checkout Logic
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty.");
        const items = cart.map(i => `- ${i.name} (${i.on_request ? "Price on Request" : "Rs. " + i.price})`).join('\n');
        const total = document.getElementById('cart-total').innerText;
        const msg = `*Order from Bannada Daara*\n\n*Selection:*\n${items}\n\n*Subtotal:* ${total}`;
        
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
        document.getElementById('thank-you-overlay').style.display = "block";
        cart = []; 
        updateUI();
        document.getElementById('cart-sidebar').classList.remove('open');
    };

    document.getElementById('close-success').onclick = () => {
        document.getElementById('thank-you-overlay').style.display = "none";
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    
    // Filters the full 24-item list from data.js
    const filtered = products.filter(p => 
        (cat === 'All' || p.category === cat) && 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="card reveal">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300?text=Image+Not+Found'">
            <h4>${p.name}</h4>
            <p>${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-btns">
                <a href="${p.img}" target="_blank" class="view-btn">VIEW</a>
                <button class="add-btn" onclick="addToCart(${p.id})">ADD TO BAG</button>
            </div>
        </div>
    `).join('');

    // Re-trigger animations for the newly rendered items
    setupAnimations();
}

window.addToCart = (id) => {
    // Correctly finds the product by ID from your updated list
    const productToAdd = products.find(p => p.id === id);
    if (productToAdd) {
        cart.push(productToAdd);
        updateUI();
        document.getElementById('cart-sidebar').classList.add('open');
    }
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-items').innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:15px 0; border-bottom:1px solid #f9f9f9;">
            <span style="font-family:var(--heading-font); font-size:1.1rem;">${item.name}</span>
            <button onclick="window.removeItem(${idx})" style="color:#ccc; border:none; background:none; cursor:pointer; font-size:1.5rem;">&times;</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
    
    const requestNotice = document.getElementById('request-notice');
    if (requestNotice) {
        requestNotice.style.display = cart.some(i => i.on_request) ? 'block' : 'none';
    }
}

window.removeItem = (idx) => { 
    cart.splice(idx, 1); 
    updateUI(); 
};

function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { 
            if (e.isIntersecting) {
                e.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupCart() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', init);
