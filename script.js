import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();

    const sidebar = document.getElementById('cart-sidebar');
    const toggle = document.getElementById('cart-toggle');
    const close = document.getElementById('close-cart');

    // Smooth sidebar interaction
    toggle.onclick = () => sidebar.classList.add('open');
    close.onclick = () => sidebar.classList.remove('open');

    // Real-time search interactivity
    document.getElementById('search-bar').oninput = (e) => {
        renderProducts(document.getElementById('category-filter').value, e.target.value);
    };

    document.getElementById('category-filter').onchange = (e) => {
        renderProducts(e.target.value, document.getElementById('search-bar').value);
    };

    // Professional WhatsApp Checkout
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your shopping bag is empty!");
        const items = cart.map(i => `- ${i.name} (Rs. ${i.price})`).join('\n');
        const msg = `*Order from Bannada Daara*\n\n*Items:*\n${items}\n\n*Total:* ${document.getElementById('cart-total').innerText}`;
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // Interactive Feedback
    document.getElementById('send-feedback-btn').onclick = () => {
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent("Hi! I have some feedback regarding your collection:")}`, '_blank');
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => {
        const matchCat = cat === 'All' || p.category === cat;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    list.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h4>${p.name}</h4>
            <p><strong>Rs. ${p.price}</strong></p>
            <div class="card-btns">
                <a href="${p.img}" target="_blank" class="view-link">View</a>
                <button class="add-bag" onclick="addToCart(${p.id})">Add to Bag</button>
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

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="cart.splice(${index}, 1); updateCartUI();" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold;">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

document.addEventListener('DOMContentLoaded', init);
