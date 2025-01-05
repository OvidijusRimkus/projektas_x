// Funkcija: Pridėti produktą į krepšelį
function addToCart(productId) {
    const apiUrl = "/Public/src/api/products.json"; // API kelias

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Klaida: ${response.status} (${response.statusText})`);
            }
            return response.json();
        })
        .then(data => {
            const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
            const product = data.categories[currentPage]?.find(item => item.id === parseInt(productId));

            if (product) {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingProduct = cart.find(item => item.id === productId);

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
                console.log(`Produktas "${product.name}" pridėtas į krepšelį.`);
            } else {
                console.error("Produktas nerastas API duomenyse.");
            }
        })
        .catch(error => console.error("Klaida gaunant API duomenis:", error));
}

// Funkcija: Atnaujinti krepšelio skaičių
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartIcon = document.querySelector(".cart-count");
    if (cartIcon) {
        cartIcon.textContent = totalCount;
    }
}

// Funkcija: Pašalinti produktą iš krepšelio
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== parseInt(productId));
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Funkcija: Rodyti produktus krepšelyje
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
                    <p>Kiekis: ${item.quantity}</p>
                    <p>Kaina: ${(item.price * item.quantity).toFixed(2)} €</p>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        // Pridėti įvykius mygtukams "Pašalinti"
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.dataset.id;
                removeFromCart(productId);
            });
        });
    }

    updateTotalPrice();
}

// Funkcija: Atnaujinti bendrą kainą
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPriceElement = document.getElementById("total-price");

    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice.toFixed(2)} €`;
    }
}

// Funkcija: Inicializuoti krepšelio logiką
function initializeCartLogic() {
    const cartIcon = document.getElementById("open-cart");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCart = document.getElementById("close-cart");

    if (cartIcon && cartSidebar && closeCart) {
        cartIcon.addEventListener("click", () => {
            cartSidebar.classList.add("active");
            renderCartItems(); // Atvaizduojame krepšelio turinį
        });

        closeCart.addEventListener("click", () => {
            cartSidebar.classList.remove("active");
        });

        document.addEventListener("click", (e) => {
            if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
                cartSidebar.classList.remove("active");
            }
        });
        }}
    
    
    