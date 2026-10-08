import { getCategory } from "./category.js";
type Product = {
    id: number,
    name: string,
    description: string,
    category: number,
    imageUrl: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
};

function saveProducts(products: Product[]): void {
    localStorage.setItem("products", JSON.stringify(products))
}
function getProducts(): Product[] {
    const data = localStorage.getItem("products")
    if (!data) return []
    return JSON.parse(data) as Product[]
}

const addProductBtn = document.querySelector<HTMLButtonElement>("#addProductBtn");
const productFormContainer = document.querySelector<HTMLDivElement>("#productFormContainer");
const productForm = document.querySelector<HTMLFormElement>("#productForm");
const productNameInput = document.querySelector<HTMLInputElement>("#productName");
const productDescriptionInput = document.querySelector<HTMLTextAreaElement>("#productDescription");
const productImageUrlInput = document.querySelector<HTMLInputElement>("#productImageUrl");
const productCategoryInput = document.querySelector<HTMLSelectElement>("#productCategory");
const productIsActiveInput = document.querySelector<HTMLInputElement>("#productIsActive");
const productTableBody = document.querySelector<HTMLTableSectionElement>("#productTableBody");


addProductBtn?.addEventListener("click", () => {
    productFormContainer?.classList.remove("d-none")
})

productForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
        !productForm ||
        !productNameInput ||
        !productDescriptionInput ||
        !productImageUrlInput ||
        !productCategoryInput ||
        !productIsActiveInput
    ) {
        return;
    }

    const name = productNameInput.value.trim();
    const desc = productDescriptionInput.value.trim();
    const imageUrl = productImageUrlInput.value.trim();
    const category = Number(productCategoryInput.value);
    const isActive = productIsActiveInput.checked;
    if (!name || !desc || !imageUrl || !category) {
        return;
    }

    const products = getProducts()
    if (editProductId !== null) {
        const product = products.find(prod => prod.id === editProductId)
        if (product) {
            product.name = name;
            product.description = desc;
            product.imageUrl = imageUrl;
            product.category = category;
            product.isActive = isActive;
            product.updatedAt = new Date().toISOString();
        }

        editProductId = null;
        alert("Product updated successfully");
    } else {
        const newProduct: Product = {
            id: Date.now(),
            name: name,
            description: desc,
            category: category,
            imageUrl: imageUrl,
            isActive: isActive,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        products.push(newProduct)
        alert("Product created successfully");
    }
    saveProducts(products)
    displayProducts()
    productForm.reset()

    productFormContainer?.classList.add("d-none")

})
function displayCategoriesOptions(): void {
    if (!productCategoryInput) return
    const categories = getCategory();
    categories.forEach((category) => {
        const option = document.createElement("option")
        option.value = category.id.toString()
        option.textContent = category.name

        productCategoryInput.appendChild(option)
    })
}
displayCategoriesOptions()

function displayProducts(): void {
    const products = getProducts();
    const categories = getCategory()
    if (!productTableBody) return
    productTableBody.innerHTML = ""
    products.forEach((product, i) => {

        const category = categories.find(cat => cat.id === product.category)

        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${i + 1}</td>

            <td>
                <img
                    src="${product.imageUrl}"
                    alt="${product.name}"
                    width="60"
                    height="60"
                    style="object-fit: cover;"
                >
            </td>

            <td>${product.name}</td>

            <td>${product.description}</td>

            <td>${category?.name}</td>

            <td>
                ${product.isActive ? "Active" : "Inactive"}
            </td>

            <td>
                <button class="btn btn-sm btn-warning editProductBtn">
                    Edit
                </button>

                <button class="btn btn-sm btn-danger deleteProductBtn">
                    Delete
                </button>
            </td>`
        productTableBody.appendChild(row)

        const deleteBtn = row.querySelector<HTMLButtonElement>(".deleteProductBtn")
        deleteBtn?.addEventListener("click", () => {
            deleteProduct(product.id)
        })
        const editBtn = row.querySelector<HTMLButtonElement>(".editProductBtn");
        editBtn?.addEventListener("click", () => {
            editProduct(product.id);
        });
    })
}
displayProducts();

function deleteProduct(id: number): void {
    const products = getProducts()
    const updatedProducts = products.filter(prod => prod.id !== id)
    saveProducts(updatedProducts)
    displayProducts();
}

let editProductId: number | null = null;
function editProduct(id: number): void {
    const products = getProducts();
    const product = products.find(prod => prod.id === id)
    if (
        !product ||
        !productNameInput ||
        !productDescriptionInput ||
        !productImageUrlInput ||
        !productCategoryInput ||
        !productIsActiveInput
    ) {
        return;
    }
    editProductId = id;
    productNameInput.value = product.name;
    productDescriptionInput.value = product.description;
    productImageUrlInput.value = product.imageUrl;
    productCategoryInput.value = product.category.toString();
    productIsActiveInput.checked = product.isActive;

    productFormContainer?.classList.remove("d-none")


}


