import {ModelBook} from '../models/ModelBook.js';
import {CollectionBooks} from '../collections/BooksCollection.js';
import {ViewFormBook} from '../views/ViewFormBook.js';
import {ViewListBooks} from '../views/ViewListBooks.js';
import {ViewFiltrationBooks} from '../views/ViewFiltrationBooks.js';
import {ViewListGenres} from '../views/ViewListGenres.js';
// import * as Backbone from "../../assets/js/backbone";
export class RouterBooks extends Backbone.Router {
	
	constructor() {
		super();
		this.routes = {
			"": "listBooksPage",
			"list": "listBooksPage",
			"add": "addBookPage",
			"edit/:id": "editBookPage",
			"check": "checkGenres",
			"check/:id":"changeCheckedGenres",
			"fromForm": "clearViewForm"
		};
		this.model = new ModelBook();
		this.coll = new CollectionBooks();
		Backbone.Router.apply(this);
		Backbone.history.start();
	}
	preperingWindow() {
		for(var el in this) {
			if(this.hasOwnProperty(el)){
				if(el !== 'routes' && el !== 'model' && el !== 'coll' && el !== '_events') {
					this[el].remove();
					delete this[el];
				}
			}
		}
	};
	clearViewForm() {
		this.createNewModel();
		this.navigate('list', {trigger: true});
	}
	createNewModel() {
		delete this.model;
		this.model = new ModelBook();
	}
	listBooksPage() {	
		this.preperingWindow();
		this.ViewFiltrationBooks = new ViewFiltrationBooks({collection: this.coll});
		this.ViewListBooks = new ViewListBooks({collection:this.coll, router: this});
	}
	addBookPage() {
		this.preperingWindow();
		this.ViewFormBook = new ViewFormBook({model: this.model, collection:this.coll, router: this});
	}
	editBookPage(params) {
		this.preperingWindow();
		this.coll.trigger('selectEditModel', params);
		this.ViewFormEditBook = new ViewFormBook({collection:this.coll, router: this});
	}
	checkGenres() {
		this.preperingWindow();
		this.ViewListGenres = new ViewListGenres({model:this.model, router: this});
	}
	changeCheckedGenres(params) {
		this.preperingWindow();
		this.ViewListGenres = new ViewListGenres({collection:this.coll, router: this});
	}
}