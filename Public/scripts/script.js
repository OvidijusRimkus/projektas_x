document.addEventListener("DOMContentLoaded", async () => {
    // Komponentų įkėlimo funkcija
    const loadComponent = async (placeholderId, url) => {
        try {
            const response = await fetch(url);
            const data = await response.text();
            document.getElementById(placeholderId).innerHTML = data;
        } catch (error) {
            console.error(`Klaida įkeliant ${url}:`, error);
        }
    };

    // Įkelti header ir footer
    await loadComponent('header-placeholder', '/Public/components/header.html');
    await loadComponent('footer-placeholder', '/Public/components/footer.html');

    // Inicializuojame funkcijas po komponentų įkėlimo
    initializeDropdownMenu();
    initializeCartLogic();
    loadProducts();
});

// Funkcija: Dropdown meniu logika
function initializeDropdownMenu() {
    const productsLink = document.getElementById("products-link");
    if (productsLink) {
        const dropdownMenu = document.querySelector(".dropdown-menu");

        productsLink.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownMenu.style.display =
                dropdownMenu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".dropdown")) {
                dropdownMenu.style.display = "none";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch('/Public/src/api/categories.json');
      const data = await response.json();
      const categoriesContainer = document.getElementById('categories-container');
  
      data.categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        categoryElement.innerHTML = `
          <h3>${category.name}</h3>
          <!-- Pridėkite daugiau informacijos apie kategoriją, jei reikia -->
        `;
        categoriesContainer.appendChild(categoryElement);
      });
    } catch (error) {
      console.error('Klaida įkeliant kategorijas:', error);
    }
  });


// Funkcija: Įkelti produktus iš API
async function loadProducts() {
    const apiUrl = "/Public/src/api/products.json";
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");

    console.log('Dabartinis puslapis:', currentPage);

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('Gauti duomenys iš API:', data);

        if (data.categories[currentPage]) {
            const products = data.categories[currentPage];
            const productContainer = document.querySelector(".product-container");

            if (productContainer) {
                // Sukuriame produktų korteles
                products.forEach((product) => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("product-card");

                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <span>${product.price} €</span>
                        <button class="add-to-cart" data-id="${product.id}">Į krepšelį</button>
                    `;
                    productContainer.appendChild(productCard);
                });

                // Klausomės visų "Į krepšelį" mygtukų
                productContainer.addEventListener("click", (e) => {
                    if (e.target.classList.contains("add-to-cart")) {
                        const productId = e.target.dataset.id;
                        addToCart(productId);
                    }
                });
            }
        } else {
            console.error("Kategorijos duomenys nerasti.");
        }
    } catch (error) {
        console.error("API klaida:", error);
    }
}


// Funkcija atnaujinti krepšelio elementų skaičių
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");

    console.log('Krepšelio elementų skaičius:', cartCount);

    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    } else {
        console.error('Nepavyko rasti elemento su ID "cart-count".');
    }
}

// Funkcija: Pridėti produktą į krepšelį
function addToCart(productId) {
    const apiUrl = "/Public/src/api/products.json"; // API kelias

    fetch(apiUrl)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Klaida: ${response.status} (${response.statusText})`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Gauti duomenys:', data);
            const product = data.categories.sampunai.find(item => item.id === parseInt(productId));
            console.log('Rastas produktas:', product);

            if (product) {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                console.log('Esamas krepšelis:', cart);
                const existingProduct = cart.find(item => item.id === product.id);
                console.log('Esamas produktas krepšelyje:', existingProduct);

                if (existingProduct) {
                    existingProduct.quantity += 1; // Jei produktas jau yra, didiname kiekį
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                renderCartItems(); // Atnaujiname krepšelį
                console.log(`Produktas "${product.name}" pridėtas į krepšelį.`);
                console.log('Atnaujintas krepšelis:', JSON.parse(localStorage.getItem("cart")));
            } else {
                console.error("Produktas nerastas API duomenyse.");
            }
        })
        .catch(error => console.error("Klaida gaunant API duomenis:", error));
}