// Funkcija: Įkelti kategorijas iš API
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
}

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
        console.log('Gauti duomenys iš API:', data);

        // Patikriname, ar JSON turi tinkamą struktūrą
        if (!data.category || !data.category.products || !Array.isArray(data.category.products)) {
            throw new Error("JSON neturi tinkamo 'category.products' masyvo arba formatas netinkamas");
        }

        const products = data.category.products;
        const productContainer = document.querySelector(".product-container");
        if (productContainer) {
            productContainer.innerHTML = ""; // Išvalome esamą turinį

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
        } else {
            console.error("Nepavyko rasti elemento su klase 'product-container'.");
        }
    } catch (error) {
        console.error("API klaida:", error);
    }
}

