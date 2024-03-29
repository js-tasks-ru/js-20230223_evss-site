export default class DoubleSlider {
  element;
  subElements = [];

  constructor({
    min = 400,
    max = 600,
    selected = {
      from: 400,
      to: 600,
    },
    formatValue = (value) => `$${value}`,
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;

    this.render();
  }

  onPointerMove = (event) => {
    event.preventDefault();

    const {
      left: innerLeft,
      right: innerRight,
      width,
    } = this.subElements.inner.getBoundingClientRect();

    if (this.dragging === this.subElements.thumbLeft) {
      let newLeft = (event.clientX - innerLeft + this.shiftX) / width;

      if (newLeft < 0) {
        newLeft = 0;
      }

      newLeft *= 100;
      let right = parseFloat(this.subElements.thumbRight.style.right);

      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }

      this.dragging.style.left = this.subElements.progress.style.left =
        newLeft + "%";
      this.subElements.from.innerHTML = this.formatValue(this.getValue().from);
    } else {
      let newRight = (innerRight - event.clientX - this.shiftX) / width;

      if (newRight < 0) {
        newRight = 0;
      }
      newRight *= 100;

      let left = parseFloat(this.subElements.thumbLeft.style.left);

      if (left + newRight > 100) {
        newRight = 100 - left;
      }

      this.dragging.style.right = this.subElements.progress.style.right =
        newRight + "%";
      this.subElements.to.innerHTML = this.formatValue(this.getValue().to);
    }
  };

  onPointerUp = (event) => {
    this.element.classList.remove("range-slider_dragging");

    this.removeListeners();

    const customEvent = new CustomEvent("range-select", {
      bubbles: true,
      detail: this.getValue(),
    });

    this.element.dispatchEvent(customEvent);
  };

  get template() {
    const { from, to } = this.selected;

    return `<div class="range-slider">
        <span data-element="from">${this.formatValue(from)}</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to">${this.formatValue(to)}</span>
        </div>`;
  }

  initEventListeners() {
    const { thumbLeft, thumbRight } = this.subElements;

    thumbLeft.addEventListener("pointerdown", (event) =>
      this.onThumbPointerDown(event)
    );
    thumbRight.addEventListener("pointerdown", (event) =>
      this.onThumbPointerDown(event)
    );
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.element.ondragstart = () => false;

    this.subElements = this.getSubElements(element);

    this.initEventListeners();
    this.update();
  }

  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  removeListeners() {
    document.removeEventListener("pointerup", this.onPointerUp);
    document.removeEventListener("pointermove", this.onPointerMove);
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }

  update() {
    const rangeTotal = this.max - this.min;
    const left =
      Math.floor(((this.selected.from - this.min) / rangeTotal) * 100) + "%";
    const right =
      Math.floor(((this.max - this.selected.to) / rangeTotal) * 100) + "%";

    this.subElements.progress.style.left = left;
    this.subElements.progress.style.right = right;

    this.subElements.thumbLeft.style.left = left;
    this.subElements.thumbRight.style.right = right;
  }

  onThumbPointerDown(event) {
    const thumbElement = event.target;
    event.preventDefault();

    const { left, right } = thumbElement.getBoundingClientRect();

    if (thumbElement === this.subElements.thumbLeft) {
      this.shiftX = right - event.clientX;
    } else {
      this.shiftX = left - event.clientX;
    }

    this.dragging = thumbElement;

    this.element.classList.add("range-slider_dragging");

    document.addEventListener("pointermove", this.onPointerMove);
    document.addEventListener("pointerup", this.onPointerUp);
  }

  getValue() {
    const rangeTotal = this.max - this.min;
    const { left } = this.subElements.thumbLeft.style;
    const { right } = this.subElements.thumbRight.style;

    const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
    const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);

    return { from, to };
  }
}
