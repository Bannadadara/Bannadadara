import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCartControls();
    setupFilters();
    setupImageViewer();
    setupAboutInteraction();
    setupFeedback();
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
                <button onclick="window.shareProduct('${p.name}')" style="background:#f0f0f0; border:none; padding:10px; cursor:pointer; border-radius:4px;">📤</button>
            </div>
        </div>
    `).join('');
}

// PRODUCT SHARING
window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    if (navigator.share) {
        navigator.share({ title: 'Bannada Daara', text: text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(text + " " + window.location.href);
        alert("Link copied to clipboard!");
    }
};

// FEEDBACK AUTOMATION
function setupFeedback() {
    const modal = document.getElementById('feedback-modal');
    const status = document.getElementById('form-status');
    document.getElementById('footer-feedback-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-feedback').onclick = () => modal.style.display = "none";

    document.getElementById('feedback-form').onsubmit = async (e) => {
        e.preventDefault();
        status.innerHTML = "Sending...";
        const response = await fetch(e.target.action, {
            method: 'POST',
            body: new FormData(e.target),
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            status.style.color = "green";
            status.innerHTML = "Thank you! Feedback received.";
            e.target.reset();
            setTimeout(() => { modal.style.display = "none"; status.innerHTML = ""; }, 3000);
        }
    };
}

// Keep existing openViewer, setupImageViewer, addToCart, updateUI, setupCartControls, setupFilters, and setupAboutInteraction from your file

init();
