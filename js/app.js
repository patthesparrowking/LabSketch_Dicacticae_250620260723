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
import { initUiControls } from "./ui.js";
import { initGridUi } from "./grid.js";
import { updateStatusBar } from "./status.js";

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
const assetSearchInput = document.getElementById("assetSearchInput");

renderToolButtons();

assetSearchInput.addEventListener("input", () => {
  renderToolButtons(assetSearchInput.value);
});

initPropertiesPanel();

initUiControls();

initGridUi();
updateStatusBar();

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

function renderToolButtons(searchTerm = "") {
  const toolList = document.getElementById("toolList");
  toolList.innerHTML = "";

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredItems = svgLibrary.filter(item => {
    const searchableText = [
      item.id,
      item.label,
      item.station,
      ...(item.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  const stations = {};

  filteredItems.forEach(item => {
    const stationName = item.station || "Allgemein";

    if (!stations[stationName]) {
      stations[stationName] = [];
    }

    stations[stationName].push(item);
  });

  if (filteredItems.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "Keine passenden Objekte gefunden.";
    toolList.appendChild(emptyMessage);
    return;
  }

  Object.entries(stations).forEach(([stationName, items]) => {
    const stationGroup = document.createElement("section");
    stationGroup.className = "station-group";

    const heading = document.createElement("button");
    heading.className = "station-heading";
    heading.type = "button";
    heading.textContent = `▾ ${stationName}`;

    const stationItems = document.createElement("div");
    stationItems.className = "station-items";

    items.forEach(item => {
      stationItems.appendChild(createToolRow(item));
    });

    heading.addEventListener("click", () => {
      stationGroup.classList.toggle("is-collapsed");

      heading.textContent = stationGroup.classList.contains("is-collapsed")
        ? `▸ ${stationName}`
        : `▾ ${stationName}`;
    });

    stationGroup.appendChild(heading);
    stationGroup.appendChild(stationItems);
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