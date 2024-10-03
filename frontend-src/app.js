const getButton = document.querySelector('.getButton');
const appContainer = document.getElementById('app');

// Funktion för att hämta produkter
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:2000/api/hats'); 
    if (!response.ok) {
      throw new Error('Failed to fetch hats');
    }
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error fetching hats:', error);
  }
};

// Visar produkter i ett grid(?)
const displayProducts = (products) => {
  appContainer.innerText = ''; 
  const grid = document.createElement('div');
  grid.classList.add('product-grid'); 

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card'); 
    productCard.innerText = `
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.amountInStock}</h4>
    `;
    grid.appendChild(productCard);
  });

  appContainer.appendChild(grid); 
};


getButton.addEventListener('click', fetchProducts);
