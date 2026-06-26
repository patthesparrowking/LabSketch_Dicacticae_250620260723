import { canvas, addToCanvas, makeDraggable } from "./canvas.js";
import { getSelectedObject, selectObject } from "./selection.js";
import { addObject } from "./store/objectStore.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { LabObject } from "./models/LabObject.js";
import { createObject } from "./objects.js";
import { saveHistoryState } from "./history.js";
import { updateLayerPanel } from "./layerPanel.js";

export async function duplicateSelected() {
  const selected = getSelectedObject();

  if (!selected) return;

  const element = await createObject(selected.type);

  if (!element) return;

  const clone = new LabObject({
    type: selected.type,
    name: selected.name,
    x: selected.x + 30,
    y: selected.y + 30,
    scale: selected.scale,
    rotation: selected.rotation,
    text: selected.text,
    path: selected.path,
    station: selected.station,
    tags: selected.tags
  });

  clone.element = element;

  element.classList.add("draggable");
  element.dataset.objectId = clone.id;

  addObject(clone);
  renderObject(clone);

  addToCanvas(element);
  makeDraggable(element);
  selectObject(clone);
  saveHistoryState();
  updateLayerPanel();
}

export function moveToFront() {
  const selected = getSelectedObject();

  if (!selected?.element) return;

  canvas.appendChild(selected.element);
  saveHistoryState();
  updateLayerPanel();
}

export function moveToBack() {
  const selected = getSelectedObject();

  if (!selected?.element) return;

  const background = document.getElementById("background");
  const grid = document.getElementById("grid");

  if (grid) {
    canvas.insertBefore(selected.element, grid.nextSibling);
  } else if (background) {
    canvas.insertBefore(selected.element, background.nextSibling);
  }

  saveHistoryState();
  updateLayerPanel();
}