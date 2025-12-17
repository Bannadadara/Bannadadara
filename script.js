const products = [
    // BAGS [cite: 46, 50, 68]
    { name: "Reversible Tote Bag", price: "Rs. 500/-", category: "Bags", img: "images/tote-rev.jpg" }, [cite: 47]
    { name: "Box Tote (Plain)", price: "Rs. 350/-", category: "Bags", img: "images/tote-plain.jpg" }, [cite: 48]
    { name: "Box Tote (Patch-work)", price: "Rs. 500/-", category: "Bags", img: "images/tote-patch.jpg" }, [cite: 49]
    { name: "String Sling Bag", price: "Rs. 150/-", category: "Bags", img: "images/sling-string.jpg" }, [cite: 63]
    { name: "Regular Sling Bag", price: "Rs. 250/-", category: "Bags", img: "images/sling-reg.jpg" }, [cite: 64]
    { name: "Medium Sling Bag", price: "Rs. 450/-", category: "Bags", img: "images/sling-med.jpg" }, [cite: 65]
    { name: "Sling Bag (Patch-work S)", price: "Rs. 250/- ; 200/-", category: "Bags", img: "images/sling-s.jpg" }, [cite: 66]
    { name: "Sling Bag (Patch-work L)", price: "Rs. 550/-", category: "Bags", img: "images/sling-l.jpg" }, [cite: 67]
    { name: "Laptop Bag (50-50)", price: "Rs. 800/-", category: "Bags", img: "images/laptop.jpg" }, [cite: 8]
    { name: "Potli", price: "Rs. 250/-", category: "Bags", img: "images/potli.jpg" }, [cite: 8, 9]
    { name: "Foldable Grocery Bag", price: "Rs. 250/-", category: "Bags", img: "images/grocery.jpg" }, [cite: 9]

    // POUCHES 
    { name: "U-Shape Pouch (S)", price: "Rs. 100/-", category: "Pouches", img: "images/u-pouch.jpg" }, [cite: 9]
    { name: "Travel Kit", price: "Rs. 170/-", category: "Pouches", img: "images/travel.jpg" }, [cite: 9, 10]
    { name: "Pad-Holder", price: "Rs. 100/-", category: "Pouches", img: "images/pad-holder.jpg" }, [cite: 10]
    { name: "Flat Pouch", price: "Rs. 80/-", category: "Pouches", img: "images/flat.jpg" }, [cite: 10]
    { name: "Box Pouch", price: "Rs. 170/-", category: "Pouches", img: "images/box-pouch.jpg" }, [cite: 10]
    { name: "Trinket", price: "Rs. 40/-", category: "Pouches", img: "images/trinket.jpg" }, [cite: 10, 11]

    // STATIONERY 
    { name: "A4 Files", price: "Rs. 200/-", category: "Stationery", img: "images/files.jpg" }, [cite: 11]
    { name: "Pen Pouch", price: "Rs. 100/-", category: "Stationery", img: "images/pen-pouch.jpg" }, [cite: 11, 12]
    { name: "Book (Embroidered Cover)", price: "Rs. 450/-", category: "Stationery", img: "images/book.jpg" }, [cite: 12]

    // ACCESSORIES & DECOR [cite: 42, 43, 14]
    { name: "Cutlery Kit", price: "Rs. 260/-", category: "Accessories", img: "images/cutlery.jpg" }, [cite: 12, 13]
    { name: "Mask", price: "Rs. 50/-", category: "Accessories", img: "images/mask.jpg" }, [cite: 13]
    { name: "Patch-work Quilt", price: "Price on Request", category: "Decor", img: "images/quilt.jpg" }, [cite: 13]
    { name: "Patch-work Table Cloth", price: "Price on Request", category: "Decor", img: "images/tablecloth.jpg" } [cite: 13]
];

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    
    if (productList) {
        // Clear the container first
        productList.innerHTML = "";
        
        // Inject all products from the catalogue data
        products.forEach(item => {
            const card = `
                <div class="card">
                    <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Bannada+Daara'">
                    <div class="card-info">
                        <span class="tag">${item.category}</span>
                        <h3>${item.name}</h3>
                        <p class="price">${item.price}</p>
                    </div>
                </div>
            `;
            productList.innerHTML += card;
        });
    } else {
        console.error("The website couldn't find the 'product-list' container.");
    }
});
