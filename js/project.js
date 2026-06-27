import { addToCanvas, makeDraggable } from "./canvas.js";
import { createObject } from "./objects.js";
import { selectObject, clearSelection } from "./selection.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { LabObject } from "./models/LabObject.js";
import { addObject, getAllObjects, clearObjects } from "./store/ObjectStore.js";
import { updateLayerPanel } from "./layerPanel.js";

export function saveProject() {
  clearSelection();

  const projectData = getAllObjects().map(object => ({
    type: object.type,
    name: object.name,
    x: object.x,
    y: object.y,
    scale: object.scale,
    rotation: object.rotation,
    text: object.text,
    path: object.path,
    station: object.station,
    tags: object.tags,
    locked: object.locked,
    visible: object.visible
  }));

  const json = JSON.stringify(projectData, null, 2);

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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async event => {
      try {
        const projectData = JSON.parse(event.target.result);
        await loadProjectData(projectData);
        resolve();
      } catch (error) {
        console.error("Projekt konnte nicht geladen werden:", error);
        alert("Die Projektdatei konnte nicht geladen werden.");
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function loadProjectData(projectData) {
  clearSelection();
  clearObjects();

  let lastObject = null;

  for (const data of projectData) {
    const element = await createObject(data.type);

    if (!element) continue;

    const object = new LabObject({
      type: data.type,
      name: data.name,
      x: data.x,
      y: data.y,
      scale: data.scale,
      rotation: data.rotation,
      text: data.text,
      path: data.path,
      station: data.station,
      tags: data.tags || []
    });

    object.locked = data.locked || false;
    object.visible = data.visible !== false;
    object.element = element;

    element.classList.add("draggable");
    element.dataset.objectId = object.id;

    addObject(object);
    renderObject(object);

    addToCanvas(element);
    makeDraggable(element);

    lastObject = object;
  }

  if (lastObject) {
    selectObject(lastObject);
  }
  updateLayerPanel();
}