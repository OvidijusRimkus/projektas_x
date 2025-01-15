// Komponentų įkėlimo funkcija
async function loadComponent(placeholderId, url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        document.getElementById(placeholderId).innerHTML = data;
    } catch (error) {
        console.error(`Klaida įkeliant ${url}:`, error);
    }
}

// Funkcija: Įkelti kategorijas į šoninę juostą
async function loadSidebarCategories() {
    const categoriesUrl = "/Public/src/api/categories.json"; // API su kategorijomis
    const categoriesList = document.querySelector(".categories");

    if (!categoriesList) {
        console.error("Nepavyko rasti šoninės juostos kategorijų elemento.");
        return;
    }

    try {
        const response = await fetch(categoriesUrl);
        if (!response.ok) {
            throw new Error(`Klaida įkeliant kategorijas: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Patikrinkite, kas yra `data`
        const categories = Object.keys(data);

        categories.forEach((categoryKey) => {
            const category = data[categoryKey];

            // Sukuriame kategorijos elementą
            const categoryItem = document.createElement("li");
            categoryItem.classList.add("category-item");
            categoryItem.innerHTML = `
                <a href="/Public/pages/${categoryKey}.html">${categoryKey}</a>
                <button class="toggle-subcategories">▼</button>
                <ul class="subcategories" style="display: none;">
                    <!-- Subkategorijos bus įkeltos čia -->
                </ul>
            `;

            // Sukuriame subkategorijų sąrašą
            const subcategoriesList = categoryItem.querySelector(".subcategories");
            category.forEach((subcategory) => {
                const subcategoryItem = document.createElement("li");
                subcategoryItem.innerHTML = `
                    <a href="/Public/pages/${subcategory.id}.html">${subcategory.name}</a>
                `;
                subcategoriesList.appendChild(subcategoryItem);
            });

            // Pridedame įvykį mygtukui subkategorijoms atidaryti/uždaryti
            const toggleButton = categoryItem.querySelector(".toggle-subcategories");
            toggleButton.addEventListener("click", () => {
                const isVisible = subcategoriesList.style.display === "block";
                subcategoriesList.style.display = isVisible ? "none" : "block";
            });

            // Pridedame kategorijos elementą į sąrašą
            categoriesList.appendChild(categoryItem);
        });
    } catch (error) {
        console.error("Klaida įkeliant kategorijas:", error);
    }
}

// Inicializuojame šoninę juostą ir komponentus, kai DOM yra užkrautas
document.addEventListener("DOMContentLoaded", async () => {
    // Įkelti šoninę juostą
    await loadComponent('sidebar-placeholder', '/Public/components/sidebar.html');
    loadSidebarCategories();
});