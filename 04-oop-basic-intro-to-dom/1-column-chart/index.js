export default class ColumnChart {
  constructor({
    data = [],
    label = "",
    value = "",
    link = "",
    formatHeading = (str) => {
      return new Intl.NumberFormat('ru-RU').format(str);
    }
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
  }

  element = "";
  chartHeight = 50;
  dataElements = {};

Title() {
  return `<div class="column-chart__title">Total ${this.label} ${this.Link()}</div>`;
}
Container() {
  return `
  <div class="column-chart__container">
    <div data-element="header" class="column-chart__header">
      ${this.formatHeading(this.value)}
    </div>

    <div data-element="body" class="column-chart__chart">
      ${this.ColsTemplate()}
    </div>
  </div>`;

}

Template() {
  return  this.Wrapper([this.Title(), this.Container()]);
   
}

Wrapper(child){
  const columnChartClasses = (this.data.length > 0) ? "column-chart" : "column-chart column-chart_loading";
  return `
      <div class="${columnChartClasses}" style="--chart-height: ${this.chartHeight}">
      ${child.map(elem => {
        return elem;
      }).join('')}     
    </div>
    `;
}

Link() {
  if (!this.link) return "";
  return `<a href="${this.link}" class="column-chart__link">View all</a>`;
}

ColsTemplate() {
  const colProps = this.getColumnProps();
  let chartData = "";
  for (const colProp of colProps) {
    chartData += `<div style="--value: ${colProp.value}" data-tooltip="${colProp.percent}"></div>`;
  }
  return chartData;
}

render() {
  this.element = document.createElement("div");
  const template = this.Template();
  this.element.innerHTML = template;
  this.element = this.element.firstElementChild;
  this.readSubElements();
}

update(data) {
  this.data = data;
  this.dataElements["body"].innerHTML = this.ColsTemplate();
}

readSubElements() {
  this.dataElements = {};
  const elements = this.element.querySelectorAll('[data-element]');
  elements.forEach((subElement) => {
    const name = subElement.dataset.element;
    this.dataElements[name] = subElement;
  });
}

getColumnProps() {
  if (this.data === undefined) return [];
  const maxValue = Math.max(...this.data);
  const scale = 50 / maxValue;

  return this.data.map(item => {
    return {
      percent: (item / maxValue * 100).toFixed(0) + '%',
      value: String(Math.floor(item * scale))
    };
  });
}

remove() {
  this.element.remove();
}

destroy() {
  this.remove();
}
}
