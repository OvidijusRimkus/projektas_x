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

    // Patikriname, ar esame kategorijų puslapyje
    if (document.querySelector(".categories-container")) {
        loadCategories();
    }

    // Patikriname, ar esame produktų puslapyje
    if (document.querySelector(".product-container")) {
        loadProducts();
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