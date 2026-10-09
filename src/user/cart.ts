type cartItem = {
    productId: number,
    quantity: number
}

type Product = {
    id: number;
    name: string;
    description: string;
    category: number;
    price: number;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

}



declare const bootstrap: {
    Modal: {
        new(element: HTMLElement): {
            show(): void;
            hide(): void;
        };
        getOrCreateInstance(element: HTMLElement): {
            show(): void;
            hide(): void;
        };
    };
};




function getCart(): cartItem[] {
    const data = localStorage.getItem("cart")
    if (!data) return []
    return JSON.parse(data) as cartItem[]
}

function saveCart(cart: cartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(cart))
}

function getProduct(): Product[] {
    const data = localStorage.getItem("products")
    if (!data) return []
    return JSON.parse(data) as Product[]
}


const cartItemsContainer = document.querySelector<HTMLDivElement>("#cartItems");
const emptyCart = document.querySelector<HTMLDivElement>("#emptyCart");
const cartSubtotal = document.querySelector<HTMLElement>("#cartSubtotal");
const cartGst = document.querySelector<HTMLElement>("#cartGst");
const cartGrandTotal = document.querySelector<HTMLElement>("#cartGrandTotal");
const checkoutBtn = document.querySelector<HTMLButtonElement>("#checkoutBtn");
const checkoutModal = document.querySelector<HTMLElement>("#checkoutModal");
const confirmOrderBtn = document.querySelector<HTMLButtonElement>("#confirmOrderBtn");




function displayCart(): void {
    const cart = getCart()
    const products = getProduct()

    if (!cartItemsContainer || !emptyCart) return

    cartItemsContainer.innerHTML = ""

    if (cart.length === 0) {
        emptyCart.classList.remove("d-none")
        EmptyCart()
        return
    }
    emptyCart.classList.add("d-none")

    cart.forEach((c) => {
        const prod = products.find((p) => p.id === c.productId)
        if (!prod) return
        const div = document.createElement("div")
        div.className = "card mb-3 p-3";

        div.innerHTML = `
             <div class="d-flex align-items-center gap-3">
                <img
                    src="${prod.imageUrl}"
                    alt="${prod.name}"
                    width="80"
                    height="80"
                    style="object-fit: cover;"
                >

                <div>
                    <h5>${prod.name}</h5>
                    <p class="mb-1">₹${prod.price.toFixed(2)}</p>
                    
                    <div class="d-flex align-items-center gap-2 mt-2">
                        <button class="btn btn-sm btn-outline-secondary decreaseBtn">−</button>
                        <span>${c.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increaseBtn">+</button>
                    </div>

                </div>
            </div>
        `

        const decreaseBtn = div.querySelector<HTMLButtonElement>(".decreaseBtn")
        const increaseBtn = div.querySelector<HTMLButtonElement>(".increaseBtn")

        decreaseBtn?.addEventListener("click", () => {
            const cart = getCart()
            const cartItem = cart.find(c => c.productId === prod.id)
            if (!cartItem) return
            cartItem.quantity--;
            const updateCart = cart.filter(item => item.quantity > 0)
            saveCart(updateCart)
            let totalQuantity = 0;
            updateCart.forEach((item) => {
                totalQuantity += item.quantity;
            });
            document.querySelector("#cartCount")!.textContent = String(totalQuantity);
            displayCart()
            updateCartTotal()
        })

        increaseBtn?.addEventListener("click", () => {
            const cart = getCart()
            const cartItem = cart.find(c => c.productId === prod.id)
            if (!cartItem) return
            cartItem.quantity++;
            saveCart(cart)
            saveCart(cart);
            let totalQuantity = 0;
            cart.forEach((item) => {
                totalQuantity += item.quantity;
            });
            document.querySelector("#cartCount")!.textContent = String(totalQuantity);
            displayCart()
            updateCartTotal()
        })

        cartItemsContainer.appendChild(div)
    })

}

function updateCartTotal(): void {
    const cart = getCart()
    const products = getProduct()

    if (!cartSubtotal || !cartGst || !cartGrandTotal) return
    let subtotal = 0
    cart.forEach((c) => {
        const product = products.find(prod => prod.id === c.productId)
        if (product) {
            subtotal += product.price * c.quantity
        }
    })
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst

    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`
    cartGst.textContent = `₹${gst.toFixed(2)}`;
    cartGrandTotal.textContent = `₹${grandTotal.toFixed(2)}`;
}

function EmptyCart(): void {
    if (!checkoutBtn) return
    checkoutBtn.disabled = getCart().length === 0
}


checkoutBtn?.addEventListener("click", () => {
    if (getCart().length === 0) return;
    if (!checkoutModal) return;

    const modal = new bootstrap.Modal(checkoutModal);
    modal.show();
});


confirmOrderBtn?.addEventListener("click", () => {
    saveCart([]);
    displayCart();
    updateCartTotal();
    EmptyCart();
    document.querySelector("#cartCount")!.textContent = "0";

    if (checkoutModal) {
        bootstrap.Modal.getOrCreateInstance(checkoutModal).hide();
    }

});





displayCart()
updateCartTotal()
EmptyCart()









export {
    getCart,
    saveCart
};

export type {
    cartItem
};