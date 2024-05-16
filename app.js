const searchBtn = document.querySelector('.search-btn')
const searchInput = document.querySelector('.search-table input')
const selectCatagory = document.querySelector('.select-catagory')
const searchBar = document.querySelector('.search-bar')


let allProducts = JSON.parse(localStorage.getItem("products") || "[]")

searchBtn.addEventListener('click',function(e){
    searchInput.style.transform = 'translateX(0)'
    searchInput.style.visibility = 'visible'
    searchInput.style.opacity = '1'
    selectCatagory.style.transform = 'translateX(0)'
    selectCatagory.style.visibility = 'visible'
    selectCatagory.style.opacity = '1'
    searchBar.style.backgroundColor = 'white'
    searchBtn.classList.add('hide')
})


// carausel
const carouselItem = document.querySelectorAll('.carousel-item')  
const totalItems = carouselItem.length
let currentIndex = 0

setInterval(function () { 
currentIndex = (currentIndex + 1) % totalItems
updateCarousel()
}, 4000)


const next = document.querySelector(".next")
next.addEventListener('click', function(){
    currentIndex = (currentIndex + 1) % totalItems 
    updateCarousel()
})


const prev = document.querySelector(".prev")
prev.addEventListener('click', function(){
    currentIndex = (currentIndex - 1 + totalItems) % totalItems
    updateCarousel()

})

function updateCarousel() { 
    const offset = -currentIndex * 100
    const carouselInner = document.querySelector('.carousel-inner')
    carouselInner.style.transform = `translateX(${offset}%)`
}


function getAllCategory (products) {
    // getting only unique catagory
    //  iterate over category return select option
    const categories = products.reduce((values ,item)=>{
        if(!values.includes(item.category)){
            values.push(item.category)
        }
        return values
    },[])

    return categories
}


function updateUi(products) {
     // loading cards dynamically
    const cardDiv = document.querySelector('.cards')
    const productUi = products.map((prod) => {
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

        return `
            <div class="card" data-id="${prod.id}">
                <div class="img">
                    <img src=${prod.thumbnail} alt="">
                </div>
                <div class="info">
                    <h4 class="prod">${prod.title}</h4>
                    <p class="prod-desc">${prod.description}</p>
                    <div class="price">
                        <h6 class="market-price">$ ${prod.price}</h6>
                        <h6 class="discount-percent">${prod.discountPercentage} % off</h6>
                    </div>
                    <h5 class="selling-price"> $ ${(prod.price - (prod.price * (prod.discountPercentage/100))).toFixed(2)}</h5>    
                </div>
                <div class="rating-div">
                    <div class="star">
                        ${ratings}
                    </div>
                </div>
            </div>`  
    })

    if(!products || products.length <= 0){
        cardDiv.innerHTML = "<h2>No Result Found!</h2>"
        return 
    }
    cardDiv.innerHTML = productUi.join('')

    cardEvent(cardDiv)
}

// fetching the data from the dummyapi

const BASE_URL="https://dummyjson.com"

async function fetchingData() { 
    const url = `${BASE_URL}/products?limit=100`
    const response = await fetch(url)
    const data = await response.json()
    const products = data.products

    localStorage.setItem('products',JSON.stringify(products))
    
    const categories = getAllCategory(products) 
    
    
    // dynamicaly filling the category in the header section and sideBar
    const selectOption = document.querySelector(".select-catagory")
    const sideBarNav = document.querySelector('.categories')
    
    categories.forEach((category) => {
        selectOption.innerHTML +=  `<option value=${category}>${category}</option>`
        sideBarNav.innerHTML += ` 
        <li class="nav-item">
            <a href="#" class="cat">
                ${category}
            </a></br>
        </li>`
    })
    
   
    updateUi(products)

    sideNavEvent()

   

}
fetchingData()


//  filtering item with the search input
searchBar.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchValue = document.querySelector('.search-input').value;
    const selectedCategory = selectCatagory.value;

    const searchItem = allProducts.filter((product) => {
        if(selectedCategory === product.category && product.title.toLowerCase().includes(searchValue.toLowerCase())){
            return product
        }

    })

    updateUi(searchItem)
});

// filtering items through SideNavigation
function sideNavEvent () {
    const navItems = document.querySelectorAll('.nav-item a')
    navItems.forEach((nav) => {
        nav.addEventListener('click' , function () {
            const filteredItem = allProducts.filter((product) => {
                if(product.category.toLowerCase() === nav.innerText.toLowerCase()){
                    return product
                }
            })
            updateUi(filteredItem)
    })

    })
}


// adding event listener to the cards to redirect to the single page
function cardEvent(cards) {
    const allCards = cards.querySelectorAll('.card')
    
    allCards.forEach((card)  => {
        card.addEventListener('click' , function (e) {
            const productId = e.currentTarget.dataset.id
            window.location.href = `http://127.0.0.1:5500//single-product.html?id=${productId}`;
        })
    })

}

// cart function

const cartBtn = document.querySelector('.cart-wrapper a')
const cartDiv = document.querySelector('.cart')

function cartEvent () {
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
}
cartEvent()


// displaying the cart items 
const cartItems = JSON.parse(localStorage.getItem('cartItems'))
console.log(typeof(cartItems))


cartItems.map((item) => {

    cartDiv.innerHTML += ` 
    <div class="cart-items">
        <div class="img">
            <img class="cart-img" src=${item.thumbnail} alt="">
        </div>
        <div class="card-desc">
            <div class="info">
                <h4>${item.title}</h4>
                <p> ${item.description}</p>
                <h4>$ ${(item.price - (item.price * (item.discountPercentage/100))).toFixed(2)}</h4>
            </div>
            <div class="amt">
                <div class="amt-count">
                    <h4>
                        5
                    </h4>
                </div>
                <button class="inc-btn">
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button class="dec-btn">
                    <i class="fa-solid fa-minus"></i>
                </button>
            </div> 
        </div>          
    </div>`

    // let total = 0
    // total += (item.price - (item.price * (item.discountPercentage/100))).toFixed(2)
})

const amtBtn = document.querySelectorAll('.amt button' )

console.log(amtBtn)










