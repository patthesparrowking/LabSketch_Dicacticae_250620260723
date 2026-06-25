import { getSelectedElement } from "./selection.js";
import { gridVisible, snapEnabled } from "./grid.js";

const selectedStatus = document.getElementById("selectedStatus");
const gridStatus = document.getElementById("gridStatus");
const snapStatus = document.getElementById("snapStatus");

export function updateStatusBar() {
  const selected = getSelectedElement();

  if (selected) {
    selectedStatus.textContent =
      `Ausgewählt: ${selected.dataset.type || selected.tagName}`;
  } else {
    selectedStatus.textContent = "Ausgewählt: nichts";
  }

  gridStatus.textContent = gridVisible ? "Raster: an" : "Raster: aus";
  snapStatus.textContent = snapEnabled ? "Snap: an" : "Snap: aus";
}