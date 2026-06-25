import { selectElement } from "./selection.js";
import { updateTransform } from "./transform.js";
import { snapValue } from "./grid.js";

export const canvas = document.getElementById("canvas");

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

export function addToCanvas(element) {
  canvas.appendChild(element);
}

export function makeDraggable(element) {
  element.addEventListener("pointerdown", startDrag);
}

function startDrag(event) {
  event.stopPropagation();

  draggedElement = event.currentTarget;
  selectElement(draggedElement);

  const point = getMousePosition(event);

  offsetX = point.x - Number(draggedElement.dataset.x);
  offsetY = point.y - Number(draggedElement.dataset.y);

  draggedElement.setPointerCapture(event.pointerId);

  draggedElement.addEventListener("pointermove", drag);
  draggedElement.addEventListener("pointerup", endDrag);
}

function drag(event) {
  if (!draggedElement) return;

  const point = getMousePosition(event);

draggedElement.dataset.x = snapValue(point.x - offsetX);
draggedElement.dataset.y = snapValue(point.y - offsetY);

  updateTransform(draggedElement);
  import("./properties.js").then(module => {
  module.updatePropertiesPanel();
});
}

function endDrag(event) {
  if (!draggedElement) return;

  draggedElement.releasePointerCapture(event.pointerId);
  draggedElement.removeEventListener("pointermove", drag);
  draggedElement.removeEventListener("pointerup", endDrag);

  draggedElement = null;
}

function getMousePosition(event) {
  const point = canvas.createSVGPoint();

  point.x = event.clientX;
  point.y = event.clientY;

  return point.matrixTransform(canvas.getScreenCTM().inverse());
}