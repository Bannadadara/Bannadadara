import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCartControls();
    setupFilters();
    setupImageViewer();
    setupAboutInteraction();
    setupFeedbackModal();
    setupScrollReveal();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card reveal">
            <div class="card-image-wrapper" style="position:relative; overflow:hidden; cursor:pointer;" onclick="window.openViewer('${p.img}', '${p.name}')">
                <img src="${p.img}" alt="${p.name}" style="width:100%; height:300px; object-fit:cover;" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
                <button class="view-overlay-btn" style="position:absolute; bottom:10px; right:10px; background:rgba(255,255,255,0.9); border:none; padding:8px 12px; font-size:0.7rem; font-weight:700;">VIEW IMAGE</button>
            </div>
            <h4 style="margin-top:15px; font-family: var(--heading-font); font-size:1.4rem;">${p.name}</h4>
            <p style="color:var(--gold); font-weight:700; margin-bottom:15px;">${p.on_request ? 'Price on Request' : '₹' + p.price}</p>
            <div style="display:flex; gap:10px;">
                <button class="add-btn" style="flex:1;" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
                <button onclick="window.shareProduct('${p.name}')" style="background:#f0f0f0; border:none; padding:10px; cursor:pointer; border-radius:4px;">📤</button>
            </div>
        </div>
    `).join('');
    setupScrollReveal(); // Re-init for filtered items
}

// SCROLL REVEAL LOGIC
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// FEEDBACK MODAL LOGIC
function setupFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    const btn = document.getElementById('footer-feedback-btn');
    const close = document.getElementById('close-feedback');
    
    btn.onclick = () => modal.style.display = "block";
    close.onclick = () => modal.style.display = "none";
    
    document.getElementById('send-feedback-btn').onclick = () => {
        const text = document.getElementById('feedback-text').value;
        if(text) {
            window.open(`https://wa.me/918105750221?text=Feedback: ${encodeURIComponent(text)}`, '_blank');
            modal.style.display = "none";
        }
    };
}

// PRODUCT SHARING (Web Share API)
window.shareProduct = async (name) => {
    if (navigator.share) {
        try {
            await navigator.share({ title: 'Bannada Daara', text: `Check out this ${name}`, url: window.location.href });
        } catch (err) { console.log(err); }
    } else {
        alert("Link copied to clipboard!");
    }
};

// CART AUTO-CALCULATION
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
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid #eee;">
            <div>
                <p style="font-weight:600; font-size:0.9rem;">${item.name}</p>
                <p style="color:var(--gold); font-size:0.8rem;">₹${item.price || 0}</p>
            </div>
            <button onclick="window.removeCartItem(${idx})" style="border:none; background:none; cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `₹${total}`;
}

window.removeCartItem = (idx) => {
    cart.splice(idx, 1);
    updateUI();
};

// ... (Maintain existing setupFilters, setupImageViewer, setupCartControls, setupAboutInteraction)

init();
