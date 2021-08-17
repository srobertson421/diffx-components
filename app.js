import uuidv4 from "./uuid.js";
import TestComponent from "./TestComponent.js";

const { createState, setState, watchState } = window.diffx;

class SeanCounter extends HTMLElement {
  constructor() {
    super();
    const count = parseInt(this.getAttribute('count')) || 0;
    this.counterState = createState(uuidv4(), {
      count
    });

    this.unwatch = watchState(
      () => this.counterState,
      () => this.render()
    );
  }

  connectedCallback() {
    this.innerHTML = `
      <h1 id="counter">Count: ${this.counterState.count}</h1>
      <button id="inc">Inc</button>
      <button id="dec">Dec</button>
    `;

    this.countEl = this.querySelector('#counter');
    this.incButton = this.querySelector('#inc');
    this.decButton = this.querySelector('#dec');

    this.incButton.addEventListener('click', () => {
      setState('increase count', () => this.counterState.count++);
    });
    
    this.decButton.addEventListener('click', () => {
      setState('decrease count', () => this.counterState.count--);
    });
  }

  render() {
    this.countEl.innerText = `Count: ${this.counterState.count}`;
  }

  disconnectedCallback() {
    this.unwatch();
  }
}

class SeanCounterList extends HTMLElement {
  constructor() {
    super();

    this.countersState = createState(uuidv4(), {
      counters: this.querySelectorAll('sean-counter').length
    });

    this.totalState = createState(uuidv4(), {
      total: Array.from(this.querySelectorAll('sean-counter')).reduce((acc, node) => acc + node.counterState.count, 0)
    });

    watchState(
      () => this.countersState,
      () => {
        let total = 0;
        this.querySelectorAll('sean-counter').forEach(node => {
          total += node.counterState.count
        });
        setState('change total', () => this.totalState.total = total);
      }
    )

    watchState(
      () => this.totalState,
      () => this.render()
    )
  }

  connectedCallback() {
    this.innerHTML = `
      ${this.innerHTML}
      <h3 id="total">Total: ${this.totalState.total}</h3>
      <button id="add-counter">Add Counter</button>
    `;
    
    this.totalEl = this.querySelector('#total');
    this.addCounterBtn = this.querySelector('#add-counter');

    this.addCounterBtn.addEventListener('click', () => {
      const tempCounter = document.createElement('sean-counter');
      this.prepend(tempCounter);
      setState('add counter', () => this.countersState.counters = this.querySelectorAll('sean-counter').length);
    });
  }

  render() {
    this.totalEl.innerText = this.totalState.total;
  }
}

customElements.define('sean-counter', SeanCounter);
customElements.define('sean-counter-list', SeanCounterList);

// watchState(
//   () => Array.from(document.querySelectorAll('sean-counter')).map(node => node.counterState),
//   () => document.querySelectorAll('sean-counter').forEach(node => node.render())
// );