const productId = window.location.search.split("?id=").pop()

// console.log(productId)


fetch(`https://dummyjson.com/products/${productId}`)
.then(res => res.json())
.then(data => getData(data));
// .then(data => console.log(data))


//  getting the data form the fetch operation
function getData (product) {

    updateUi(product)

}


// updating ui
const productContainer = document.querySelector('.prod-container')

// console.log(productContainer)
function updateUi (prod) {
    const ratings = Array(5).fill().map((_, index) => {
        if (index < Math.round(prod.rating)) {
            return `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill active" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
            `;
        } else {
            return `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
            `;
        }
    }).join('');
    // console.log(prod.title)
    productContainer.innerHTML = `<div class="prod">
    <div class="prod-desc">
        <h2 class=" title">${prod.title}</h2>
        <p class="brand" style="font-weight:600">Brand: ${prod.brand}</p>
        <div class="rating-div">
            <div class="star">
                ${ratings}
                <span class="reviews-count">(100 reviews)</span>
            </div>
        </div>
        <p class="prod-desc">${prod.description}</p>
        <div class="prod-stocks">
            <p class="stocks-count">
               Stocks :  ${prod.stock}
            </p>
        </div>
        <div class="select-quantity">
            <label for="quantity">Select Quantity:</label>
            <select id="quantity" name="quantity">
                <option value="1">1</option>
                <option value="2">2</option>
            </select>
        </div>
        <div class="price">
            <h6 class="market-price">$${prod.price}</h6>
            <h6 class="discount-percent">${prod.discountPercentage}% off</h6>
        </div>
        <h5 class="selling-price">$ ${(prod.price - (prod.price * (prod.discountPercentage/100))).toFixed(2)}</h5>   
        <div class="buttons">
            <button class="add-to-cart" onclick="addToCart()">Add to Cart</button>
            <button class='wishlist'onclick="addToCart()">Add to Wishlist</button>
        </div>
    </div>
    <div class="img-container">
        <div class="thumbnails">
            <div class="thumbnails-imgs">
            ${prod.images.map((img) =>{
                return `<img src=${img} alt="Product images">`
            })}
            </div>
        </div>
        <div class="main-img">
            <img src=${prod.thumbnail} alt="">
        </div>
    </div>
    
</div>`
updateImage()
updateSelectOptn(prod.stock)

}

// adding event listener to the images
function updateImage() {
    const mainImage = document.querySelector('.main-img')
    const images = document.querySelectorAll('.thumbnails-imgs img')

    images.forEach((img) => {
        img.addEventListener('click' , function(){
            mainImage.innerHTML = `<img src=${img.currentSrc}>`
        })
    })
}

// adding stock number to the select option 
function updateSelectOptn (stockCount) {
    const selectOptn = document.getElementById('quantity')
    for(i = 1 ; i<=stockCount; i++){
        selectOptn.innerHTML += `<option value="${i}">${i}</option>`
    }
}

// adding event listner to the add to cart button 
// then saving the data to the local storage 

function addToCart() {
    fetch(`https://dummyjson.com/products/${productId}`)
    .then(res => res.json())
    .then(data => saveProd(data))
}

// saves the addedcartproduct in local storage
function saveProd(clickedItem) {
    const selectedOption = document.querySelector('#quantity')
    const selectedValue = Number(selectedOption.value)
    // let count = 1
    let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    // console.log(cartItems)
    if(cartItems.length == 0){
        clickedItem.count = selectedValue
        cartItems.push(clickedItem)
        localStorage.setItem('cartItems' ,JSON.stringify(cartItems))
    }else {
        let existingItem = cartItems.find(item => item.id === clickedItem.id)
        if(existingItem){
            existingItem.count += selectedValue
        }else{
            clickedItem.count = selectedValue;
            cartItems.push(clickedItem);
        }
        localStorage.setItem('cartItems' ,JSON.stringify(cartItems))
        console.log(JSON.parse(localStorage.getItem('cartItems')))
    }
    updateCart()

}

// cart toogle class
const cartBtn = document.querySelector('.cart-wrapper a')
const cartDiv = document.querySelector('.cart')
const cartList = document.querySelector('.cart-lists')
const overlay = document.querySelector('#overlay')

function cartEvent () {
    // const cart = JSON.parse(localStorage.getItem('cartItems'))

    cartBtn.addEventListener('click', function() {
        cartDiv.classList.toggle('clicked')
        if(cartDiv.classList.contains('clicked')){
            overlay.style.opacity = 1
            overlay.style.visibility = "visible"
            cartDiv.Zindex = 1000
        }
        overlay.addEventListener('click',function(){
            overlay.style.opacity = 0
            overlay.style.visibility = "hidden"
            cartDiv.classList.remove('clicked')
        })
    })
    updateCart()
}
cartEvent()

// for the cart


function updateCart() {
    // const cart = JSON.parse(localStorage.getItem('uniqueCartItems'))
    const cart = JSON.parse(localStorage.getItem('cartItems'))

    // console.log(cart)
    // console.log("hello")
    cartList.innerHTML = ''

    cart.map((item , id) => {
        const total = cart.reduce((acc , item)=>{
            return acc += item.count * (item.price - (item.price * (item.discountPercentage/100)))
        }, 0)
        cartList.innerHTML +=` <div class="cart-items ">
                                <div class="img">
                                    <img class="cart-img" src=${item.thumbnail} alt="">
                                </div>
                                <div class="card-desc">
                                    <div class="info">
                                        <h4>${item.title}</h4>
                                        <p> ${item.description}</p>
                                        <h4>$ ${(item.price - (item.price * (item.discountPercentage/100))).toFixed(2)}</h4>
                                    </div>
                                    <div class="amt" data-id="${item.id}">
                                        <div class="amt-count">
                                            <h4>${item.count}</h4>
                                        </div>
                                        <button class="inc-btn">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                        <button class="dec-btn">
                                            <i class="fa-solid fa-minus"></i>
                                        </button>
                                        </div> 
                                        <div class="item-total">
                                            <h4>${(item.count * (item.price - (item.price * (item.discountPercentage/100)))).toFixed(2) }</h4>
                                        </div>
                                </div>          
                            </div>`
        if(id == cart.length - 1){
            cartList.innerHTML += `
            <div class="total-cost">
                <h4>Total</h4>
                <h4>$${total.toFixed(2)}</h4>
            </div>
            `
        }
    })
    itemCount(cart)
}


// function uniqueCartItem () {
//     // console.log(cartItems)
//     const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    
//     const uniqueItemsWithCount = cartItems.reduce((acc, item) => {
//         const index = acc.findIndex(obj => obj.id === item.id);
    
//         if (index !== -1) {
//             // If the item already exists in acc, increment its count
//             acc[index].count++;
//         } else {
//             // If the item is not in acc, add it with count 1
//             acc.push({ ...item, count: 1 });
//         }
    
//         return acc;
//     }, []);
//     localStorage.setItem("uniqueCartItems", JSON.stringify(uniqueItemsWithCount))
// //    console.log(uniqueItemsWithCount);
//    updateCart()
// //    itemCount(uniqueItemsWithCount)
//     // updateCart(JSON.parse(localStorage.getItem('uniqueCartItems')))
    
// }   
// uniqueCartItem()


// waiting for the event 
// count for increasing and decreasing the amount of item 
function itemCount(items) {
    const amtBtn = document.querySelectorAll('.amt button' )
    // console.log(amtBtn)
    // console.log(items)
    
    amtBtn.forEach((btn) => {
        btn.addEventListener('click', function (e) {
            // console.log(e.currentTarget)
            const parentDiv = e.currentTarget.closest('.amt')
            const countDiv = parentDiv.querySelector('.amt-count h4')
            let count = Number(countDiv.innerText)
            if(e.currentTarget.classList.contains("inc-btn")){
                // countDiv.innerText = Number(count) + 1
                count = count + 1
                countDiv.innerText = count
                const dataId = parentDiv.getAttribute('data-id')
                console.log(items)
                productAmt(dataId , count , items)
            }
            else if (e.currentTarget.classList.contains("dec-btn")){
                count = count - 1
                countDiv.innerText = count
                const dataId = parentDiv.getAttribute('data-id')

                productAmt(dataId , count , items)
            }
        })
    })
}


//  update the the count of the that product and claling the updatecart

function productAmt (id , prodQantity , cartObj) { 


    cartObj.forEach((prod) => {
        // console.log(prod.id)
        if(prod.id == Number(id)) {
            prod.count = prodQantity
        }
    })
    localStorage.setItem("cartItems", JSON.stringify(cartObj))

    if(prodQantity <= 0){
        const filteredCart = cartObj.filter((prod) => {
            if(prod.count != 0){
                return prod
            }
        })
        console.log(filteredCart)
        localStorage.setItem("cartItems", JSON.stringify(filteredCart))
        updateCart()
    }
    updateCart()

}




