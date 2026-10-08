type cartItem={
    productId:number,
    quantity:number
}

function getCart():cartItem[]{
    const data=localStorage.getItem("cart")
    if(!data) return[]
    return JSON.parse(data) as cartItem[]
}

function saveCart(cart:cartItem[]):void{
    localStorage.setItem("cart",JSON.stringify(cart))
}

export {
    getCart,
    saveCart
};

export type {
    cartItem
};