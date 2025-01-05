document.addEventListener("DOMContentLoaded", async () => {
    // Įkelti header ir footer
    await loadComponent('header-placeholder', '/Public/components/header.html');
    await loadComponent('footer-placeholder', '/Public/components/footer.html');

    // Inicializuojame krepšelio logiką
    initializeCartLogic();

    // Patikriname dabartinį puslapį
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    if (currentPage === "sampunai" || currentPage === "kondicionieriai") {
        loadProducts(); // Įkelti produktus tik kategorijų puslapiuose
    }
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

// Funkcija: Įkelti kategorijas iš API
async function loadCategories() {
    const apiUrl = "/Public/src/api/categories.json"; // API kelias

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.categories) {
            const categories = data.categories;
            const categoriesContainer = document.querySelector(".categories-container");

            if (categoriesContainer) {
                // Sukuriame kategorijų korteles
                categories.forEach((category) => {
                    const categoryCard = document.createElement("div");
                    categoryCard.classList.add("category-card");

                    categoryCard.innerHTML = `
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                        <a href="/Public/pages/${category.id}.html">Peržiūrėti</a>
                    `;
                    categoriesContainer.appendChild(categoryCard);
                });
            } else {
                console.error("Nepavyko rasti elemento su klase 'categories-container'.");
            }
        } else {
            console.error("Kategorijos duomenys nerasti.");
        }
    } catch (error) {
        console.error("API klaida:", error);
    }
}

// Funkcija: Įkelti produktus iš tinkamo JSON failo
async function loadProducts() {
    // Gaukite dabartinio puslapio pavadinimą
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");

    // Dinamiškai nustatykite JSON kelio pavadinimą
    const apiUrl = `/Public/src/api/${currentPage}.json`;

    console.log('Dabartinis puslapis:', currentPage);
    console.log('Naudojamas API kelias:', apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Klaida įkeliant ${apiUrl}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Gauti duomenys iš API:', data);

        // Pasirinkite DOM elementą, kuriame rodyti produktus
        const productContainer = document.querySelector(".product-container");
        if (productContainer) {
            // Sukuriame produktų korteles
            data.products.forEach((product) => {
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
        } else {
            console.error("Nepavyko rasti elemento su klase 'product-container'.");
        }
    } catch (error) {
        console.error("API klaida:", error);
    }
}