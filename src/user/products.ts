import { getCategory } from "../admin/category.js";
import { getCart, saveCart } from "./cart.js";
type Product = {
    id: number;
    name: string;
    description: string;
    category: number;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

function getProducts(): Product[] {
    const data = localStorage.getItem("products")

    if (!data) return []
    return JSON.parse(data) as Product[]
}

const productList = document.querySelector<HTMLDivElement>("#productList")
const emptyProduct = document.querySelector<HTMLDivElement>("#emptyProducts")
const searchProduct = document.querySelector<HTMLInputElement>("#searchProduct")
const filterCategory = document.querySelector<HTMLSelectElement>("#filterCategory");
const sortProduct = document.querySelector<HTMLSelectElement>("#sortProduct")
const cartCount = document.querySelector<HTMLSpanElement>("#cartCount")


function displayProducts(): void {
    if (!productList || !emptyProduct) {
        return
    }
    const products = getProducts()
    let activePro = products.filter(product => product.isActive)
    const searchValue = searchProduct?.value.trim().toLowerCase()
    const categoryValue = filterCategory?.value
    const sortValue = sortProduct?.value

    if (searchValue) {
        activePro = activePro.filter(aproduct => aproduct.name.toLowerCase().includes(searchValue))
    }

    if (categoryValue) {
        activePro = activePro.filter(fproduct => fproduct.category === Number(categoryValue))
    }
    if (sortValue === "Asc") {
        activePro.sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortValue === "Desc") {
        activePro.sort((a, b) => b.name.localeCompare(a.name))
    }
    if (sortValue === "newest") {
        activePro.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    if (sortValue === "oldest") {
        activePro.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }

    productList.innerHTML = ""
    if (activePro.length == 0) {
        emptyProduct.classList.remove("d-none")
        return
    } else {
        emptyProduct.classList.add("d-none")
        const categories = getCategory();

        activePro.forEach((prod) => {
            const category = categories.find(cat => cat.id === prod.category)
            const col = document.createElement("div")
            col.className = "col"

            col.innerHTML = `
            <div class="card h-100 shadow-sm">

                <img
                    src="${prod.imageUrl}"
                    class="card-img-top"
                    alt="${prod.name}"
                    style="height: 220px; object-fit: cover;"
                >

                <div class="card-body d-flex flex-column">

                    <h5 class="card-title">
                        ${prod.name}
                    </h5>

                    <p class="text-muted small mb-2">
                        ${category?.name}
                    </p>

                    <p class="card-text">
                        ${prod.description}
                    </p>

                    <button class="btn btn-dark mt-auto addToCartBtn">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;
            productList.appendChild(col)
            const addToCartBtn = col.querySelector<HTMLButtonElement>(".addToCartBtn");

            addToCartBtn?.addEventListener("click", () => {
                addToCart(prod.id);

            });
        })

    }

}
displayProducts()
searchProduct?.addEventListener("input", () => {
    displayProducts()
})
filterCategory?.addEventListener("change", () => {
    displayProducts()
})
sortProduct?.addEventListener("change", () => {
    displayProducts()
})


function displayCategoryOption(): void {
    const categories = getCategory()
    categories.forEach((cat) => {
        const option = document.createElement("option")
        option.value = cat.id.toString()
        option.textContent = cat.name
        filterCategory?.appendChild(option)
    })
}
displayCategoryOption()


function updateCartCount(): void {
    const cart = getCart();
    let totalQuan = 0
    for (let item of cart) {
        totalQuan += item.quantity;
    }
    if (cartCount) {
        cartCount.textContent = totalQuan.toString()
    }
}
function addToCart(productId: number): void {
    const cart = getCart()
    const cartItem = cart.find(c => c.productId === productId)

    if (cartItem) return
    cart.push({ productId: productId, quantity: 1 })
    saveCart(cart)
    updateCartCount()
}
