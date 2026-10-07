type Category = {
    id: number,
    name: string
}

function saveCategory(categories: Category[]): void {
    localStorage.setItem("categories", JSON.stringify(categories))
}
function getCategory(): Category[] {
    const data = localStorage.getItem("categories")
    if (!data) return []

    return JSON.parse(data) as Category[]
}

const manageCategoriesBtn = document.querySelector<HTMLButtonElement>("#manageCategoriesBtn");
const manageProductsBtn = document.querySelector<HTMLButtonElement>("#manageProductsBtn");
const categorySection = document.querySelector<HTMLElement>("#categorySection");
const productSection = document.querySelector<HTMLElement>("#productSection");
const addCategory = document.querySelector<HTMLButtonElement>("#addCategoryBtn")
const categoryFormContainer = document.querySelector<HTMLDivElement>("#categoryFormContainer")
const categoryForm = document.querySelector<HTMLFormElement>("#categoryForm")
const categoryNameInput = document.querySelector<HTMLInputElement>("#categoryName")
const categoryTableBody = document.querySelector<HTMLTableSectionElement>("#categoryTableBody")

manageCategoriesBtn?.addEventListener("click", () => {
    categorySection?.classList.remove("d-none")
    productSection?.classList.add("d-none")
})

manageProductsBtn?.addEventListener("click", () => {
    categorySection?.classList.add("d-none")
    productSection?.classList.remove("d-none")
})

// add
addCategory?.addEventListener("click", () => {
    categoryFormContainer?.classList.remove("d-none")
})

categoryForm?.addEventListener("submit", (e) => {
    e.preventDefault()
    if (!categoryForm || !categoryNameInput) return

    const name = categoryNameInput?.value.trim();
    if (name === "") return

    const categories = getCategory()
    if (editCategoryId!==null) {
        const category=categories.find(cat=>cat.id===editCategoryId)
        if(category){
            category.name=name
        }
        editCategoryId=null
    } else {
        const newCategory: Category = {
            id: Date.now(),
            name: name
        }

        categories.push(newCategory)
    }

    saveCategory(categories)

    displayCategories()

    categoryForm.reset()
    categoryFormContainer?.classList.add("d-none")

})

// view
function displayCategories(): void {
    const categories = getCategory()
    if (!categoryTableBody) return;
    categoryTableBody.innerHTML = ""
    categories.forEach((category, i) => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${category.name}</td>
            <td>
                <button class="btn btn-sm btn-warning editCategoryBtn">
                    Edit
                </button>

                <button class="btn btn-sm btn-danger deleteCategoryBtn">
                    Delete
                </button>
            </td>
        `
        categoryTableBody.appendChild(row)

        const deleteBtn = row.querySelector<HTMLButtonElement>(".deleteCategoryBtn")
        deleteBtn?.addEventListener("click", () => {
            deleteCategory(category.id)
        })
        const editBtn = row.querySelector<HTMLButtonElement>(".editCategoryBtn");
        editBtn?.addEventListener("click", () => {
            editCategory(category.id);
        });
    })
}
displayCategories()

function deleteCategory(id: number): void {
    const categories = getCategory()
    const updatedCategory = categories.filter(category => category.id !== id)
    saveCategory(updatedCategory)
    displayCategories()
}

let editCategoryId: number | null = null
function editCategory(id: number): void {
    const categories = getCategory()
    const category = categories.find(category => category.id === id);
    if (!category || !categoryNameInput || !categoryFormContainer) return;
    editCategoryId = id;
    categoryNameInput.value = category.name;
    categoryFormContainer.classList.remove("d-none");
}


export {
    getCategory
}