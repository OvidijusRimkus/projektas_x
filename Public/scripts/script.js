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

// Funkcija: Inicializuoti krepšelio logiką
function initializeCartLogic() {
    const cartIcon = document.getElementById("open-cart"); // Krepšelio mygtukas
    const cartSidebar = document.getElementById("cart-sidebar"); // Šoninė juosta
    const closeCart = document.getElementById("close-cart"); // Uždarymo mygtukas
    const cartItemsContainer = document.querySelector(".cart-items"); // Kur rodysime produktus

    if (cartIcon && cartSidebar && closeCart) {
        // Atidaryti krepšelio šoninę juostą
        cartIcon.addEventListener("click", () => {
            cartSidebar.classList.add("active");
            renderCartItems(); // Atvaizduojame krepšelio turinį
        });

        // Uždaryti krepšelio šoninę juostą
        closeCart.addEventListener("click", () => {
            cartSidebar.classList.remove("active");
        });

        // Uždaryti paspaudus už šoninės juostos ribų, bet ne paspaudus ant mygtukų krepšelyje
        document.addEventListener("click", (e) => {
            if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && !e.target.classList.contains("increase-quantity") && !e.target.classList.contains("decrease-quantity") && !e.target.classList.contains("remove-item")) {
                cartSidebar.classList.remove("active");
            }
        });
    } else {
        console.error("Nepavyko rasti vieno ar daugiau elementų (open-cart, cart-sidebar, close-cart).");
    }
}

    // Funkcija atvaizduoti produktus krepšelyje
    function renderCartItems() {
        const cartItemsContainer = document.querySelector(".cart-items");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsContainer.innerHTML = ""; // Išvalome esamą turinį
    
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Krepšelis yra tuščias.</p>";
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
    
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <div class="quantity-controls">
                            <button class="decrease-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <p>Kaina: ${(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">&times;</button>
                `;
    
                cartItemsContainer.appendChild(cartItem);
            });
    
            // Kiekvienam mygtukui "Pašalinti" pridedame įvykio klausytuvą
            document.querySelectorAll(".remove-item").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.dataset.id;
                    removeFromCart(productId);
                });
            });
    
            // Kiekvienam mygtukui "Padidinti kiekį" pridedame įvykio klausytuvą
            document.querySelectorAll(".increase-quantity").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.dataset.id;
                    changeQuantity(productId, 1);
                });
            });
    
            // Kiekvienam mygtukui "Sumažinti kiekį" pridedame įvykio klausytuvą
            document.querySelectorAll(".decrease-quantity").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.dataset.id;
                    changeQuantity(productId, -1);
                });
            });
        }
    
        updateTotalPrice(); // Apskaičiuojame ir atnaujiname bendrą kainą
    }

        // Funkcija pakeisti produkto kiekį
        function changeQuantity(productId, change) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const product = cart.find(item => item.id === parseInt(productId));
        
            if (product) {
                product.quantity += change;
                if (product.quantity < 1) {
                    product.quantity = 1; // Užtikriname, kad mažiausias kiekis būtų vienetas
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                renderCartItems(); // Atnaujiname krepšelį
            }
        }

// Funkcija pašalinti produktą iš krepšelio
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== parseInt(productId)); // Pašaliname produktą pagal ID
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartItems(); // Atnaujiname krepšelį
}

// Funkcija atnaujinti bendrą kainą
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice.toFixed(2)} €`;
    }
}

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