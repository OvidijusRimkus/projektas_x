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
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (productsLink && dropdownMenu) {
        // Pagrindinio meniu atidarymas/uždarymas
        productsLink.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownMenu.style.display =
                dropdownMenu.style.display === "block" ? "none" : "block";
        });

        // Paspaudus už meniu ribų, jį uždaryti
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".dropdown-menu") && !e.target.closest("#products-link")) {
                dropdownMenu.style.display = "none";
            }
        });

        
        // Subkategorijų logika: Plaukams meniu
        const plaukamsDropdown = document.querySelector(".dropdown");
        const plaukamsLink = document.getElementById("plaukams-link");
        const subcategoryMenu = document.querySelector(".subcategory-menu");

        if (plaukamsDropdown && plaukamsLink && subcategoryMenu) {
            // Užvedus pelę ant "Plaukams", parodome subkategorijas
            plaukamsLink.addEventListener("mouseover", async () => {
                if (subcategoryMenu.children.length === 0) {
                    subcategoryMenu.innerHTML = "<li>Kraunama...</li>"; // Laikinas turinys

                    try {
                        const response = await fetch("/Public/src/api/categories.json");
                        if (!response.ok) {
                            throw new Error("Nepavyko įkelti subkategorijų.");
                        }

                        const data = await response.json();
                        const subcategories = data.plaukams;

                        subcategoryMenu.innerHTML = ""; // Išvalome esamą turinį
                        subcategories.forEach((subcategory) => {
                            const subcategoryItem = document.createElement("li");
                            subcategoryItem.innerHTML = `
                                <a href="/Public/pages/${subcategory.id}.html">${subcategory.name}</a>
                            `;
                            subcategoryMenu.appendChild(subcategoryItem);
                        });
                    } catch (error) {
                        console.error("Klaida įkeliant subkategorijas:", error);
                        subcategoryMenu.innerHTML = "<li>Klaida kraunant subkategorijas.</li>";
                    }
                }
                subcategoryMenu.style.display = "block";
            });
            subcategoryMenu.addEventListener("mouseover", () => {
                subcategoryMenu.style.display = "block";
                console.log("Mouseover on subcategory menu, keep it shown");
            });

            // Paslėpiame submeniu, kai pelė yra patraukiama nuo "Plaukams"
            plaukamsLink.addEventListener("mouseleave", () => {
                subcategoryMenu.style.display = "none";
                console.log("Mouse left plaukamsDropdown, subcategory menu hidden");
            });
        }
    }
}

// Inicializuojame meniu, kai DOM yra užkrautas
document.addEventListener("DOMContentLoaded", () => {
    initializeDropdownMenu();
});