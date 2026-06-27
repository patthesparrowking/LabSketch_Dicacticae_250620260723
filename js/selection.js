import { getObjectByElement, getObject } from "./store/ObjectStore.js";
import { updatePropertiesPanel, clearPropertiesPanel } from "./properties.js";
import { updateStatusBar } from "./status.js";
import { updateLayerPanel } from "./layerPanel.js";

let selectedObjectId = null;

export function selectObject(objectOrId) {
  clearSelection();

  const object =
    typeof objectOrId === "string"
      ? getObject(objectOrId)
      : objectOrId;

  if (!object) return;

  selectedObjectId = object.id;

  if (object.element) {
    object.element.classList.add("selected");
  }

  updatePropertiesPanel();
  updateStatusBar();
  updateLayerPanel();
}

export function selectElement(element) {
  const object = getObjectByElement(element);
  selectObject(object);
}

export function clearSelection() {
  const selected = getSelectedObject();

  if (selected?.element) {
    selected.element.classList.remove("selected");
  }

  selectedObjectId = null;

  clearPropertiesPanel();
  updateStatusBar();
  updateLayerPanel();
}

export function getSelectedObject() {
  if (!selectedObjectId) return null;
  return getObject(selectedObjectId);
}

export function getSelectedElement() {
  const selected = getSelectedObject();
  return selected?.element || null;
}