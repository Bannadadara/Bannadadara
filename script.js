import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    updateCartUI();
    setupActions();
}

function renderProducts(cat = 'All', query = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (cat === 'All' || p.category === cat) &&
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="wishlist-overlay"><i class="fa-regular fa-heart"></i></div>
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x500?text=Handmade'">
            <div class="card-content">
                <p style="text-transform:uppercase; font-size:0.7rem; color:var(--gold); font-weight:700;">${p.category}</p>
                <h3 style="font-family:'Playfair Display', serif; margin:5px 0;">${p.name}</h3>
                <div class="price-tag">₹${p.price}</div>
                <button class="add-to-bag" onclick="handleAddToCart(${p.id})">ADD TO BAG</button>
                <button class="share-icon" onclick="shareProd('${p.name}')" style="background:none; border:none; margin-top:10px; cursor:pointer; font-size:0.8rem; color:#666;"><i class="fa-solid fa-share"></i> Share Product</button>
            </div>
        </div>
    `).join('');
}

window.handleAddToCart = (id) => {
    const item = products.find(p => p.id === id);
    cart.push(item);
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateCartUI();
    showToast(`${item.name} added to bag!`);
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsEl = document.getElementById('cart-items');
    itemsEl.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; padding:15px; border-bottom:1px solid #eee; align-items:center;">
            <img src="${item.img}" style="width:50px; height:50px; border-radius:4px; object-fit:cover;">
            <div style="flex:1; margin-left:15px;">
                <p style="font-weight:600; font-size:0.9rem;">${item.name}</p>
                <p>₹${item.price}</p>
            </div>
            <button onclick="removeCartItem(${idx})" style="background:none; border:none; color:red; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
    
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    document.getElementById('cart-total').innerText = `₹${total}`;
}

window.removeCartItem = (idx) => {
    cart.splice(idx, 1);
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateCartUI();
};

function showToast(msg) {
    const toast = document.getElementById('toast-notify');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function setupActions() {
    document.getElementById('cart-trigger').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    document.getElementById('main-search').oninput = (e) => {
        const cat = document.querySelector('.filter-link.active').dataset.cat;
        renderProducts(cat, e.target.value);
    };

    document.querySelectorAll('.filter-link').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-link.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat);
        };
    });
}

window.whatsappCheckout = () => {
    const text = cart.map(i => `- ${i.name} (₹${i.price})`).join('%0A');
    window.open(`https://wa.me/918105750221?text=New Order Request:%0A${text}`, '_blank');
};

init();
