import { selectElement } from "./selection.js";
import { getObjectByElement } from "./store/objectStore.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { snapValue } from "./grid.js";
import { updatePropertiesPanel } from "./properties.js";
import { saveHistoryState } from "./history.js";

export const canvas = document.getElementById("canvas");

let draggedObject = null;
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

  const element = event.currentTarget;
  const object = getObjectByElement(element);

  if (!object || object.locked) return;

  draggedObject = object;
  selectElement(element);

  const point = getMousePosition(event);

  offsetX = point.x - draggedObject.x;
  offsetY = point.y - draggedObject.y;

  element.setPointerCapture(event.pointerId);

  element.addEventListener("pointermove", drag);
  element.addEventListener("pointerup", endDrag);
}

function drag(event) {
  if (!draggedObject) return;

  const point = getMousePosition(event);

  draggedObject.x = snapValue(point.x - offsetX);
  draggedObject.y = snapValue(point.y - offsetY);

  renderObject(draggedObject);
  updatePropertiesPanel();
}

function endDrag(event) {
  if (!draggedObject?.element) return;

  const element = draggedObject.element;

  element.releasePointerCapture(event.pointerId);
  element.removeEventListener("pointermove", drag);
  element.removeEventListener("pointerup", endDrag);

  saveHistoryState();

  draggedObject = null;
}

function getMousePosition(event) {
  const point = canvas.createSVGPoint();

  point.x = event.clientX;
  point.y = event.clientY;

  return point.matrixTransform(canvas.getScreenCTM().inverse());
}