import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

function renderProducts(category = 'All') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => category === 'All' || p.category === category);

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="img-container">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">Rs. ${p.price}</div>
                <div class="btn-group">
                    <button class="action-btn add-btn" onclick="window.addToCart(${p.id})"><i class="fas fa-plus"></i> Bag</button>
                    <button class="action-btn" onclick="window.viewImage('${p.img}', '${p.name}')" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="window.shareProduct('${p.name}')" title="Share"><i class="fas fa-share-alt"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// View Logic
window.viewImage = (src, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-caption').innerText = title;
    modal.style.display = "block";
};

// Share Logic
window.shareProduct = (name) => {
    const url = window.location.href;
    navigator.clipboard.writeText(`Check out ${name} on Bannada Daara: ${url}`);
    alert("Link copied to clipboard!");
};

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    const exists = cart.find(i => i.id === id);
    if (exists) exists.qty++; else cart.push({ ...p, qty: 1 });
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('cart-total').innerText = `Rs. ${cart.reduce((sum, i) => sum + (i.price * i.qty), 0)}`;
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; gap:10px; padding:15px; border-bottom:1px solid #222;">
            <img src="${item.img}" style="width:50px; height:50px; object-fit:cover;">
            <div style="flex:1"><div>${item.name}</div><div style="color:var(--gold);">Rs. ${item.price}</div></div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.querySelector('.close-modal').onclick = () => document.getElementById('image-modal').style.display = "none";
    document.getElementById('clear-cart').onclick = () => { if(confirm("Empty Bag?")) { cart = []; saveAndUpdate(); } };
    
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat);
        };
    });

    document.getElementById('checkout-btn').onclick = () => {
        const text = cart.map(i => `${i.name} x${i.qty}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order:%0A${text}`, '_blank');
    };
}

init();
