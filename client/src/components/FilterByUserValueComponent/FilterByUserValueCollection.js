import {FilterByUserValueModel} from './FilterByUserValueModel.js';
export class FilterByUserValueCollection extends Backbone.Collection {
    constructor() {
        super();
        this.model = FilterByUserValueModel;
        this.sync = this.overrideSync;
        this.fetch = this.myFetch;
        Backbone.Collection.apply(this);
    }
    myFetch(id) {
		return this.sync('read', id);
	}
    overrideSync(method, id) {
		if(method === 'read') {
			return new Promise((resolve, reject) => {
				fetch(`http://localhost:5000/api/filter/${id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                })
                .then((response) => {
                    return response.json();
                })
                .then((allBooks) => {
                   resolve(allBooks);
                })
                .catch((e) => {
                    console.log(e);
                })
			})
		}
	}
    static getSelf() {
        this.self = this.self ? this.self:  new this();
        return this.self;
    }
}