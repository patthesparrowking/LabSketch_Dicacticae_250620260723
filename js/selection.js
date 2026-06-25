import { updatePropertiesPanel, clearPropertiesPanel } from "./properties.js";
import { updateStatusBar } from "./status.js";

let selectedElement = null;

export function selectElement(element) {
  clearSelection();

  selectedElement = element;
  selectedElement.classList.add("selected");

  updatePropertiesPanel();
  updateStatusBar();
}

export function clearSelection() {
  if (selectedElement) {
    selectedElement.classList.remove("selected");
  }

  selectedElement = null;
  clearPropertiesPanel();
  updateStatusBar();
}

export function getSelectedElement() {
  return selectedElement;
}