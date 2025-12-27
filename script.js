import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        (p.name.toLowerCase().includes(search.toLowerCase()))
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card" style="animation: fadeInUp 0.5s ease forwards">
            <img src="${p.img}" alt="${p.name}" onclick="window.openViewer('${p.img}', '${p.name}')" loading="lazy">
            <h4 style="margin:15px 0 5px; font-family:'Cormorant Garamond', serif; font-size:1.3rem;">${p.name}</h4>
            <p style="color:var(--gold); font-weight:600; margin-bottom:15px;">Rs. ${p.price}</p>
            <button class="add-btn" style="width:100%; background:var(--gold); border:none; color:white; padding:12px; border-radius:5px; cursor:pointer;" onclick="window.addToCart(${p.id})">
                <i class="fas fa-cart-plus"></i> ADD TO BAG
            </button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...p, qty: 1 });
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;

    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.length === 0 ? '<p style="text-align:center; padding:100px; color:#555;">Your bag is empty.</p>' : cart.map((item, idx) => `
        <div class="cart-item" style="display:flex; gap:15px; padding:20px; border-bottom:1px solid #222;">
            <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
            <div style="flex:1">
                <div style="font-weight:600;">${item.name}</div>
                <div style="color:var(--gold);">Rs. ${item.price}</div>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    // Filter logic
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat);
        };
    });

    // Remove All Logic
    document.getElementById('clear-cart').onclick = () => {
        if(confirm("Remove all items from your selection?")) {
            cart = [];
            saveAndUpdate();
        }
    };

    // WhatsApp Feedback
    document.getElementById('footer-feedback-btn').onclick = () => {
        window.open(`https://wa.me/918105750221?text=Hi, I have a feedback regarding Bannada Daara:`, '_blank');
    };

    // Checkout
    document.getElementById('checkout-btn').onclick = () => {
        const msg = cart.map(i => `- ${i.name} (x${i.qty})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${msg}`, '_blank');
    };
}

init();
