import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function init() {
    renderProducts();
    updateUI();
    setupCartControls();
    setupFilters();
    setupSearch();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
            <div class="card-info">
                <h4 class="product-name">${p.name}</h4>
                <p class="product-price">₹${p.price}</p>
                <div class="btn-group">
                    <button class="add-btn" onclick="addToCart(${p.id})">ADD TO BAG</button>
                    <button class="share-btn" onclick="shareProduct('${p.name}', ${p.id})">🔗</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateUI();
    showToast(`${product.name} added!`);
};

window.shareProduct = async (name, id) => {
    if (navigator.share) {
        await navigator.share({ title: name, text: 'Check this out!', url: window.location.href });
    } else {
        showToast("Link copied to clipboard!");
    }
};

function updateUI() {
    const count = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    count.innerText = cart.length;
    itemsContainer.innerHTML = cart.map((item, index) => `
        <div style="padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;">
            <span>${item.name}</span>
            <span>₹${item.price} <button onclick="removeFromCart(${index})" style="border:none; color:red; cursor:pointer;">&times;</button></span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = `₹${total}`;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateUI();
};

function showToast(msg) {
    const x = document.getElementById("toast");
    x.innerText = msg;
    x.className = "show";
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
}

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('checkout-btn').onclick = () => {
        const list = cart.map(i => `- ${i.name} (₹${i.price})`).join('%0A');
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        window.open(`https://wa.me/918105750221?text=New Order Request:%0A${list}%0A%0ATotal: ₹${total}`, '_blank');
    };
}

function setupSearch() {
    document.getElementById('search-bar').oninput = (e) => {
        const activeCat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(activeCat, e.target.value);
    };
}

function setupFilters() {
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat);
        };
    });
}

init();
