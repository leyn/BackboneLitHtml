import { isArray } from "util";

// import * as Backbone from "../../assets/js/backbone";

export class ModelBook extends Backbone.Model {
	
	constructor(attrs, options) {
		super();
		this.defaults = {
				name: '',
				author: '',
				year:  new Date().getFullYear(),
				countOfPage: 1,
				price: 1,
				amount: 1,
				homePrinting: '',
				genres: []
				};
		// this.url = '/books/3253406311390484245';
		// this.urlRoot = '/books/';
		this.on('pushCheckedGenres', this.pushCheckedGenres);
		this.sync = this.myOwnSpecificSync;
		Backbone.Model.apply(this, [attrs, options]);
		this.prepareValidationList();
		this.prepareFiltrationList();
		this.prepareLanguageList();
	}
	myOwnSpecificSync(method, model, options) {
		console.log(method);
		if(method === 'create') {
			model.set('id', this.generateId());
			model.idAttribute = 'id';
			let books = JSON.parse(localStorage.getItem('books'));
			if(books) {
				books.push(model);
				localStorage.setItem('books', JSON.stringify(books));
			} else {
				localStorage.setItem('books', JSON.stringify([model]));
			}
		} 
		if(method === 'delete') {
			console.log('i here');
			let books = localStorage.getItem('books');
			books = books.filter((i) => {
				if(i._id !== model._id) {
					return true;
				} else {
					return false;
				}
			});
			localStorage.setItem('books', books);
		}
	}
	prepareLanguageList() {
		this.languageList = [
			{name: "English", data: "en"},
			{name: "Russion", data: 'ru'}
		];
	}
	prepareFiltrationList() {
		this.filtrationList = [
		{name: 'name', data: 'name'},
		{name: 'author', data: 'athor'},
		{name: 'year', data: 'year'},
		{name: 'count of pages', data: 'countOfPage'},
		{name: 'price', data: 'price'}, 
		{name: 'amount', data: 'amount'}, 
		{name: 'publishing house', data: 'homePrinting'}, 
	];
	}
	generateId() {
		var id = '';
            for(var i = 0; i < 10; i++){
                id += (Math.random() * (100 - 1) + 1).toFixed(0);
            }
            return id;
	}
	pushCheckedGenres(checked){
		var genres = this.get('genres').filter(function(i) {
			return i !== checked.value;

		});
		if(genres.length === this.get('genres').length) {
			genres.push(checked.value);
		}
		this.set('genres', genres);
	}
	generateError(nameField, type, arrayErrors) {
		var objError = {
			name: nameField,
			type
		};
		if(this.hasChanged(nameField)) {
			return objError;
		} else {
			return arrayErrors.push(objError);
		}
	}
	validateStringField(arrayErrors, value, nameField) {
		if(!value) {
			return this.generateError(nameField, 'required', arrayErrors);
		} else if (value.length < 3 || value.length > 50) {
			return this.generateError(nameField, 'length', arrayErrors);
		} else {
			return false;
		}
	}
	validateNumberField(arrayErrors, value, nameField) {
		if(!+value && +value !== 0) {
			return this.generateError(nameField, 'required', arrayErrors);
		} else if (value < 1) {
			return this.generateError(nameField, 'minValue', arrayErrors);
		} else {
			return false;
		}
	}
	validateYearField(arrayErrors, value, nameField) {
		if(!+value) {
			return this.generateError(nameField, 'required', arrayErrors);
		} else if(value < 1) {
			return this.generateError(nameField, 'minValue', arrayErrors);
		} else if(value > new Date().getFullYear()) {
			return this.generateError(nameField, 'maxYear', arrayErrors);
		} else {
			return false;
		}
	}
	prepareValidationList() {
		this.validationList = new Map([
			['name', {
				validationField(arrayErrors, value, key) { return this.validateStringField(arrayErrors, value, key)}
			}],
			['author', {
				validationField(arrayErrors, value, key) { return this.validateStringField(arrayErrors, value, key)}
			}],
			['homePrinting', {
				validationField(arrayErrors, value, key) { return this.validateStringField(arrayErrors, value, key)}
			}],
			['price', {
				validationField(arrayErrors, value, key) { return this.validateNumberField(arrayErrors, value, key)}
			}],
			['countOfPage', {
				validationField(arrayErrors, value, key) { return this.validateNumberField(arrayErrors, value, key)}
			}],
			['amount', {
				validationField(arrayErrors, value, key) { return this.validateNumberField(arrayErrors, value, key)}
			}],
			['year', {
				validationField(arrayErrors, value, key) { return this.validateYearField(arrayErrors, value, key)}
			}]
		]);
	}
	validate(attrs, message) {
		let arrayErrors = [];
		for(let [key, value] of this.validationList) {
			let error = value.validationField.call(this, arrayErrors, attrs[key], key);
			if(typeof error === 'object') {
				return error;
			}
		}
		if(arrayErrors.length > 0) {
			return 'error';
		}
	}
};