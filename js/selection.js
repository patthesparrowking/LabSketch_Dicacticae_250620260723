let selectedElement = null;

export function selectElement(element) {
  clearSelection();

  selectedElement = element;
  selectedElement.classList.add("selected");
}

export function clearSelection() {
  if (selectedElement) {
    selectedElement.classList.remove("selected");
  }

  selectedElement = null;
}

export function getSelectedElement() {
  return selectedElement;
}