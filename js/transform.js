import { getSelectedElement } from "./selection.js";

export function updateTransform(element) {
  const x = Number(element.dataset.x) || 0;
  const y = Number(element.dataset.y) || 0;
  const scale = Number(element.dataset.scale) || 1;
  const rotation = Number(element.dataset.rotation) || 0;

  element.setAttribute(
    "transform",
    `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`
  );
}

export function scaleSelected(amount) {
  const selected = getSelectedElement();

  if (!selected) return;

  const currentScale = Number(selected.dataset.scale);
  const newScale = Math.max(0.2, currentScale + amount);

  selected.dataset.scale = newScale;
  updateTransform(selected);
}

export function rotateSelected(amount) {
  const selected = getSelectedElement();

  if (!selected) return;

  selected.dataset.rotation = Number(selected.dataset.rotation) + amount;
  updateTransform(selected);
}