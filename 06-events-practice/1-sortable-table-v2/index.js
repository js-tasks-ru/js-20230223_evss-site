export default class SortableTable {
  element = null;
  subElements = {};


  constructor(headersConfig, { data = [], sorted = { id: "", order: "" }, sortLocally = true } = {} ) {
    this.headerConfig = headersConfig;
    this.isLocalSort = sortLocally;
    const { id: sortFieldName, order: sortOrder } = sorted;
    this.currentSort = {
      fieldName: sortFieldName,
      order: sortOrder,
    };

    this.data = [...data];

    if (sortFieldName) {
      this.sortData(sortFieldName, sortOrder);
    }

    this.render();
    this.addEventListeners();
  }

  onSortClick = (ev) => {
    const targetFieldName = ev.currentTarget.dataset.id;
    const isFieldCurrentlySorted =
      this.currentSort.fieldName === targetFieldName;
    const sortOrder =
      isFieldCurrentlySorted && this.currentSort.order === "desc"
        ? "asc"
        : "desc";

    this.currentSort = sortOrder
      ? { fieldName: targetFieldName, order: sortOrder }
      : {};
    if (this.isLocalSort) {
      this.sortLocally();
    } else {
      this.sortOnServer();
    }
  };

  

  get headerTemplate() {
    const { fieldName, order } = this.currentSort;
    return this.headerConfig
      .map(({ id, title, sortable, sortType }) => {
        const isColumnSorted = fieldName === id;
        return `<div class='sortable-table__cell' data-sortable='${sortable}' data-id='${id}' data-order='${
          isColumnSorted ? order : ""
        }'>
            <span>${title}</span>
            ${isColumnSorted ? this.arrowTemplate : ""}

      </div>`;
      })
      .join("");
  }

  get arrowTemplate() {
    return `
            <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>
        `;
  }
  
  get rowsTemplate() {
    return this.data
      .map(
        (row) =>
          `<div class='sortable-table__row'>
        ${this.headerConfig.map(({ id, template }) =>
            typeof template === "function" ? template(row[id]) : `<div class='sortable-table__cell'>${row[id]}</div>`
          )
          .join("")}
       </div>`
      )
      .join("");
  }



  get template() {
    return `<div class='sortable-table'>
        <div data-element='header' class='sortable-table__header sortable-table__row'>
          ${this.headerTemplate}
        </div>
        <div data-element='body' class='sortable-table__body'>
          ${this.rowsTemplate}
        </div>
      </div>`;
  }

  updateHeaders() {
    const { fieldName, order } = this.currentSort;
    const headerCells = this.element.querySelectorAll(
      ".sortable-table__cell[data-id]"
    );
    const currentSortedHeader = this.element.querySelector(
      `.sortable-table__cell[data-id="${fieldName}"]`
    );
    headerCells.forEach((column) => {
      column.dataset.order = "";
    });

    currentSortedHeader.dataset.order = order;
  }

  sortLocally() {
    const { fieldName, order } = this.currentSort;
    this.sortData(fieldName, order);
    this.subElements.body.innerHTML = this.rowsTemplate;
    this.updateHeaders();
  }

  sortOnServer() {
    console.log("Server sort");
  }

  sortData(fieldName, order) {
    const { sortType } = this.headerConfig.find(({ id }) => id === fieldName);
    const multiplier = order === "desc" ? -1 : 1;
    this.data.sort(({ [fieldName]: a }, { [fieldName]: b }) => {
      switch (sortType) {
        case "string":
          return (
            multiplier *
            a.localeCompare(b, ["ru", "en"], {
              caseFirst: "upper",
            })
          );
        case "number":
        default:
          return multiplier * (a - b);
      }
    });
  }

  addEventListeners() {
    const headerCells = this.subElements.header.querySelectorAll(
      ".sortable-table__cell"
    );
    headerCells.forEach((headerCell) => {
      if (headerCell.dataset.sortable) {
        headerCell.addEventListener("pointerdown", this.onSortClick);
      }
    });
  }

  render() {
    const elementContainer = document.createElement("div");
    elementContainer.innerHTML = this.template;

    this.element = elementContainer.firstChild;
    const tableComponents = this.element.querySelectorAll("[data-element]");

    tableComponents.forEach((component) => {
      this.subElements[component.dataset.element] = component;
    });
  }

  removeEventListeners() {
    const headerCells = this.subElements.header.querySelectorAll(
      ".sortable-table__cell"
    );
    headerCells.forEach((headerCell) => {
      headerCell.removeEventListener("pointerdown", this.onSortClick);
    });
  }

  destroy() {
    if (this.element) {
      this.removeEventListeners();
      this.element.remove();
      this.element = null;
    }

    this.subElements = {};
  }
}
