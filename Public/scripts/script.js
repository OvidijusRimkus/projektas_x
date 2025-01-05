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

// Inicializuojame funkcijas po komponentų įkėlimo
initializeDropdownMenu();
initializeCartLogic();
loadCategories(); // Pakeista iš loadProducts į loadCategories
});

// Funkcija: Įkelti kategorijas
async function loadCategories() {
const categories = [
    { id: "sampunai", name: "Šampūnai", description: "Šampūnai visų tipų plaukams." },
    { id: "kondicionieriai", name: "Kondicionieriai", description: "Kondicionieriai jūsų plaukų priežiūrai." }
];

const categoriesContainer = document.getElementById('categories-container');

if (categoriesContainer) {
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('category-card');
        categoryCard.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <a href="${category.id}.html">Peržiūrėti produktus</a>
        `;
        categoriesContainer.appendChild(categoryCard);
    });
} else {
    console.error("Nepavyko rasti elemento su klase 'categories-container'.");
}
}


 

// Funkcija: Įkelti produktus iš API
async function loadProducts() {
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    const apiUrl = `/Public/src/api/${currentPage}.json`;

    console.log('Dabartinis puslapis:', currentPage);

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('Gauti duomenys iš API:', data);

        if (data.category && data.category.products) {
            const products = data.category.products;
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
            } else {
                console.error("Nepavyko rasti elemento su klase 'product-container'.");
            }
        } else {
            console.error("Kategorijos duomenys nerasti.");
        }
    } catch (error) {
        console.error("API klaida:", error);
    }
}