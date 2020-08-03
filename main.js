// menu-cart-extended
const menuCartExtended = document.querySelector(".menu-cart-extended");
const navProducts = document.querySelector(".nav-products");
const menuCartExtendedMenu = document.querySelector(".menu-cart-extended__menu");
const header = document.querySelector(".header");
const navProductsText = document.querySelector(".nav-products__text");
// модальное окно
const btn = document.querySelector("#btn");
const modal = document.querySelector(".modal");
// таймер сайта
const cardPriceP = document.querySelector(".card__price__p");
const pricesActive = document.querySelectorAll(".prices__active");
const pricesDisable = document.querySelectorAll(".prices__disable");
// добавление к корзину
const cardTitle = document.querySelectorAll(".card__title"); 
const cardButton = document.querySelectorAll(".card__button"); 
const menuCartExtendedItem = document.querySelector(".menu-cart-extended__item");
const menuCartExtendedCheckOut = document.querySelector(".menu-cart-extended__check-out");

const menuCartExtendedLink = document.querySelector(".menu-cart-extended__link");
const menuCartExtendedText = document.querySelector(".menu-cart-extended__text");
const menuCartExtendedList = document.querySelector(".menu-cart-extended__list");
// total
const totalTextRight = document.querySelector(".total-text__right");
const cartPrice = document.querySelector(".cart__price");
let total = 0;
let cart = [];
// для удобства массив данных о товаре
const goods = [
	{
		title: "Video Suite",
		priceActive: 1990,
		priceDisable: 3770
	},
	{
		title: "Video Suite + Photo Editor",
		priceActive: 2490,
		priceDisable: 5060
	}
];
// для отсчета _ таймер
let timer_1 = setInterval(
	function(){
		const pricesActive = document.querySelectorAll(".prices__active");
		const pricesDisable = document.querySelectorAll(".prices__disable");
		let count = 0;
		let seconds;
		let minutes;
		let time = JSON.parse(localStorage.getItem('time'));
		if(time){
			seconds = time[0];
			minutes = time[1];
			// проверка окончания времени
			if(seconds <= 0 && minutes <= 0){
				// заменяем цены
				for(let i = 0; i < pricesActive.length; i++){
					pricesActive[i].innerText = goods[i].priceDisable;
					pricesDisable[i].innerHTML = "&#160;";
					pricesDisable[i].style.textDecoration = "none";
				}
				// count - для понимания видел ли пользователь модальное окно
				count = time[2];
				// проверка что окно уже было
				if(count == 0){
					modal.style.display = "none";
				}else{
					// показ модального окна
					modal.style.display = "flex";
					count--;
					time[2] = count;
					localStorage.setItem('time', JSON.stringify(time));
				}
				// когда время закнчилось очищаемтаймер и выходим
				cardPriceP.innerText = `The promotion is over`;
				clearInterval(timer_1);
				return;
			}
		}else{
			// default time
			seconds = 59;
			minutes = 14;
		}
		if(seconds > 0){
			seconds--;
		}else{
			seconds = 60;
			if(minutes > 0){
				minutes--;
			}
		}
		// перепись текста
		cardPriceP.innerText = `Offer valid still ${ minutes } minutes ${ seconds } seconds`;
		count++;
		time = [seconds, minutes, count];
		localStorage.setItem('time', JSON.stringify(time));
},1000);

// если есть элемент в корзине = значит кнопка активна
window.onload = function(){
	if(localStorage.getItem("cart")){
		menuCartExtendedCheckOut.classList.add("card__button__blue");
		menuCartExtendedCheckOut.classList.remove("disable");
	}
}

// появление навигации
function showNav(){
	let target = event.target;
	parentTarget = target.parentElement;
	// проверка на нажатие вне области menu__extended
	if(parentTarget == header || parentTarget == navProductsText || parentTarget == menuCartExtendedLink){
		menuCartExtended.classList.toggle("menu-cart-extended_active");
	}
}

// добавление товара в корзину
let count = 0;
document.onclick = function(event){
	let target = event.target;
	// клик по кнопкам buy
	if(target.classList.contains("card__button")){
		cart.push(count);
		addGoods(target.getAttribute("data-id"), count);
		count++;
	}
	// клик по "Delete"
	if(target.classList.contains("menu-cart-extended__item-delete")){
		deleteGoods(target.getAttribute("data-id"));
	}
		// клик по "Delete All"
	if(target.classList.contains("text-right")){
		deleteAll();
	}
}

// добавление товара
function addGoods(id, count){
	const menuCartExtendedItemEmpty = document.querySelector(".menu-cart-extended__item-empty");	
	// шаблон карточки товара в корзине
	const template =
	`<div class="menu-cart-extended__item menu-cart-extended__item-good" data-count="${count}">
		<div class="menu-cart-extended__item-img-wrapper">
			<img src="https://new-img.movavi.com/products/0012/47/9061552b407e4a0563948cc4513716ef19acb8c4.jpeg" class="img-fluid">
		</div>
		<div class="menu-cart-extended__item-text-wrapper">
			<div class="menu-cart-extended__item-name">${ goods[+id].title }</div>
			<div class="menu-cart-extended__item-end">
				<div class="menu-cart-extended__item-price" data-replace="replace">${ goods[+id].priceActive }<span>&nbsp;руб.</span>
				</div>
				<a href="#" class="menu-cart-extended__item-delete" data-count="${count}" data-id="${+id}"></a>
			</div>
		</div>
	</div>`; 
	menuCartExtendedList.insertAdjacentHTML("beforeend", template);
	// считаем цену - увеличиваем
	total += goods[+id].priceActive;
	totalTextRight.innerHTML = total + ",0&nbsp;руб.";
	cartPrice.innerHTML = total + ".0&nbsp;руб."
	renderCart();
	if(localStorage.getItem("cart")){
		// отображение кнопки
		menuCartExtendedCheckOut.classList.add("card__button__blue");
	}
}

// удаление товара 
function deleteGoods(id){
	const menuCartExtendedItemGood = document.querySelectorAll(".menu-cart-extended__item-good");
	let target = event.target;
	let atr = target.dataset.count;
	if(localStorage.getItem("cart")){
		cart = JSON.parse(localStorage.getItem("cart"));
		cart.splice(id, 1);
		localStorage.removeItem('cart');
		localStorage.setItem('cart', JSON.stringify(cart));
		// проверка для понимания, что было ужадение последнего элемента
		if(atr == 0){
			// отображение кнопки
			menuCartExtendedCheckOut.classList.remove("card__button__blue");
			menuCartExtendedCheckOut.classList.add("disable");
			localStorage.removeItem('cart');
		}
	}
	// скрываем ту карточку, которой соответсвует "Delete"
	menuCartExtendedItemGood[+atr].style.display = "none";
	// считаем цену - уменьшаем
	total -= goods[+id].priceActive;
	totalTextRight.innerHTML = total + ",0&nbsp;руб.";
	cartPrice.innerHTML = total + ".0&nbsp;руб."
	// перересовываем корзину
 	renderCart();
}

// элемент ссылка "Delete All"
function deleteAll(){
	if(localStorage.getItem("cart")){
		const menuCartExtendedItemGood = document.querySelectorAll(".menu-cart-extended__item-good");
		menuCartExtendedList.innerHTML = `<div class="menu-cart-extended__item-empty">Cart empty</div>`;
		totalTextRight.innerHTML = `0,0 
		<span>руб.</span>`;
		cartPrice.innerHTML = "0.0 руб.";
		for(let i = 0; i < menuCartExtendedItemGood.length; i++){
			menuCartExtendedItemGood[i].style.display = "none";
		}
		menuCartExtendedCheckOut.classList.remove("card__button__blue");
		menuCartExtendedCheckOut.classList.add("disable");
		localStorage.removeItem("cart");
		window.location.reload();
	}
};


// перересовываем корзину
function renderCart(){
	// создаем массив элементов корзине
	cart = [];
	const menuCartExtendedList = document.querySelector(".menu-cart-extended__list");
	const totalTextRight = document.querySelector(".total-text__right");
	const cartPrice = document.querySelector(".cart__price");
	// при добавлении пушим элемент
	cart.push(
		{
			template: menuCartExtendedList.innerHTML,
			totalTextRight: totalTextRight.innerHTML,
			cartPrice: cartPrice.innerHTML,

		}
	);
	localStorage.setItem('cart', JSON.stringify(cart));
}
// добавление элементо в корзину после перезагрузки
function cartNew(){
	if(localStorage.getItem("cart")){
		cart = JSON.parse(localStorage.getItem("cart"));
		let split = cart[0].cartPrice.split(".");
		total = +split[0];
		cartPrice.innerHTML = cart[0].cartPrice;
		totalTextRight.innerHTML = cart[0].totalTextRight;
		menuCartExtendedList.insertAdjacentHTML("beforeend", cart[0].template);
	}
}
cartNew();

// "слушатели" для показа / скрытия модального окна
navProducts.addEventListener("click", showNav);
menuCartExtendedText.addEventListener("click", showNav);
menuCartExtended.addEventListener("click", showNav);

// скрытие модального окна
btn.addEventListener("click", ()=>{
	modal.style.display = "";
});
