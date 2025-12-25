import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCartControls();
    setupFilters();
    setupImageViewer();
    setupAboutInteraction();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="card-image-wrapper" onclick="window.openViewer('${p.img}', '${p.name}')">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
                <button class="view-overlay-btn">VIEW IMAGE</button>
            </div>
            <h4 class="product-name" style="margin-top:15px; font-family: 'Cormorant Garamond', serif; font-size:1.4rem;">${p.name}</h4>
            <p style="color:#c5a059; font-weight:600; margin-bottom:15px;">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div style="display:flex; gap:10px;">
                <button class="add-btn" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
                <button onclick="window.shareProduct('${p.name}')" style="background:#f0f0f0; border:none; padding:10px; cursor:pointer;">📤</button>
            </div>
        </div>
    `).join('');
}

// IMAGE VIEWER (LIGHTBOX)
window.openViewer = (imgSrc, title) => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('full-res-image');
    const caption = document.getElementById('viewer-caption');
    modal.style.display = "block";
    modalImg.src = imgSrc;
    caption.innerText = title;
};

function setupImageViewer() {
    const modal = document.getElementById('image-modal');
    const closeBtn = document.querySelector('.close-viewer');
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
}

window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    cart.push(p);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="window.removeCartItem(${idx})" style="border:none; background:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('checkout-btn').onclick = () => {
        const list = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${list}`, '_blank');
    };
}

function setupFilters() {
    const searchBar = document.getElementById('search-bar');
    searchBar.oninput = () => renderProducts(document.querySelector('.cat-item.active').dataset.cat, searchBar.value);
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, searchBar.value);
        };
    });
}

function setupAboutInteraction() {
    const btn = document.getElementById('read-more-btn');
    const content = document.getElementById('about-more-content');
    btn.onclick = () => {
        content.classList.toggle('show');
        btn.innerText = content.classList.contains('show') ? "SHOW LESS" : "READ OUR FULL STORY";
    };
}

init();
