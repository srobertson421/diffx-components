import uuidv4 from "./uuid.js";
const { createState, setState, watchState } = window.diffx;

class Component extends HTMLElement {
  constructor() {
    super();
    const propsAttribute = this.getAttribute('props');
    this.props = JSON.parse(propsAttribute.replace(/([a-zA-Z]+):/g,'"$1":').replace(/'/g, '"'));
    this.state = {};
    Object.keys(this.props).forEach(key => {
      const id = `${key}-${uuidv4()}`;
      this.state[id] = createState(id, {
        [key]: this.props[key]
      });
    });

    console.log(this.state);
  }

  connectedCallback() {
    this.render();
  }

  render() {}

  disconnectedCallback() {}
}

export default Component;