class SearchApp {

	static get TOP_USER(){
		return document.querySelector('#topUser');
	}
	static get INPUT_SEARCH(){
		return document.querySelector('.input-search');
	}
	static get BTN_SEARCH(){
		return document.querySelector('#search');
	}
	static get CARDS(){
		return document.querySelector('#cards');
	}
	static get FAVORITOS(){
		return document.querySelector('#favoritos');
	}
	static get CARD_FAVORITA(){
		return document.querySelectorAll('.card-favorita');
	}
	static get URL_API(){
		return "https://api.github.com/search/repositories";
	}	

	static get USER_NAME(){
		return localStorage.getItem("user");
	}

	getApi(word){
		let url = SearchApp.URL_API+"?q="+word+"&sort=stars&order=desc";
		
		fetch(url)
			.then(data => { return data.json() })
			.then(data => { this.processData(data.items)})
			.catch(error => { console.log(error) })
	}

	processData(items){
		items.map(item => {
			const { id, name, description, stargazers_count, html_url } = item;
			let card = `<div class="card" data-id="${id}" id="${id}">
										<div class="card-title" data-name="${name}">${name}</div>
										<div class="card-description">${description}</div>
										<div class="card-starts">Estrellas: ${stargazers_count}</div>
										<div class="card-button"><a href="${html_url}" target="_blank">VISITAR REPO</a></div>
										<div class="card-favorita"></div>
									</div>`;
			let cards = SearchApp.CARDS;
			cards.innerHTML += card;			
		});
		SearchApp.CARD_FAVORITA.forEach(function(elem) {
		  elem.addEventListener('click', () => SearchApp.activeFavoritos(elem))
		});
	}

	static activeFavoritos(elem){
		const parentId = elem.parentNode.id;

		if( elem.classList.contains('active') ){
			elem.classList.remove('active');
			SearchApp.removeToFavoritos( parentId )
		}else {
			elem.classList.add('active');
			SearchApp.addToFavoritos( parentId )
		}		
	}

	static addToFavoritos(id){
		const elem = document.getElementById(id);
		const name = elem.childNodes[1].dataset.name;

		let cardFavorita = `<div class="fav-card" id="fav-${id}">
													<div class="fav-card-name">A <span class="fav-user">${SearchApp.USER_NAME}</span> le gusta:</div>
													<div class="fav-card-name-repo">${name}</div>
												</div>`;
		SearchApp.FAVORITOS.innerHTML += cardFavorita;
	}

	static removeToFavoritos(id){
		const elem = document.getElementById('fav-'+id);
		elem.remove();
	}

	init(){
		const user = SearchApp.USER_NAME;
		SearchApp.TOP_USER.innerHTML = user;

		SearchApp.BTN_SEARCH.addEventListener('click', () => {
			const word = SearchApp.INPUT_SEARCH.value;
			if( word ){
				SearchApp.CARDS.innerHTML = '';
				this.getApi( word );
			}
		});
	}
}