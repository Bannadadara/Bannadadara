const products = [
    { id: 1, name: "Reversible Tote Bag", price: 500, category: "Bags", img: "images/reversible-tote1.jpg" },
    { id: 2, name: "Box Tote (Plain)", price: 350, category: "Bags", img: "images/box-plain.jpg" },
    { id: 3, name: "Box Tote (Patch-work)", price: 500, category: "Bags", img: "images/box-patch.jpg" },
    { id: 4, name: "String Sling Bag", price: 150, category: "Bags", img: "images/sling-reg.jpg" },
    { id: 7, name: "Sling Bag (Patch-work S)", price: 250, category: "Bags", img: "images/sling-patch-s.jpg" },
    { id: 12, name: "U-Shape Pouch (S)", price: 100, category: "Pouches", img: "images/u-pouch.jpg" },
    { id: 18, name: "A4 Files", price: 200, category: "Stationery", img: "images/files.jpg" },
    { id: 21, name: "Cutlery Kit", price: 260, category: "Accessories", img: "images/cutlery.jpg" },
    { id: 23, name: "Patch-work Quilt", price: 0, category: "Decor", img: "images/quilt.jpg", on_request: true }
    // Add all other products from your list here...
];

let cart = [];

function init() {
    renderProducts();

    const sidebar = document.getElementById('cart-sidebar');
    const modal = document.getElementById('address-modal');

    // UI Controls
    document.getElementById('cart-toggle').onclick = () => sidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => sidebar.classList.remove('open');
    document.getElementById('cancel-order').onclick = () => modal.classList.remove('open');

    // Search and Filter
    document.getElementById('search-bar').oninput = (e) => {
        const category = document.getElementById('category-filter').value;
        renderProducts(category, e.target.value);
    };
    document.getElementById('category-filter').onchange = (e) => {
        const search = document.getElementById('search-bar').value;
        renderProducts(e.target.value, search);
    };

    // Checkout Flow
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your cart is empty!");
        modal.classList.add('open');
    };

    document.getElementById('confirm-order').onclick = () => {
        const address = document.getElementById('delivery-address').value;
        if (!address.trim()) return alert("Address is required.");

        const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);
        const itemNames = cart.map(i => i.name).join(", ");
        
        // 1. WhatsApp Order
        const orderSummary = `*New Order - Bannada Daara*\n\n*Items:* ${itemNames}\n*Total:* Rs. ${total}\n*Address:* ${address}`;
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(orderSummary)}`, '_blank');

        // 2. UPI Deep Link
        const upiUrl = `upi://pay?pa=8105750221@okbizaxis&pn=Bannada%20Daara&am=${total}&cu=INR`;
        const isMobile = /iPhone|Android/i.test(navigator.userAgent);

        setTimeout(() => {
            if (isMobile) window.location.href = upiUrl;
            else alert(`Desktop Order Received! Please pay Rs. ${total} to UPI ID: 8105750221@okbizaxis`);
            modal.classList.remove('open');
            cart = [];
            renderCart();
        }, 1500);
    };

    // Feedback Button
    document.getElementById('send-feedback-btn').onclick = () => {
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent("Hi Lavanya, I'd like to share feedback:")}`, '_blank');
    };
}

function renderProducts(filterCategory = 'All', searchTerm = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => {
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    list.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Product'">
            <div class="card-info">
                <h3>${p.name}</h3>
                <p>${p.on_request ? "Price on Request" : "Rs. " + p.price + "/-"}</p>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    cart.push(products.find(p => p.id === id));
    renderCart();
    document.getElementById('cart-sidebar').classList.add('open');
};

function renderCart() {
    document.getElementById('cart-toggle').innerText = `Cart (${cart.length})`;
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="removeFromCart(${index})" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    renderCart();
};

document.addEventListener('DOMContentLoaded', init);
