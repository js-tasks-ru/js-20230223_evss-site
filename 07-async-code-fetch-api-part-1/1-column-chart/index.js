import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";
export default class ColumnChart {
  constructor({
    data = [],
    range = {from: new Date(), to: new Date()},
    label = "",
    value = 0,
    link = "",
    formatHeading = (str) => str,
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.range = range;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
  }

  element = "";
  chartHeight = 50;
  dataElements = {};

  title() {
    return `<div class="column-chart__title">Total ${
      this.label
    } ${this.linkTemplate()}</div>`;
  }
  container() {
    return `
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.formatHeading(this.value)}
        </div>
    
        <div data-element="body" class="column-chart__chart">
          ${this.colsTemplate()}
        </div>
      </div>`;
  }

  template() {
    const columnChartClasses =
      this.data.length > 0
        ? "column-chart"
        : "column-chart column-chart_loading";

    return `
     <div class="${columnChartClasses}" style="--chart-height: ${
      this.chartHeight
    }">
     ${this.title()}
     ${this.container()}
        </div> `;
  }

  linkTemplate() {
    return this.link
      ? `<a href="${this.link}" class="column-chart__link">View all</a>`
      : "";
  }

 

  render() {
    this.element = document.createElement("div");
    const template = this.template();
    this.element.innerHTML = template;
    this.element = this.element.firstElementChild;

    this.readSubElements();
    this.update(this.range.from, this.range.to);
  }

  update(start, finish) {
    this.element.classList.add("column-chart_loading");

    const url = `${BACKEND_URL}/api/dashboard/orders?from=${start}&to=${finish}`;

    fetchJson(url)
      .then((data) => {
        this.data = data;
        this.setInner();
      })
      .catch((e) => new Error(e));
  }

  setInner() {

    if (Object.keys(this.data).length) {
      this.element.classList.remove("column-chart_loading");
    this.setHeader();
    this.colsTemplate();
    this.dataElements.body.innerHTML = this.colsTemplate();
    }
  }
  setHeader() {
    const {header} = this.dataElements;
    
    const sum = Object.values(this.data).reduce((a, b) => a + b);

   this.value = this.formatHeading(sum);

    header.innerHTML = this.value;
  }

  colsTemplate() {
    const colProps = this.getColumnProps();
  console.log("colProps: ", colProps);
    return colProps.map((colProp) => {
      return `<div style="--value: ${colProp.value}" data-tooltip="${colProp.percent}"></div>`;
       
      }).join("");
  }

  getColumnProps() {
  if (this.data === undefined) return [];
  let dataset = Object.values(this.data);

   console.log("dataset: ", dataset);
    const maxValue = Math.max(...dataset);
   console.log("maxValue: ", maxValue);
    const scale = this.chartHeight / maxValue;

    return dataset.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + "%",
        value: String(Math.floor(item * scale)),
      };
    });
  }
  
 
  readSubElements() {
    this.dataElements = {};
    const elements = this.element.querySelectorAll("[data-element]");
    elements.forEach((subElement) => {
      const name = subElement.dataset.element;
      this.dataElements[name] = subElement;
    });
  }

 

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    // this.element = null;
    // this.dataElements = {};
    // this.data = {};
    // this.value = 0;

    // this.url = '';
    // this.range = {from: new Date(), to: new Date()};
    // this.label = '';
    // this.link = '';
  }
}
