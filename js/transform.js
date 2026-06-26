import { getSelectedObject } from "./selection.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { updatePropertiesPanel } from "./properties.js";
import { saveHistoryState } from "./history.js";

export function renderTransform(object) {
  renderObject(object);
}

export function scaleSelected(amount) {
  const selected = getSelectedObject();

  if (!selected || selected.locked) return;

  selected.scale = Math.max(0.1, selected.scale + amount);

renderObject(selected);
updatePropertiesPanel();
saveHistoryState();
}

export function rotateSelected(amount) {
  const selected = getSelectedObject();

  if (!selected || selected.locked) return;

  selected.rotation += amount;

renderObject(selected);
updatePropertiesPanel();
saveHistoryState();
}

export function updateTransform(objectOrElement) {
  if (!objectOrElement) return;

  if (objectOrElement.element) {
    renderObject(objectOrElement);
    return;
  }

  console.warn("updateTransform wurde noch mit einem SVG-Element aufgerufen. Diese Datei muss später auf ObjectStore umgestellt werden.");
}