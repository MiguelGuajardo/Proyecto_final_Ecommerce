let btnMenu = document.getElementById("btn-menu");
let mainNav = document.getElementById("main-nav")
btnMenu.addEventListener("click", function(){
    mainNav.classList.toggle("mostrar")
})

let btnCart = document.getElementById("btn-cart");
let shoppingCart = document.getElementById("visible")
btnCart.addEventListener("click", function(){
    shoppingCart.classList.remove("hide")
    shoppingCart.classList.toggle("visible")
})

let btnHide = document.getElementById("btn_hide")
btnHide.addEventListener("click",()=>{
    shoppingCart.classList.remove("visible")
    shoppingCart.classList.toggle("hide")
})