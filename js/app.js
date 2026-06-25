import { svgLibrary } from "./library.js";
import { createObject } from "./objects.js";
import { canvas, addToCanvas, makeDraggable } from "./canvas.js";
import { selectElement, getSelectedElement, clearSelection } from "./selection.js";
import { updateTransform, scaleSelected, rotateSelected } from "./transform.js";
import { duplicateSelected, moveToFront, moveToBack } from "./layers.js";
import { exportSvg } from "./export.js";
import { saveProject, loadProjectFromFile } from "./project.js";
import { initPropertiesPanel } from "./properties.js";
import { toggleGrid, toggleSnap } from "./grid.js";
import { exportPng } from "./pngExport.js";

const smallerBtn = document.getElementById("smallerBtn");
const biggerBtn = document.getElementById("biggerBtn");
const rotateLeftBtn = document.getElementById("rotateLeftBtn");
const rotateRightBtn = document.getElementById("rotateRightBtn");
const duplicateBtn = document.getElementById("duplicateBtn");
const frontBtn = document.getElementById("frontBtn");
const backBtn = document.getElementById("backBtn");
const exportSvgBtn = document.getElementById("exportSvgBtn");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const loadProjectBtn = document.getElementById("loadProjectBtn");
const loadProjectInput = document.getElementById("loadProjectInput");
const toggleGridBtn = document.getElementById("toggleGridBtn");
const toggleSnapBtn = document.getElementById("toggleSnapBtn");
const exportPngBtn = document.getElementById("exportPngBtn");

renderToolButtons();

initPropertiesPanel();

smallerBtn.addEventListener("click", () => {
  scaleSelected(-0.1);
});

biggerBtn.addEventListener("click", () => {
  scaleSelected(0.1);
});

rotateLeftBtn.addEventListener("click", () => {
  rotateSelected(-15);
});

rotateRightBtn.addEventListener("click", () => {
  rotateSelected(15);
});

duplicateBtn.addEventListener("click", () => {
  duplicateSelected();
});

frontBtn.addEventListener("click", () => {
  moveToFront();
});

backBtn.addEventListener("click", () => {
  moveToBack();
});

exportSvgBtn.addEventListener("click", () => {
  exportSvg();
});

saveProjectBtn.addEventListener("click", () => {
  saveProject();
});

loadProjectBtn.addEventListener("click", () => {
  loadProjectInput.click();
});

toggleGridBtn.addEventListener("click", () => {
  toggleGrid();
});

toggleSnapBtn.addEventListener("click", () => {
  toggleSnap();
});

exportPngBtn.addEventListener(
  "click",
  () => {
    exportPng();
  }
);

loadProjectInput.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  loadProjectFromFile(file);
  event.target.value = "";
});

canvas.addEventListener("pointerdown", event => {
  if (event.target === canvas || event.target.id === "background") {
    clearSelection();
  }
});

document.addEventListener("keydown", event => {
  const selected = getSelectedElement();

  if ((event.key === "Delete" || event.key === "Backspace") && selected) {
    selected.remove();
    clearSelection();
  }
});

function renderToolButtons() {
  const toolList = document.getElementById("toolList");
  toolList.innerHTML = "";

  const stations = {};

  svgLibrary.forEach(item => {
    const stationName = item.station || "Allgemein";

    if (!stations[stationName]) {
      stations[stationName] = [];
    }

    stations[stationName].push(item);
  });

  Object.entries(stations).forEach(([stationName, items]) => {
    const stationGroup = document.createElement("section");
    stationGroup.className = "station-group";

    const heading = document.createElement("h2");
    heading.className = "station-heading";
    heading.textContent = stationName;

    stationGroup.appendChild(heading);

    items.forEach(item => {
      stationGroup.appendChild(createToolRow(item));
    });

    toolList.appendChild(stationGroup);
  });
}

function createToolRow(item) {
  const toolRow = document.createElement("div");
  toolRow.className = "tool-row";

  const button = document.createElement("button");
  button.className = "tool";
  button.dataset.object = item.id;

  const thumbnail = document.createElement("img");
  thumbnail.className = "tool-thumbnail";
  thumbnail.src = item.path || item.icon;
  thumbnail.alt = item.label;

  const label = document.createElement("span");
  label.textContent = item.label;

  button.appendChild(thumbnail);
  button.appendChild(label);

  button.addEventListener("click", async () => {
    const element = await createObject(item.id);

    if (!element) return;

    element.classList.add("draggable");

    element.dataset.type = item.id;
    element.dataset.x = 350;
    element.dataset.y = 200;
    element.dataset.scale = 1;
    element.dataset.rotation = 0;

    updateTransform(element);
    addToCanvas(element);
    makeDraggable(element);
    selectElement(element);
  });

  const downloadButton = document.createElement("button");
  downloadButton.className = "tool-download";
  downloadButton.textContent = "↓";
  downloadButton.title = `${item.label} als SVG herunterladen`;

  downloadButton.addEventListener("click", event => {
    event.stopPropagation();

    if (!item.path) return;

    const link = document.createElement("a");
    link.href = item.path;
    link.download = `${item.id}.svg`;
    link.click();
  });

  toolRow.appendChild(button);
  toolRow.appendChild(downloadButton);

  return toolRow;
}