import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();

    // Sidebar Controls
    const sidebar = document.getElementById('cart-sidebar');
    document.getElementById('cart-toggle').onclick = () => sidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => sidebar.classList.remove('open');

    // Filtering
    document.getElementById('search-bar').oninput = (e) => {
        renderProducts(document.getElementById('category-filter').value, e.target.value);
    };
    document.getElementById('category-filter').onchange = (e) => {
        renderProducts(e.target.value, document.getElementById('search-bar').value);
    };

    // WhatsApp Feedback
    document.getElementById('send-feedback-btn').onclick = () => {
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent("Hi Lavanya, I'd like to share feedback:")}`, '_blank');
    };

    // Checkout
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Cart is empty!");
        const items = cart.map(i => i.name).join(", ");
        const total = document.getElementById('cart-total').innerText;
        const msg = `*Bannada Daara Order*\n\n*Items:* ${items}\n*Total:* ${total}`;
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => {
        const matchesCat = cat === 'All' || p.category === cat;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    list.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300'">
            <div class="card-info">
                <h3>${p.name}</h3>
                <p class="price">${p.on_request ? "Price on Request" : "Rs. " + p.price + "/-"}</p>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCartUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((s, i) => s + (i.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

document.addEventListener('DOMContentLoaded', init);
