import {html, render} from 'lit-html';
import {ViewFiltrationBooks} from '../filterComponent/filterComponent';
import {ViewListBooks} from '../listBooksComponent/listBooksComponent';   
export class ViewMainList extends Backbone.View {
    constructor(router, lang, collection, config, selector) {
        super();
        this.elem = selector;
        this.collection = collection;
        this.config = config;
        Backbone.View.apply(this);
        this.listenerClickButtonLeft = {
			handleEvent() {
				this.showLeftColumn();
			}
        }
        this.listenerClickButtonRight = {
			handleEvent() {
				this.showRightColumn();
			}
        }
        this.listenerClickHideLeft = {
			handleEvent() {
				this.hideLeftColumn();
			}
        }
        this.listenerClickHideRight = {
			handleEvent() {
				this.hideRightColumn();
			}
		}
        this.render();
        this.listBooks = new ViewListBooks(this.collection, router, lang, '.mainColumn .list', this.config.listFields);
        this.filtrBooks = new ViewFiltrationBooks(this.collection, lang, '.mainColumn .filtrByValue', this.config.listFields, this.pagination); 
        this.generateComponents();
    }
    generateComponents() {
        var counter = String(Math.random() * 100);
        this.config.leftColumn.components.forEach((i, index) => {
            i.forEach((i) => {
                this[counter] = new index(i, this.collection, '.leftColumn .body');
                counter =+ String(Math.random() * 100);
            })
        })
    }
    prepareTemplate() {
        $(this.elem).append(this.$el);
        return html`
        <div class="grid-container">
            <div class="leftColumn">
                <div class="body">
                    <div class="headerL">
                        <div class="closeImg" @click=${this.listenerClickHideLeft.handleEvent.bind(this)}><img src="./image/baseline-clear-24px.svg" class="closeColumn"></div>
                        <div class="titleColumn"><h2>Filters</h2></div>  
                    </div>
                </div>
            </div>
            <div class="mainColumn">
                <div class="body">
                    <div class="headerL">
                    </div>
                    <div class="filter">
                        <div class="filtrByValue"></div>
                        <div class="buttons">
                            <button class="showLeftColumn" @click="${this.listenerClickButtonLeft.handleEvent.bind(this)}">ShowLeft</button>
                            <button class="showRightColumn" @click="${this.listenerClickButtonRight.handleEvent.bind(this)}">ShowRight</button>
                        </div>
                    </div>
                    <div class="list"></div>
                </div>
            </div>
            <div class="rightColumn">
                <div class="body">
                    <div class="headerL">
                        <div class="closeImg" @click=${this.listenerClickHideRight.handleEvent.bind(this)}><img src="./image/baseline-clear-24px.svg" class="closeColumn"></div>
                        <div class="titleColumn"><h2>Columns</h2></div>  
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    showLeftColumn() {
        if(document.querySelector('.leftColumn').classList.contains('hideLeft')) {
            document.querySelector('.leftColumn').classList.remove('hideLeft');
        }
       document.querySelector('.leftColumn').classList.add('showLeft');
    }
    showRightColumn() {
        if(document.querySelector('.rightColumn').classList.contains('hideRight')) {
            document.querySelector('.rightColumn').classList.remove('hideRight');
        }
        document.querySelector('.rightColumn').classList.add('showRight');
    }
    hideLeftColumn() {
        document.querySelector('.leftColumn').classList.remove('showLeft');
        document.querySelector('.leftColumn').classList.add('hideLeft');
     }    
    hideRightColumn() {
         document.querySelector('.rightColumn').classList.remove('showRight');
         document.querySelector('.rightColumn').classList.add('hideRight');    
     }
    render() {
        render(this.prepareTemplate(), this.el);
    }
}