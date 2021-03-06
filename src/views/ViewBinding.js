export class ViewBinding extends Backbone.View {
		constructor(model) {
			super();
			this.model = model;
		}
		InitializeListenersFields(bindingElements) {
			bindingElements.forEach((i) => {
				document.querySelector(i.selector).addEventListener('input', (e) => {
							var value = i.viewToModel();
							this.model.set(e.target.name, value)
						});
			})
		}
	}