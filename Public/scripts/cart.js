

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

        // Atnaujinti krepšelio elementų skaičių
        updateCartCount();
    } else {
        console.error("Nepavyko rasti vieno ar daugiau elementų (open-cart, cart-sidebar, close-cart).");
    }
}

    // Funkcija atvaizduoti produktus krepšelyje
    function renderCartItems() {
        const cartItemsContainer = document.querySelector(".cart-items");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log('Krepšelio turinys:', cart);
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
                    <div class="price-and-quantity">
                        <div class="price-info">
                            <p>Vieneto kaina: <span>${item.price.toFixed(2)} €</span></p>
                            <p>Bendra kaina: <span>${(item.price * item.quantity).toFixed(2)} €</span></p>
                        </div>
                        <div class="quantity-controls">
                            <button class="decrease-quantity" data-id="${item.id}" data-type="${item.type}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-id="${item.id}" data-type="${item.type}">+</button>
                        </div>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}" data-type="${item.type}">&times;</button>
            `;
    
                cartItemsContainer.appendChild(cartItem);
            });
    
            // Pridėti įvykių klausytojus mygtukams
            document.querySelectorAll(".remove-item").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.dataset.id;
                    const productType = e.target.dataset.type;
                    removeFromCart(productId, productType);
                });
            });
    
            document.querySelectorAll(".increase-quantity").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.dataset.id;
                    const productType = e.target.dataset.type;
                    changeQuantity(productId, productType, 1);
                });
            });
    
            document.querySelectorAll(".decrease-quantity").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.dataset.id;
                    const productType = e.target.dataset.type;
                    changeQuantity(productId, productType, -1);
                });
            });
        }
    
        updateTotalPrice(); // Apskaičiuojame ir atnaujiname bendrą kainą
    }

        // Funkcija pakeisti produkto kiekį
        function changeQuantity(productId, productType, change) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const product = cart.find(item => item.id === parseInt(productId) && item.type === productType);
        
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
function removeFromCart(productId, productType) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== parseInt(productId) || item.type !== productType); // Pašaliname produktą pagal ID ir tipą
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

function getApiUrl() {
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    return `/Public/src/api/${currentPage}.json`;
}

//Funkcija prideti i krepseli
function addToCart(productId) {
    console.log(`Pridedamas produktas su ID: ${productId}`);
    const apiUrl = getApiUrl(); // Naudojame dinamiškai nustatytą API kelią

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Klaida: ${response.status} (${response.statusText})`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Gauti duomenys iš API:', data);
            if (data.category && data.category.products) {
                const product = data.category.products.find(item => item.id === parseInt(productId));

                if (product) {
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    const existingProduct = cart.find(item => item.id === product.id && item.type === product.type);

                    if (existingProduct) {
                        existingProduct.quantity += 1; // Jei produktas jau yra, didiname kiekį
                    } else {
                        cart.push({
                            id: product.id,
                            type: product.type,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1
                        });
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCartCount();
                    renderCartItems(); // Atnaujiname krepšelį
                } else {
                    console.error("Produktas nerastas API duomenyse.");
                }
            } else {
                console.error("Kategorija 'products' nerasta API duomenyse.");
            }
        })
        .catch(error => console.error("Klaida gaunant API duomenis:", error));
}