class Login {

	static get FORM_LOGIN(){
		return document.querySelector('#formLogin');
	}
	static get INPUT_TEXT(){
		return document.querySelector('.input-text');
	}

	saveUser( user ){
		localStorage.setItem('user', user);
		Login.INPUT_TEXT.value = '';
		window.location.href = "search.html";
	}

	init(){
		Login.FORM_LOGIN.addEventListener('submit', (e) => {
			e.preventDefault();
			const user = Login.INPUT_TEXT.value;
			if( user ){
				this.saveUser( user );
			}
		})		
	}
}

class Search {

	static get TOP_USER(){
		return document.querySelector('#topUser');
	}
	static get INPUT_SEARCH(){
		return document.querySelector('.input-search');
	}
	static get FORM_SEARCH(){
		return document.querySelector('#formSearch');
	}
	static get CARDS(){
		return document.querySelector('#cards');
	}
	static get FAVORITES(){
		return document.querySelector('#favorites');
	}
	static get CARD_FAVORITE(){
		return document.querySelectorAll('.card-favorite-star');
	}
	static get URL_API(){
		return "https://api.github.com/search/repositories";
	}
	static get USER_NAME(){
		return localStorage.getItem("user");
	}
	static get CARD_MESSAGE(){
		return document.querySelector("#cardMessage");
	}
	static get FAV_MESSAGE(){
		return document.querySelector("#favMessage");
	}
	static get TAB_CARDS(){
		return document.querySelector("#tabCards");
	}
	static get TAB_FAVORITES(){
		return document.querySelector("#tabFavorites");
	}
	static get ALL_TABS(){
		return document.querySelectorAll(".tab");
	}
	static get ALL_CONTENT_TABS(){
		return document.querySelectorAll(".content-tab");
	}

	getApi(word){
		let url = Search.URL_API+"?q="+word+"&sort=stars&order=desc";
		
		fetch(url)
			.then(data => { return data.json() })
			.then(data => { this.processData(data.items) })
			.catch(error => { console.log(error) })
	}

	processData(items){		
		items.map(item => {
			const { id, name, description, stargazers_count, html_url } = item;
			let card = `<div class="card" data-id="${id}" id="${id}">
										<div class="card-title" data-name="${name}">${name}</div>
										<div class="card-description">${Search.processDescription(description)}</div>
										<div class="card-starts">Estrellas: ${stargazers_count}</div>
										<div class="card-button"><a href="${html_url}" target="_blank">VISITAR REPO</a></div>
										<div class="card-favorite-star"></div>
									</div>`;
			let cards = Search.CARDS;
			cards.innerHTML += card;			
		});

		if( Search.CARD_MESSAGE ){
			Search.CARD_MESSAGE.innerHTML= '';
		}

		Search.CARD_FAVORITE.forEach(function(elem) {
		  elem.addEventListener('click', () => Search.activeFavorites(elem))
		});		
	}

	static processDescription(desc){
		return desc != null ? desc : "Sin descriptión."
	}

	static activeFavorites(elem){
		const parentId = elem.parentNode.id;

		if( Search.FAV_MESSAGE ){
			Search.FAV_MESSAGE.remove();
		}

		if( elem.classList.contains('active') ){
			elem.classList.remove('active');
			Search.removeToFavorites( parentId )
		}else {
			elem.classList.add('active');
			Search.addToFavorites( parentId )
		}		
	}

	static addToFavorites(id){
		const elem = document.getElementById(id);
		const name = elem.childNodes[1].dataset.name;

		let cardFavorita = `<div class="fav-card" id="fav-${id}">
													<div class="fav-card-name">A <span class="fav-user">${Search.USER_NAME}</span> le gusta:</div>
													<div class="fav-card-name-repo">${name}</div>
												</div>`;
		Search.FAVORITES.innerHTML += cardFavorita;
	}

	static removeToFavorites(id){
		const elem = document.getElementById('fav-'+id);
		elem.remove();
	}

	static changeTab(nameTab){
		Search.ALL_TABS.forEach(function(elem) {
		  elem.classList.remove('active');
		});

		let tab = document.querySelector('[data-tab="'+ nameTab +'"]');
		tab.classList.add('active');

		Search.ALL_CONTENT_TABS.forEach(function(elem) {
		  elem.classList.remove('active');
		});

		let contenTabs = document.querySelector('#'+nameTab);
		contenTabs.classList.add('active');
	}

	init(){
		const user = Search.USER_NAME;
		Search.TOP_USER.innerHTML = user;

		Search.FORM_SEARCH.addEventListener('submit', (e) => {
			e.preventDefault();
			const word = Search.INPUT_SEARCH.value;
			if( word ){
				Search.CARDS.innerHTML = '';
				this.getApi( word );
			}
		});

		Search.TAB_CARDS.addEventListener('click', () => {
			Search.changeTab('cards');
		})

		Search.TAB_FAVORITES.addEventListener('click', () => {
			Search.changeTab('favorites');
		})
	}
}