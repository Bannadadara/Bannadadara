import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

// ... Keep existing renderProducts and addToCart logic ...

function setupEventListeners() {
    const orderModal = document.getElementById('order-modal');
    
    // Sidebar Controls
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');

    // Proceed to Order -> Open Popup
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Bag is empty");
        orderModal.style.display = "block";
    };

    // Close Popup
    document.querySelector('.close-order-modal').onclick = () => orderModal.style.display = "none";

    // Final Order Placement
    document.getElementById('confirm-order-btn').onclick = () => {
        const name = document.getElementById('cust-name').value;
        const address = document.getElementById('cust-address').value;

        if(!name || !address) return alert("Please fill all details");

        const cartText = cart.map(i => `• ${i.name} (x${i.qty})`).join('%0A');
        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        
        const waMsg = `*New Order - Bannada Daara*%0A%0A*Name:* ${name}%0A*Address:* ${address}%0A%0A*Items:*%0A${cartText}%0A%0A*Total: Rs. ${total}*`;
        
        window.open(`https://wa.me/918105750221?text=${waMsg}`, '_blank');
        orderModal.style.display = "none";
    };

    // Keep Category Filter logic
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat);
        };
    });
}

init();
