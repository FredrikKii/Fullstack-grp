const getButton = document.querySelector(".getButton");
const appContainer = document.getElementById("app");

// Funktion för att hämta produkter
const fetchProducts = async () => {
    try {
        const response = await fetch("http://localhost:2000/api/hats");
        if (!response.ok) {
            throw new Error("Failed to fetch hats");
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching hats:", error);
    }
};

// Visar produkter i ett grid(?)
const displayProducts = (products) => {
    appContainer.innerText = "";
    const grid = document.createElement("div");
    grid.classList.add("product-grid");

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        const productName = document.createElement("h3");
        productName.textContent = product.name;
        productCard.appendChild(productName);
        const productPrice = document.createElement("p");
        productPrice.textContent = `Price: $${product.price}`;
        productCard.appendChild(productPrice);
        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;
        productCard.appendChild(productImage);
        const productStock = document.createElement("h4");
        productStock.textContent = `Stock: ${product.amountInStock}`;
        productCard.appendChild(productStock);
        grid.appendChild(productCard);
    });

    appContainer.appendChild(grid);
};
getButton.addEventListener("click", fetchProducts);
