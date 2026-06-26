import { getSelectedObject } from "./selection.js";
import { gridVisible, snapEnabled } from "./grid.js";

const selectedStatus = document.getElementById("selectedStatus");
const gridStatus = document.getElementById("gridStatus");
const snapStatus = document.getElementById("snapStatus");

export function updateStatusBar() {
  const selected = getSelectedObject();

selectedStatus.textContent = selected
  ? `Ausgewählt: ${selected.name || selected.type} ${selected.locked ? "🔒" : ""} ${selected.visible ? "" : "ausgeblendet"}`
  : "Ausgewählt: nichts";

  gridStatus.textContent = gridVisible ? "Raster: an" : "Raster: aus";
  snapStatus.textContent = snapEnabled ? "Snap: an" : "Snap: aus";
}