const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("modal-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-counter");
const addressInput = document.getElementById("address");
const warnAddress = document.getElementById("address-warn");

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener('click',function(){
    updateCartModal();
    cartModal.style.display ="flex"     
})

//Fechar o modal quando clicar fora do carrinho
cartModal.addEventListener('click',function(event){
     if(event.target === cartModal){
        cartModal.style.display="none"
     }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display="none"
})

menu.addEventListener("click",function(event){
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")
    //console.log(parentButton);
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"));
         //console.log(name);
         //console.log(price);
        //Adicionar no carrinho;
        addToCart(name,price);
    }

})

//Função para adicionar no carrinho
function addToCart(name,price){
    //alert(`O item é ${name} com o preço ${price}`);
    const existingItem = cart.find(item => item.name === name)
    if (existingItem){
        //Se o item já existe, aumenta apenas a quantidade +1
        //console.log(existingItem);
        existingItem.quantity += 1;
    }else{
        cart.push({
            name:name,
            price:price,
            quantity: 1
        })
    
    }
    updateCartModal();
}


//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        console.log(item);
        const cartItem = document.createElement("div");
        cartItem.classList.add("flex","justify-between","mb-4","flex-col");
        cartItem.innerHTML= `
                           <div class="flex justify-between mb-4 flex-col">
                               <div>
                               <p class="font-bold">${item.name}</p>
                               <p>${item.quantity}</p>
                               <p class="font-medium mt-2">$ ${item.price.toFixed(2)}</p>
                               </div>
                                   <button class="remove-from-cart-btn" data-name="${item.name}">
                                   Remover
                                   </button>
                           </div>
                           `
    total+= item.price * item.quantity;

    cartItemsContainer.appendChild(cartItem);

    })
    cartTotal.textContent =total.toLocaleString("us", {
        style: "currency",
        currency: "USD"
    });
    cartCounter.innerHTML = cart.length;
}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");
        //console.log(name);
       removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !==-1){
        const item  = cart[index];
        //console.log(item);
        if(item.quantity >1){
            item.quantity -=1;
            updateCartModal();
            return;
        }
        cart.splice(index,1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !==""){
        addressInput.classList.remove("border-red-500");
        warnAddress.classList.add("hidden");
    }

})


//Finalizar pedido
checkoutBtn.addEventListener("click",function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
            Toastify({
                text: "Ops Restaurant Closed!",
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#ef4444",
                },
        }).showToast();
        return;
    }
    if(cart.length === 0) return;
    if(addressInput.value ===""){
        warnAddress.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api Whatsaap
    //console.log(cart);
    const cartItems = cart.map((item) =>{
        return (
            `${item.name} Quantity: (${item.quantity}) Price: $ ${item.price} |`
        )
    }).join("")
    //console.log(cartItems);
    const message =encodeURIComponent(cartItems);
    const phone ='7199205058'
    window.open(`https://wa.me/${phone}?text=${message} Addrres:${addressInput.value}`,"_blank")
    cart = [];
    
    updateCartModal();
})


//Verificar a hora e manipular o card horário
function checkRestaurantOpen(){
  const data = new Date();
  const hour = data.getHours();
  return hour >=18 && hour < 22;
  //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen =checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}