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

    list.innerHTML = filtered.length > 0 ? filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" onclick="window.openViewer('${p.img}', '${p.name}')" loading="lazy">
            <h4 style="margin:10px 0 5px; font-family:var(--heading-font); font-size:1.2rem;">${p.name}</h4>
            <p style="color:var(--gold); font-weight:600;">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-actions">
                <button class="add-btn" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
                <button class="view-btn" onclick="window.openViewer('${p.img}', '${p.name}')" title="View">🔍</button>
                <button class="share-btn" onclick="window.shareProduct('${p.name}', ${p.id})" title="Share">📤</button>
            </div>
        </div>
    `).join('') : `<p style="grid-column: 1/-1; text-align:center; padding: 50px;">No items found in this category.</p>`;
}

// ADVANCED CART LOGIC
window.addToCart = (id) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        const p = products.find(i => i.id === id);
        cart.push({ ...p, qty: 1 });
    }
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.changeQty = (index, delta) => {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveAndUpdate();
};

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * item.qty), 0);
    
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-total').innerText = `Rs. ${total}`;

    const itemsDiv = document.getElementById('cart-items');
    if (cart.length === 0) {
        itemsDiv.innerHTML = `<div style="text-align:center; margin-top:50px; color:#888;">Your bag is empty.</div>`;
    } else {
        itemsDiv.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                <div class="cart-item-info">
                    <div style="font-weight:600; font-size:0.9rem;">${item.name}</div>
                    <div style="color:var(--gold); font-size:0.85rem;">Rs. ${item.price}</div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="window.changeQty(${idx}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="window.changeQty(${idx}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// SHARE FEATURE
window.shareProduct = async (name, id) => {
    const shareData = {
        title: 'Bannada Daara',
        text: `Check out this beautiful ${name}!`,
        url: window.location.href // In a real site, you'd add ?id=1
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            alert(`Link copied for: ${name}`);
        }
    } catch (err) { console.log(err); }
};

// IMAGE VIEWER
window.openViewer = (imgSrc, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('full-res-image').src = imgSrc;
    document.getElementById('viewer-caption').innerText = title;
    modal.style.display = "block";
};

function setupEventListeners() {
    // Search
    const searchBar = document.getElementById('search-bar');
    searchBar.oninput = () => {
        const activeCat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(activeCat, searchBar.value);
    };

    // Category Filter
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, searchBar.value);
        };
    });

    // Cart Sidebar
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    // Checkout
    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Bag is empty!");
        const msg = cart.map(i => `${i.name} (x${i.qty})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Hello! I would like to order:%0A${msg}`, '_blank');
    };

    // Feedback
    document.getElementById('footer-feedback-btn').onclick = () => {
        window.open(`https://wa.me/918105750221?text=Feedback: `, '_blank');
    };

    // Modal Close
    document.querySelector('.close-viewer').onclick = () => document.getElementById('image-modal').style.display = "none";

    // About "Read More"
    const readMoreBtn = document.getElementById('read-more-btn');
    readMoreBtn.onclick = () => {
        const content = document.getElementById('about-more-content');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
        readMoreBtn.innerText = content.style.display === 'block' ? 'SHOW LESS' : 'READ FULL STORY';
    };
}

init();
