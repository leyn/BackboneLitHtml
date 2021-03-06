import {html, render} from '../../node_modules/lit-html/lit-html.js';
import {ViewBinding} from '../views/ViewBinding.js';
export class ViewFormBook extends ViewBinding {
	constructor(obj) {
		super();
		this.collection = obj.collection;
		this.router = obj.router;
		this.defineWindow(obj);
		this.listenTo(this.collection, 'add', this.blockButton);
		this.listenTo(this.collection, 'add', this.redirectToListBooks);
		this.listenTo(this.model, 'invalid', this.showError);
		Backbone.View.apply(this);
		this.listenerClickButtonGenre = {
			handleEvent() {
				this.redirectToListGenres();
			}
		};
		this.listenerClickButtonClear = {
			handleEvent(e) {
				// e.preventDefault();
				// this.clearForm();
			}
		};
		this.listenerClickButtonAddBook = {
			handleEvent() {
				this.saveBook();
			}
		};
		this.listenerBlurFields = {
			handleEvent() {
				this.validateForm();
			}
		}
        this.prepareTemplate();
		this.render();
		// this.setListenersBlurForField();
		super.InitializeListenersFields(this.prepareFields());
	}
	// setListenersBlurForField() {
	// 	[].forEach.call(document.getElementsByClassName('valid'), (i) => {
	// 		i.addEventListener('blur', this.validateForm.bind(this));
	// 	});
	// }
	prepareFields() {
		$('.content').append(this.$el);
		return this.bindingElements = new Map([
					["name", {
						selector: ".name",
						viewToModel() { return document.querySelector(this.selector).value },
						// modelToView() { return this.model.get('name')}
					}],
					["author", {
						selector: ".author",
						viewToModel() { return document.querySelector(this.selector).value},
						// modelToView() { return this.model.get('author')}
					}],
					["year", {
						selector: ".year",
						viewToModel() { return parseInt(document.querySelector(this.selector).value)},
						// modelToView() { return this.model.get('year')}
					}],
					["countOfPage", {
						selector: ".countOfPage",
						viewToModel() { return parseInt(document.querySelector(this.selector).value)},
						// modelToView() { return this.model.get('countOfPage')}
					}],
					["price", {
						selector: ".price",
						viewToModel() { return parseInt(document.querySelector(this.selector).value)},
						// modelToView() { return this.model.get('price')}
					}],
					["amount", {
						selector: ".amount",
						viewToModel() { return parseInt(document.querySelector(this.selector).value)},
						// modelToView() { return this.model.get('amount')}
					}],
					["homePrinting", {
						selector: ".homePrinting",
						viewToModel() { return document.querySelector(this.selector).value},
						// modelToView() { return this.model.get('homePrinting')}
					}],
	 			]);
	}
	prepareTemplate() {
		this.template = (model) => html`
		<h1 class="headerSection">${model.title}</h1>
		<div class="addBookForm">
            <div class="itemForm"><div><label>Name</label></div></div>
				<div class="itemForm">
					<div>
                    	<input type="text" class="name" @blur=${this.listenerBlurFields.handleEvent.bind(this)}  minlength="0" maxlength="50" name="name" .value=${model.name}>
						<span class="error"></span>
					</div>
                </div>
                <div class="itemForm"><div><label>Author</label></div></div>
				<div class="itemForm">
					<div>
                    	<input type="text" class="author" @blur=${this.listenerBlurFields.handleEvent.bind(this)}  minlength="0" maxlength="50" name="author" .value=${model.author}>
						<span class="error"></span>
					</div>
                </div>
            	<div class="itemForm"><div><label>Year</label></div></div>
				<div class="itemForm">
					<div>
                    	<input type="text" class="year" @blur=${this.listenerBlurFields.handleEvent.bind(this)} min="100" name="year" .value=${model.year}>
						<span class="error"></span>
					</div>
                </div>
                <div class="itemForm"><div><label>CountOfPage</label></div></div>
				<div class="itemForm">
					<div>
                    	<input type="text" class="countOfPage" @blur=${this.listenerBlurFields.handleEvent.bind(this)} min="1" name="countOfPage" .value=${model.countOfPage}>
						<span class="error"></span>
					</div>
                </div>
                <div class="itemForm"><div><label>Price</label></div></div>
				<div class="itemForm">
					<div>
                    	<input type="text" class="price" @blur=${this.listenerBlurFields.handleEvent.bind(this)} min="1" name="price" .value=${model.price}>
						<span class="error"></span>
					</div>
                </div>
                <div class="itemForm"><div><label>Amount</label></div></div>
				<div class="itemForm">
					<div>
                    	<input type="text" min="0" class="amount" @blur=${this.listenerBlurFields.handleEvent.bind(this)} name="amount" .value=${model.amount}>
						<span class="error"></span>
					</div>
                </div>
                <div class="itemForm"><div><label>PublishinHouse</label></div></div>
				<div class="itemForm">
					<div>
                    	<input type="text" class="homePrinting" @blur=${this.listenerBlurFields.handleEvent.bind(this)} minlength="0" maxlength="50" name="homePrinting" .value=${model.homePrinting}>
						<span class="error"></span>
					</div>
				</div>
				<div class="itemForm"><div><label>Genre</label></div></div>
                <div class="itemForm"><div><button class="addGenreButton btnStyle" @click=${this.listenerClickButtonGenre.handleEvent.bind(this)}>Add genre</button></div></div>
                <div class="itemForm buttonClearForm"><input type="reset" value="Clear" class="clearBook btnStyle" @click=${this.listenerClickButtonClear.handleEvent.bind(this)}></div>
                <div class="itemForm buttonAddForm"><div><input type="submit" .value=${model.btnValue} disabled class="addBookButton btnStyle" @click=${this.listenerClickButtonAddBook.handleEvent.bind(this)}></div></div>
        </div>
		`;
	}
	render() {
		if(!this.stateAdd) {
			if(this.collection.currentEditableModel) {
				this.model = this.collection.currentEditableModel;
				render(this.template(Object.assign(this.model.toJSON(), {title: "CHANGE BOOK", btnValue: "Edit"})), this.el)
			}
		} else {
			render(this.template(Object.assign(this.model.toJSON(), {title: "ADD BOOK", btnValue: "ADD"})), this.el);
		}
	}
	validateForm() {
		if(this.model.isValid()) {
			if($('.addBookButton').attr('disabled')) {
				$('.addBookButton').attr('disabled', false);
			}
		} else {
			$('.addBookButton').attr('disabled', true);
		}
	}
	defineWindow(obj) {
		if(obj.hasOwnProperty('model')) {
			this.stateAdd = true;
			this.model = obj.model;
		} else {
			this.stateAdd = false;
			this.model = this.collection.currentEditableModel;
		}
	}
	showError(model, error) {
		if(typeof error === 'object') {
			$('input[name="' + error.name + '"] + span').text(error.error)
			setTimeout(function() {
			$('input[name="' + error.name + '"] + span').text('')
		}, 3000);
		}
	}
	saveBook() {
		if(this.stateAdd) {
            this.collection.trigger('pushModel', this.model);
		} else {
			this.router.navigate("list", {trigger: true});
		}
	}
	blockButton() {
		$('.addBookButton').attr('disabled', true);
	}
	redirectToListBooks() {
		this.router.navigate("fromForm", {trigger: true});
	}
	// clearForm() {
	// 	if(this.stateAdd) {
	// 		this.model.attributes = this.model.defaults;
	// 		this.render();
	// 	} else {
	// 		this.render();
	// 	}
	// }
	redirectToListGenres() {
		if(this.stateAdd) {
			this.router.navigate("check", {trigger: true});
		} else {
			this.router.navigate(`check/${this.model.get('_id')}`, {trigger: true});
		}
		}
	};