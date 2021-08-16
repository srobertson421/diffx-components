const { createState, setState, watchState } = window.diffx;

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

class SeanCounter extends HTMLElement {
  constructor() {
    super();
    const count = parseInt(this.getAttribute('count')) || 0;
    this.counterState = createState(uuidv4(), {
      count
    });
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
}

customElements.define('sean-counter', SeanCounter);

watchState(
  () => Array.from(document.querySelectorAll('sean-counter')).map(node => node.counterState),
  () => document.querySelectorAll('sean-counter').forEach(node => node.render())
);