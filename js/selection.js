import { updatePropertiesPanel, clearPropertiesPanel } from "./properties.js";

let selectedElement = null;

export function selectElement(element) {
  clearSelection();

  selectedElement = element;
  selectedElement.classList.add("selected");

  updatePropertiesPanel();
}

export function clearSelection() {
  if (selectedElement) {
    selectedElement.classList.remove("selected");
  }

  selectedElement = null;
  clearPropertiesPanel();
}

export function getSelectedElement() {
  return selectedElement;
}