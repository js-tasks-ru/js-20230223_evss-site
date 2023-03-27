export default class ColumnChart {
  constructor({
    data = [],
    label = "",
    value = 0,
    link = "",
    formatHeading = str=> str
    
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

title() {
  return `<div class="column-chart__title">Total ${this.label} ${this.linkTemplate()}</div>`;
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
  const columnChartClasses = (this.data.length > 0) ? "column-chart" : "column-chart column-chart_loading";

 return `
 <div class="${columnChartClasses}" style="--chart-height: ${this.chartHeight}">
 ${this.title()}
 ${this.container()}
    </div> `;  


}

linkTemplate() {
  return (this.link) ? `<a href="${this.link}" class="column-chart__link">View all</a>` : "";
}

colsTemplate() {
  const colProps = this.getColumnProps();
  console.log("colProps: ", colProps);
  return colProps.map(colProp => {
    return `<div style="--value: ${colProp.value}" data-tooltip="${colProp.percent}"></div>`
  }).join('');
}

render() {
  this.element = document.createElement("div");
  const template = this.template();
  this.element.innerHTML = template;
  this.element = this.element.firstElementChild;
  this.readSubElements();
}

update(data) {
  this.data = data;
     
  this.dataElements.body.innerHTML = this.colsTemplate();
 // this.dataElements["body"].innerHTML = this.colsTemplate();
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
  const scale = this.chartHeight / maxValue;

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
