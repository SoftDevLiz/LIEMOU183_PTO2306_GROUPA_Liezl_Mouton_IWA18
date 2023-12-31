// Imports so we can work with everything we need
import {
  html,
  createOrderHtml,
  moveToColumn,
  updateDraggingHtml,
  focus,
} from "./view.js";
import { COLUMNS, createOrderData, state, updateDragging } from "./data.js";

// Created a variable to store the order ID so that we can use it as we work with it
let orderID = "";

// Exported/Imported the focus function from view.js, call it so that the app starts with the focus on the add button
focus();

/*
                      HELP HANDLERS
*/

// Created functionality for the help toggle handler (Q for Sasha: How is the overlay hidden in the first place?)
const handleHelpToggle = (event) => {
  // Created two booleans that check whether the event target is the close button or help button
  const isHelpButton = event.target === html.other.help;
  const isCloseButton = event.target === html.help.cancel;
  const helpOverlay = html.help.overlay;
  // Use the booleans in the if conditions
  if (isHelpButton) {
    helpOverlay.show();
  } else if (isCloseButton) {
    helpOverlay.close();
    focus(); // Calls the focus function when the overlay is closed
  }
};

/*
                      ADD HANDLERS
*/

// Created functionality for the add order handler
const handleAddToggle = (event) => {
  const isAddButton = event.target === html.other.add;
  const isCloseButton = event.target === html.add.cancel;
  const addOverlay = html.add.overlay;
  const formFields = html.add.form;

  if (isAddButton) {
    addOverlay.show();
  } else if (isCloseButton) {
    addOverlay.close();
    // Use .reset() to clear the form input fields
    formFields.reset();
    focus();
  }
};

// Created the functionality of the order submit button
const handleAddSubmit = (event) => {
  // Use .preventDefault() to stop the page from reloading after form submission (We need to use the data from the form)
  event.preventDefault();
  // Use .value to fetch the contents of the form input fields
  const title = html.add.title.value;
  const table = html.add.table.value;
  const addOverlay = html.add.overlay;
  const formFields = html.add.form;
  // Use the given function createOrderData to create a new order object
  const newOrder = createOrderData({ title, table, column: "ordered" });
  // Pass the order object to the createOrderHtml function which takes the object and passes the object data into the related html elements
  const newOrderHtml = createOrderHtml(newOrder);
  // Creates the value 'ordered' to slot into the columns property in the html object
  const orderedColumn = html.columns.ordered;
  // Append the newly created html for the order to the ordered column. We will then visually see the order on the interface.
  orderedColumn.appendChild(newOrderHtml);
  formFields.reset();
  addOverlay.close();
  focus();
};

/*
                      EDIT HANDLERS
*/

// Created the functionality for the edit order handler
const handleEditToggle = (event) => {
  // Used .closest() to check for the closest element that matches the selector (order class)
  const isOrder = event.target.closest(".order");
  const isCancelButton = event.target === html.edit.cancel;
  const formFields = html.edit.form;
  // Used .dataset to fetch the data-id attribute from the order element (We need this to identify the order we are working with)
  orderID = event.target.dataset.id;
  const editOverlay = html.edit.overlay;
  if (isOrder) {
    editOverlay.show();
  } else if (isCancelButton) {
    editOverlay.close();
    formFields.reset();
    focus();
  }
};

// Created the functionality for the delete handler
const handleDelete = (event) => {
  const isDeleteButton = event.target === html.edit.delete;
  const editOverlay = html.edit.overlay;
  // data-id actually gets created (in the DOM?) when an order gets created
  const orderHtml = document.querySelector(`[data-id="${orderID}"]`);
  if (isDeleteButton) {
    // Used .remove() to remove the order (Which is wrapped in a div which contains the ID)
    orderHtml.remove();
    editOverlay.close();
    focus();
  }
};

// Created edit submit functionality
const handleEditSubmit = (event) => {
  // Used .preventDefault() so that we can work with the form data
  event.preventDefault();

  const isUpdateButton = event.target === html.edit.form;
  const editOverlay = html.edit.overlay;

  // Retrieve the new values from the edit form
  const newTitle = html.edit.title.value;
  const newTable = html.edit.table.value;
  const newStatus = html.edit.column.value;
  const formFields = html.edit.form;
  // Select the order div with the matching ID so we can work with it
  const orderHtml = document.querySelector(`[data-id="${orderID}"]`);

  if (isUpdateButton) {
    // Looked inside of the div, changed the textContent to the new values
    orderHtml.querySelector("[data-order-title]").textContent = newTitle;
    orderHtml.querySelector("[data-order-table]").textContent = newTable;
    // Use given function to update the status of the order
    moveToColumn(orderID, newStatus);
    formFields.reset();
    editOverlay.close();
    focus();
  }
};

/*
                      DRAGGING HANDLERS
*/

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event
 */
const handleDragOver = (event) => {
  event.preventDefault();
  const path = event.path || event.composedPath();
  let column = null;

  for (const element of path) {
    const { area } = element.dataset;
    if (area) {
      column = area;
      break;
    }
  }

  if (!column) return;
  updateDragging({ over: column });
  updateDraggingHtml({ over: column });
};

// Holds the ID of the order that is being dragged
let draggedId;

// Created the functionality for the drag start handler
const handleDragStart = (event) => {
  draggedId = event.target.dataset.id;
  // Used dataTransfer.setData() to set the data that is being dragged (According to the AI)
  event.dataTransfer.setData("text/plain", draggedId);
};

// Created the functionality for the drag end handler
const handleDragEnd = (event) => {
  // Retrieve the data that was set in the drag start handler (Idk why I need to do this)
  const data = event.dataTransfer.getData("text/plain");

  // This will hold the column that we are currently dragging over
  let column = "";

  // Start a loop that loops through the COLUMNS array
  for (const columnName of COLUMNS) {
    // If the background color of the column is green, then set the column variable to the column name
    if (html.area[columnName].style.backgroundColor === "rgba(0, 160, 70, 0.2)")
      column = html.area[columnName]
        .querySelector('[class="grid__content"]')
        .getAttribute("data-column");
    // Reset the background color of the column when we drop the element
    html.area[columnName].style.backgroundColor = "";
  }
  // Call the moveToColumn function, using the draggedID and column variable
  moveToColumn(draggedId, column);
};
// I was stuck because I didn't import the things I needed for the drag handlers
// I never actually use state

html.add.cancel.addEventListener("click", handleAddToggle);
html.other.add.addEventListener("click", handleAddToggle);
html.add.form.addEventListener("submit", handleAddSubmit);

html.other.grid.addEventListener("click", handleEditToggle);
html.edit.cancel.addEventListener("click", handleEditToggle);
html.edit.form.addEventListener("submit", handleEditSubmit);
html.edit.delete.addEventListener("click", handleDelete);

html.help.cancel.addEventListener("click", handleHelpToggle);
html.other.help.addEventListener("click", handleHelpToggle);

for (const htmlColumn of Object.values(html.columns)) {
  htmlColumn.addEventListener("dragstart", handleDragStart);
  htmlColumn.addEventListener("dragend", handleDragEnd);
}

for (const htmlArea of Object.values(html.area)) {
  htmlArea.addEventListener("dragover", handleDragOver);
}
