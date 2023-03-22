
class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize() {
    document.addEventListener('pointerover', this.onPointerover.bind(this));
    document.addEventListener('pointerout', this.onPointerout.bind(this));
  }

  render(value) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = value;
    const move = this.getCurrentPosition.bind(this);
    document.body.addEventListener('pointermove', move);
    document.body.append(this.element);
  }

  onPointerover(event) {
    if (event.target.dataset.tooltip === undefined) return;
    const element = event.target.closest('[data-tooltip]');
    const tooltipValue = element.dataset.tooltip;
   
    if (!element) {
      return;
    }
    this.render(tooltipValue);
    this.getCurrentPosition(event);
  }

  getCurrentPosition(event){
    this.element.style.left = `${event.clientX}px`;
    this.element.style.top = `${event.clientY}px`;
  }

  onPointerout(event) {
    if (event.target.dataset.tooltip !== undefined) {
      this.remove();
    }
  }

  destroy() {  
    document.removeEventListener('pointerover', this.onPointerover);
    document.removeEventListener('pointerout', this.onPointerout);
    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

}

export default Tooltip;