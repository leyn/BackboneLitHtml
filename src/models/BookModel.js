import { isArray } from "util";

export class BookModel extends Backbone.Model {
	
	constructor(attrs, options) {
		super();
		Backbone.Model.apply(this, [attrs, options]);
		this.prepareValidationList();
		this.prepareFiltrationList();
		this.prepareLanguageList();
		this.prepareThemeList();
	}
	get defaults() {
		return {
			name: '',
			author: '',
			year:  new Date().getFullYear(),
			countOfPage: 1,
			price: 1,
			amount: 1,
			homePrinting: '',
			genres: [],
			image: ''
			};
	}
	get idAttribute() {
		return "_id";
	}
	save() {
		var id = this.idAttribute;
		if(this.get(id)) {
			return this.sync('update', this);
		} else {
			return this.sync('create', this);
		}
	}
	destroy() {
		return this.sync('delete', this);
	}
	sync(method, model) {
		switch(method) {
			case 'create': 
				var formData = new FormData();
				formData.append('name', model.get('name'));
				formData.append('author', model.get('author'));
				formData.append('year', model.get('year'));
				formData.append('countOfPage', model.get('countOfPage'));
				formData.append('price', model.get('price'));
				formData.append('amount', model.get('amount'));
				formData.append('homePrinting', model.get('homePrinting'));
				formData.append('genres', model.get('genres'));
				formData.append('image', model.get('image'));
				return new Promise((resolve, reject) => {
					fetch('/api/books/', {
                    method: 'POST',
                    body: formData
                })
                .then((response, reject) => {
                    return response.json();
                })
                .then((book) => {
                   resolve(book);
                })
                .catch((e) => {
                    console.log(e);
                })
				})  
            break;
			case 'update':
			var formData = new FormData();
				formData.append('name', model.get('name'));
				formData.append('author', model.get('author'));
				formData.append('year', model.get('year'));
				formData.append('countOfPage', model.get('countOfPage'));
				formData.append('price', model.get('price'));
				formData.append('amount', model.get('amount'));
				formData.append('homePrinting', model.get('homePrinting'));
				formData.append('genres', model.get('genres'));
				formData.append('image', model.get('image'));
				return new Promise((resolve, reject) => {
					fetch(`/api/books/${model.get('_id')}`, {
                    method: 'PATCH',
                    body: formData
                })
                .then((response, reject) => {
                    return response.json();
                })
                .then((book) => {
                   resolve(book);
                })
                .catch((e) => {
                    console.log(e);
                })
				})
            break;
			case 'delete':
				return new Promise((resolve, reject) => {
					fetch(`/api/books/${model.get('_id')}`, {
                	method: 'DELETE',
                	headers: {
                    	'Content-Type': 'application/json'
                 	 }
            		})
            		.then((response, reject) => {
                		return response.json();
            		})
            		.then((book) => {
               			resolve(book.id);
            		})
            		.catch((e) => {
                		console.log(e);
           		 	})
				})
            break;
        }
	}
	prepareThemeList() {
		this.themsList = [
			{name: 'first', data: 'first'},
			{name: 'second', data: 'second'}
		]
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