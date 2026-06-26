import { getSelectedElement } from "./selection.js";
import { updateTransform } from "./transform.js";

const posXInput = document.getElementById("posXInput");
const posYInput = document.getElementById("posYInput");
const scaleInput = document.getElementById("scaleInput");
const rotationInput = document.getElementById("rotationInput");
const textInput = document.getElementById("textInput");
const textProperty = document.getElementById("textProperty");

export function updatePropertiesPanel() {
  const selected = getSelectedElement();

  if (!selected) {
    clearPropertiesPanel();
    return;
  }

  posXInput.value = Math.round(Number(selected.dataset.x));
  posYInput.value = Math.round(Number(selected.dataset.y));
  scaleInput.value = Number(selected.dataset.scale);
  rotationInput.value = Number(selected.dataset.rotation);

  if (selected.dataset.type === "label") {
    textProperty.style.display = "flex";
    textInput.value = selected.textContent;
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
  textProperty.style.display = "none";
}

export function initPropertiesPanel() {
  posXInput.addEventListener("input", updateSelectedFromPanel);
  posYInput.addEventListener("input", updateSelectedFromPanel);
  scaleInput.addEventListener("input", updateSelectedFromPanel);
  rotationInput.addEventListener("input", updateSelectedFromPanel);
  textInput.addEventListener("input", updateSelectedTextFromPanel);
}

function updateSelectedFromPanel() {
  const selected = getSelectedElement();
  if (!selected) return;

  const x = parseFloat(posXInput.value);
  const y = parseFloat(posYInput.value);
  const scale = parseFloat(scaleInput.value);
  const rotation = parseFloat(rotationInput.value);

  if (!Number.isNaN(x)) {
    selected.dataset.x = x;
  }

  if (!Number.isNaN(y)) {
    selected.dataset.y = y;
  }

  if (!Number.isNaN(scale) && scale > 0) {
    selected.dataset.scale = scale;
  }

  if (!Number.isNaN(rotation)) {
    selected.dataset.rotation = rotation;
  }

  updateTransform(selected);
}

function updateSelectedTextFromPanel() {
  const selected = getSelectedElement();

  if (!selected || selected.dataset.type !== "label") return;

  selected.textContent = textInput.value;
}