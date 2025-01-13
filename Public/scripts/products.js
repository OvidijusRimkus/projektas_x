// Funkcija: Įkelti kategorijas į puslapį „Plaukams“
async function loadCategories() {
    const categories = [
        {
            id: 'sampunai',
            name: 'Šampūnai',
            description: 'Įvairūs šampūnai jūsų plaukams.'
        },
        {
            id: 'kondicionieriai',
            name: 'Kondicionieriai',
            description: 'Geriausi kondicionieriai jūsų plaukams.'
        }
    ];

    const categoriesContainer = document.querySelector(".categories-container");

    if (categoriesContainer) {
        categoriesContainer.innerHTML = ""; // Išvalome esamą turinį

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
}

// Funkcija: Įkelti visus produktus iš šampūnų ir kondicionierių JSON
async function loadAllProducts() {
    const apiUrls = [
        '/Public/src/api/sampunai.json',
        '/Public/src/api/kondicionieriai.json'
    ];

    const allProducts = [];
    for (const apiUrl of apiUrls) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Klaida įkeliant ${apiUrl}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.category && data.category.products) {
                allProducts.push(...data.category.products);
            } else {
                console.error(`Produktai nerasti JSON faile: ${apiUrl}`);
            }
        } catch (error) {
            console.error(`Klaida įkeliant ${apiUrl}:`, error);
        }
    }

    renderAllProducts(allProducts);
}

// Funkcija: Atvaizduoti visus produktus
function renderAllProducts(products) {
    const productGrid = document.querySelector(".product-grid");
    if (!productGrid) {
        console.error("Nepavyko rasti elemento su klase 'product-grid'.");
        return;
    }

    productGrid.innerHTML = ""; // Išvalome esamą turinį

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price.toFixed(2)} €</p>
            <button class="add-to-cart" data-id="${product.id}">Į krepšelį</button>
        `;
        productGrid.appendChild(productCard);
    });

    // Pridėti įvykių klausytojus mygtukams „Į krepšelį“
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

// Funkcija: Inicializuoti puslapį „Plaukams“
async function initializePlaukamsPage() {
    await loadCategories(); // Įkelia kategorijų korteles
    await loadAllProducts(); // Įkelia visus produktus
}

// Funkcija: Įkelti produktus iš JSON pagal dabartinį puslapį
async function loadProducts() {
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    const apiUrl = `/Public/src/api/${currentPage}.json`;

    console.log('Dabartinis puslapis:', currentPage);
    console.log('Naudojamas API kelias:', apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Klaida įkeliant ${apiUrl}: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.category || !data.category.products || !Array.isArray(data.category.products)) {
            throw new Error("JSON neturi tinkamo 'category.products' masyvo arba formatas netinkamas");
        }

        const products = data.category.products;
        const productContainer = document.querySelector(".product-container");
        if (productContainer) {
            productContainer.innerHTML = "";

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

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.dataset.id;
                    addToCart(productId);
                });
            });
        } else {
            console.error("Nepavyko rasti elemento su klase 'product-container'.");
        }
    } catch (error) {
        console.error("API klaida:", error);
    }
}

// Inicializacija
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    if (currentPage === "plaukams") {
        initializePlaukamsPage();
    } else {
        loadProducts();
    }
});