import { canvas, addToCanvas, makeDraggable } from "./canvas.js";
import { createObject } from "./objects.js";
import { selectElement, clearSelection } from "./selection.js";
import { updateTransform } from "./transform.js";
import { makeTextEditable } from "./text.js";

export function saveProject() {
  clearSelection();

  const objects = Array.from(canvas.children)
    .filter(element => element.id !== "background")
    .map(element => {
      const data = {
        type: element.dataset.type,
        x: Number(element.dataset.x),
        y: Number(element.dataset.y),
        scale: Number(element.dataset.scale),
        rotation: Number(element.dataset.rotation)
      };

      if (element.dataset.type === "label") {
        data.text = element.textContent;
      }

      return data;
    });

  const json = JSON.stringify(objects, null, 2);
  const blob = new Blob([json], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "labsketch-project.json";
  link.click();

  URL.revokeObjectURL(url);
}

export function loadProjectFromFile(file) {
  const reader = new FileReader();

  reader.onload = async event => {
    const objects = JSON.parse(event.target.result);
    await loadProject(objects);
  };

  reader.readAsText(file);
}

async function loadProject(objects) {
  clearSelection();

  Array.from(canvas.children)
    .filter(element => element.id !== "background")
    .forEach(element => element.remove());

  for (const item of objects) {
    const element = await createObject(item.type);

    if (!element) continue;

    element.classList.add("draggable");

    element.dataset.type = item.type;
    element.dataset.x = item.x;
    element.dataset.y = item.y;
    element.dataset.scale = item.scale;
    element.dataset.rotation = item.rotation;

    if (item.type === "label") {
      element.textContent = item.text || "Beschriftung";
      makeTextEditable(element);
    }

    updateTransform(element);
    addToCanvas(element);
    makeDraggable(element);
  }

  const lastObject = Array.from(canvas.children)
    .filter(element => element.id !== "background")
    .at(-1);

  if (lastObject) {
    selectElement(lastObject);
  }
}