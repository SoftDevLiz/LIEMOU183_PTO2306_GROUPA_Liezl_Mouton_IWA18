import { html } from "./view.js"; // Imported 'html' object so we can work with all the elements

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

const handleAddToggle = (event) => {
  alert("this works");
};

const handleAddSubmit = (event) => {};
const handleEditToggle = (event) => {};
const handleEditSubmit = (event) => {};
const handleDelete = (event) => {};

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
