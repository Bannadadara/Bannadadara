import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCart();
    setupAnimations();

    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    // Event Listeners
    searchBar.addEventListener('input', (e) => {
        renderProducts(categoryFilter.value, e.target.value);
    });

    categoryFilter.addEventListener('change', (e) => {
        renderProducts(e.target.value, searchBar.value);
    });

    // Checkout Implementation
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty.");
        const items = cart.map(i => `- ${i.name} (${i.on_request ? "Price on Request" : "Rs. " + i.price})`).join('\n');
        const total = document.getElementById('cart-total').innerText;
        const msg = `*Order from Bannada Daara*\n\n*Selection:*\n${items}\n\n*Total:* ${total}`;
        
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
    const filtered = products.filter(p => 
        (cat === 'All' || p.category === cat) && 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="card reveal active">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300'">
            <h4>${p.name}</h4>
            <p>${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-btns">
                <a href="${p.img}" target="_blank" class="view-btn">VIEW</a>
                <button class="add-btn" data-id="${p.id}">ADD TO BAG</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.onclick = () => addToCart(parseInt(btn.dataset.id));
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-items').innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:15px 0; border-bottom:1px solid #f9f9f9;">
            <span style="font-family: 'Cormorant Garamond', serif; font-size:1.1rem; font-weight:600;">${item.name}</span>
            <button class="remove-btn" data-index="${idx}" style="color:red; border:none; background:none; cursor:pointer; font-size:1.5rem;">&times;</button>
        </div>
    `).join('');

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => {
            cart.splice(parseInt(btn.dataset.index), 1);
            updateUI();
        };
    });

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
    document.getElementById('request-notice').style.display = cart.some(i => i.on_request) ? 'block' : 'none';
}

function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupCart() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', init);
