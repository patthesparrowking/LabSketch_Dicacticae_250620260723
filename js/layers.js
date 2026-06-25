import { canvas, makeDraggable } from "./canvas.js";
import { selectElement, getSelectedElement } from "./selection.js";
import { updateTransform } from "./transform.js";
import { makeTextEditable } from "./text.js";

export function duplicateSelected() {
  const selected = getSelectedElement();

  if (!selected) return;

  const clone = selected.cloneNode(true);

  if (clone.tagName === "text") {
  makeTextEditable(clone);
}

  clone.dataset.x = Number(selected.dataset.x) + 30;
  clone.dataset.y = Number(selected.dataset.y) + 30;
  clone.dataset.scale = selected.dataset.scale;
  clone.dataset.rotation = selected.dataset.rotation;

  clone.classList.remove("selected");

  updateTransform(clone);
  canvas.appendChild(clone);

  makeDraggable(clone);
  selectElement(clone);
}

export function moveToFront() {
  const selected = getSelectedElement();

  if (!selected) return;

  canvas.appendChild(selected);
}

export function moveToBack() {
  const selected = getSelectedElement();

  if (!selected) return;

  const background = document.getElementById("background");

  canvas.insertBefore(selected, background.nextSibling);
}