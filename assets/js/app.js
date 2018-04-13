class App {

	static get FORM_LOGIN(){
		return document.querySelector('#formLogin');
	}
	static get INPUT_TEXT(){
		return document.querySelector('.input-text');
	}

	saveUser( user ){
		localStorage.setItem('user', user);
		App.INPUT_TEXT.value = '';
		window.location.href = "search.html";
	}

	init(){
		App.FORM_LOGIN.addEventListener('submit', (e) => {
			e.preventDefault();
			const user = App.INPUT_TEXT.value;
			if( user ){
				this.saveUser( user );
			}
		})		
	}
}