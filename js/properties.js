import { getSelectedObject } from "./selection.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { saveHistoryState } from "./history.js";

const posXInput = document.getElementById("posXInput");
const posYInput = document.getElementById("posYInput");
const scaleInput = document.getElementById("scaleInput");
const rotationInput = document.getElementById("rotationInput");
const textInput = document.getElementById("textInput");
const textProperty = document.getElementById("textProperty");

export function updatePropertiesPanel() {
  const selected = getSelectedObject();

  if (!selected) {
    clearPropertiesPanel();
    return;
  }

  posXInput.value = Math.round(selected.x);
  posYInput.value = Math.round(selected.y);
  scaleInput.value = selected.scale;
  rotationInput.value = selected.rotation;

  if (selected.type === "label") {
    textProperty.style.display = "flex";
    textInput.value = selected.text || selected.element?.textContent || "";
  } else {
    textProperty.style.display = "none";
    textInput.value = "";
  }
}

export function clearPropertiesPanel() {
  posXInput.value = "";
  posYInput.value = "";
  scaleInput.value = "";
  rotationInput.value = "";
  textInput.value = "";

  if (textProperty) {
    textProperty.style.display = "none";
  }
}

export function initPropertiesPanel() {
posXInput.addEventListener("input", updateSelectedFromPanel);
posYInput.addEventListener("input", updateSelectedFromPanel);
scaleInput.addEventListener("input", updateSelectedFromPanel);
rotationInput.addEventListener("input", updateSelectedFromPanel);
textInput.addEventListener("input", updateSelectedTextFromPanel);

posXInput.addEventListener("change", saveHistoryState);
posYInput.addEventListener("change", saveHistoryState);
scaleInput.addEventListener("change", saveHistoryState);
rotationInput.addEventListener("change", saveHistoryState);
textInput.addEventListener("change", saveHistoryState);
}

function updateSelectedFromPanel() {
  const selected = getSelectedObject();
  if (!selected || selected.locked) return;

  const x = parseFloat(posXInput.value);
  const y = parseFloat(posYInput.value);
  const scale = parseFloat(scaleInput.value);
  const rotation = parseFloat(rotationInput.value);

  if (!Number.isNaN(x)) {
    selected.x = x;
  }

  if (!Number.isNaN(y)) {
    selected.y = y;
  }

  if (!Number.isNaN(scale) && scale > 0) {
    selected.scale = scale;
  }

  if (!Number.isNaN(rotation)) {
    selected.rotation = rotation;
  }

  renderObject(selected);
}

function updateSelectedTextFromPanel() {
  const selected = getSelectedObject();

  if (!selected || selected.locked || selected.type !== "label") return;

  selected.text = textInput.value;
  renderObject(selected);
}