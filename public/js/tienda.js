const addToShoppingCartButttons = document.querySelectorAll(".addToCart")
addToShoppingCartButttons.forEach(addToCartButton =>{
    addToCartButton.addEventListener("click", addToCartClicked)
})

const shoppingCartItemContainer = document.querySelector(".shoppingCartItemContainer")

const comprarButton = document.querySelector(".comprarButton")
const popUp = document.querySelector(".pop-up")
const popUpBtnClose = document.querySelector("#close")

comprarButton.addEventListener("click", comprarButtonClicked)

function addToCartClicked(event){
    const button = event.target
    const product = button.closest(".product")
    const productTitle = product.querySelector(".product__title").textContent
    const productPrice = product.querySelector(".product__price").textContent
    const productImage = product.querySelector(".product__img").src
    const itemId = product.dataset.id

    addProductToShoppingCart(productTitle,productPrice,productImage,itemId)
}
function addProductToShoppingCart(productTitle,productPrice,productImage,itemId){
    
    const elementsTitle = shoppingCartItemContainer.getElementsByClassName("shoppingCartItemTitle")
    for (let i = 0; i < elementsTitle.length; i++) {
        if(elementsTitle[i].innerText === productTitle){
            let elementQuantity = elementsTitle[i].closest(".shoppingCartItem").querySelector(".shoppingCartItemQuantity")
            elementQuantity.value++;
            updateShoppingCartTotal();
            return;
        }
    }

    const shoppingCartRow = document.createElement("div")
    const shoppingCartContent= `
    <div class="shopping__cart-item shoppingCartItem" data-id=${itemId}>
        <img src=${productImage} alt=${productTitle} class="shopping__cart-itemImage">
        <h3 class="shopping__cart-itemTitle shoppingCartItemTitle">${productTitle}</h3>
        <h3 class="shopping__cart-itemPrice">${productPrice}</h3>
        <div class="shopping__cart-quantity">
            <input class="shoppingCartItemQuantity" type="number" name="" id="" value="1">
            <button class="btn_delete"><i class="fa-solid fa-trash"></i></button>
        </div>
    </div>
    `
    shoppingCartRow.innerHTML = shoppingCartContent
    shoppingCartItemContainer.append(shoppingCartRow)

    shoppingCartRow.querySelector(".btn_delete").addEventListener("click", removeShoppingCartItem)

    shoppingCartRow.querySelector(".shoppingCartItemQuantity").addEventListener("change",quantityChanged)

    updateShoppingCartTotal()
}
function updateShoppingCartTotal(){
    let total = 0
    const shoppingCartTotal = document.querySelector(".shoppingCartTotal")

    const shoppingCartItems =  document.querySelectorAll(".shoppingCartItem")
    
    shoppingCartItems.forEach(shoppingCartItem =>{
        const shoppingCartItemPriceElement = shoppingCartItem.querySelector(".shopping__cart-itemPrice")
        const shoppingCartItemPrice = Number(shoppingCartItemPriceElement.textContent.replace("$",""))
        const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(".shoppingCartItemQuantity")
        const shoppingCartItemQuantity = Number(shoppingCartItemQuantityElement.value)
        total = total + shoppingCartItemPrice * shoppingCartItemQuantity
    })
    shoppingCartTotal.innerHTML = `$${total.toFixed(2)}`
}

function removeShoppingCartItem(event){
    const buttonClicked = event.target;
    buttonClicked.closest(".shoppingCartItem").remove()
    updateShoppingCartTotal()
}

function quantityChanged(event){
    const input = event.target
    input.value <= 0 ? input.value = 1 : null
    updateShoppingCartTotal()
}

function comprarButtonClicked(){
    const shoppingCartItems = getItemsInShoppingCart()
    
    if(shoppingCartItems.length > 0){
        addToLocalStorage("shoppingCart",shoppingCartItems)
        popUp.classList.toggle("mostrar")
        sendFrontToBack(shoppingCartItems)
    }
    popUpClose()
    updateShoppingCartTotal()
}



function sendFrontToBack(shoppingCartItems){
    const subsSend = document.querySelector(".subs-send")
    let obj = {}
    obj.product = shoppingCartItems
    subsSend.addEventListener("click",()=>{
        fetch(`http://localhost:8080/lista`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj),
        });
    })
}
function getItemsInShoppingCart(){
    const shoppingItems = document.querySelectorAll(".shoppingCartItem")
    const arrShoppingCartItem = []
    shoppingItems.forEach(shoppingCartItem =>{
        const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(".shoppingCartItemQuantity")
        const shoppingCartItemQuantity = Number(shoppingCartItemQuantityElement.value)
        const itemId = shoppingCartItem.dataset.id

        const item = {
            id:itemId,
            qty:shoppingCartItemQuantity
        }

        arrShoppingCartItem.push(item)
    })
    return arrShoppingCartItem
}
function addToLocalStorage(key, items){
    localStorage.setItem(key, JSON.stringify(items))
}
function popUpClose(){
    popUpBtnClose.addEventListener("click",()=>{
        localStorage.removeItem("shoppingCart")
        popUp.classList.remove("mostrar")
    })
}
