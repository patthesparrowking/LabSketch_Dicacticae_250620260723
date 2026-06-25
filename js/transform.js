import { getSelectedElement } from "./selection.js";

export function updateTransform(element) {
  const x = Number(element.dataset.x);
  const y = Number(element.dataset.y);
  const scale = Number(element.dataset.scale);
  const rotation = Number(element.dataset.rotation);

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