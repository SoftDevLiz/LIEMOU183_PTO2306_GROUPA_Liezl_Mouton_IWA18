// Imports so we can work with everything we need
import { html, createOrderHtml } from "./view.js";
import { createOrderData } from "./data.js";

// Created the below functionality so that the 'Add Order' button starts as focused
window.onload = function () {
  html.other.add.focus();
};

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

const handleDragStart = (event) => {};
const handleDragEnd = (event) => {};

// Created functionality for the help toggle handler (Q for Sasha: How is the overlay hidden in the first place?)
const handleHelpToggle = (event) => {
  // Created two booleans that check whether the event target is the close button or help button
  const isHelpButton = event.target === html.other.help;
  const isCloseButton = event.target === html.help.cancel;
  const helpOverlay = html.help.overlay;
  // Use the booleans in the if conditions
  if (isHelpButton) {
    helpOverlay.style.display = "block";
  } else if (isCloseButton) {
    helpOverlay.style.display = "none";
    window.onload(); // Calls the focus function when the overlay is closed
  }
};

// Created functionality for the add order handler
const handleAddToggle = (event) => {
  const isAddButton = event.target === html.other.add;
  const isCloseButton = event.target === html.add.cancel;
  const addOverlay = html.add.overlay;
  const formFields = html.add.form;

  if (isAddButton) {
    addOverlay.style.display = "block";
  } else if (isCloseButton) {
    addOverlay.style.display = "none";
    // Use .reset() to clear the form input fields
    formFields.reset();
    window.onload();
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
  addOverlay.style.display = "none";
};

const handleEditToggle = (event) => {};
const handleEditSubmit = (event) => {};
const handleDelete = (event) => {};

html.add.cancel.addEventListener("click", handleAddToggle); // close add order overlay button
html.other.add.addEventListener("click", handleAddToggle); // add order button (opens overlay)
html.add.form.addEventListener("submit", handleAddSubmit); // add (submit) button in order overlay

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
