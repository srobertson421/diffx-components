import Component from "./Component.js";

class TestComponent extends Component {
  render() {
    this.innerHTML = '<div>test</div>';
  }
}

customElements.define('test-comp', TestComponent);

export default TestComponent;