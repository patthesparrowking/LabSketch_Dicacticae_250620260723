import { svgLibrary } from "./library.js";
import { createObject } from "./objects.js";
import { canvas, addToCanvas, makeDraggable } from "./canvas.js";
import { selectObject, getSelectedObject, clearSelection } from "./selection.js";
import { scaleSelected, rotateSelected } from "./transform.js";
import { duplicateSelected, moveToFront, moveToBack } from "./layers.js";
import { exportSvg } from "./export.js";
import { exportPng } from "./pngExport.js";
import { saveProject, loadProjectFromFile } from "./project.js";
import { initPropertiesPanel } from "./properties.js";
import { toggleGrid, toggleSnap, initGridUi } from "./grid.js";
import { initUiControls } from "./ui.js";
import { updateStatusBar } from "./status.js";
import { initShortcuts } from "./shortcuts.js";

import { LabObject } from "./models/LabObject.js";
import { addObject, removeObject } from "./store/objectStore.js";
import { renderObject } from "./renderer/objectRenderer.js";
// import { saveHistoryState, undo, redo } from "./history.js";
import { toggleLockSelected } from "./lock.js";
import { toggleVisibilitySelected } from "./visibility.js";
import { updateLayerPanel } from "./layerPanel.js";
import { undo, redo, saveHistoryState } from "./history.js";

const smallerBtn = document.getElementById("smallerBtn");
const biggerBtn = document.getElementById("biggerBtn");
const rotateLeftBtn = document.getElementById("rotateLeftBtn");
const rotateRightBtn = document.getElementById("rotateRightBtn");
const duplicateBtn = document.getElementById("duplicateBtn");
const frontBtn = document.getElementById("frontBtn");
const backBtn = document.getElementById("backBtn");
const exportSvgBtn = document.getElementById("exportSvgBtn");
const exportPngBtn = document.getElementById("exportPngBtn");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const loadProjectBtn = document.getElementById("loadProjectBtn");
const loadProjectInput = document.getElementById("loadProjectInput");
const toggleGridBtn = document.getElementById("toggleGridBtn");
const toggleSnapBtn = document.getElementById("toggleSnapBtn");
const assetSearchInput = document.getElementById("assetSearchInput");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const lockBtn = document.getElementById("lockBtn");
const visibilityBtn = document.getElementById("visibilityBtn");

const mobileUndoBtn = document.getElementById("mobileUndoBtn");
const mobileRedoBtn = document.getElementById("mobileRedoBtn");
const mobileDuplicateBtn = document.getElementById("mobileDuplicateBtn");
const mobileDeleteBtn = document.getElementById("mobileDeleteBtn");

const mobileSmallerBtn = document.getElementById("mobileSmallerBtn");
const mobileBiggerBtn = document.getElementById("mobileBiggerBtn");
const mobileRotateLeftBtn = document.getElementById("mobileRotateLeftBtn");
const mobileRotateRightBtn = document.getElementById("mobileRotateRightBtn");
const mobileFrontBtn = document.getElementById("mobileFrontBtn");
const mobileBackBtn = document.getElementById("mobileBackBtn");
const mobileLockBtn = document.getElementById("mobileLockBtn");
const mobileVisibilityBtn = document.getElementById("mobileVisibilityBtn");
const mobileGridBtn = document.getElementById("mobileGridBtn");
const mobileSnapBtn = document.getElementById("mobileSnapBtn");

renderToolButtons();
initPropertiesPanel();
initUiControls();
initGridUi();
updateStatusBar();
saveHistoryState();
initShortcuts();
updateLayerPanel();

mobileUndoBtn?.addEventListener("click", async () => {
  await undo();
});

mobileRedoBtn?.addEventListener("click", async () => {
  await redo();
});

mobileDuplicateBtn?.addEventListener("click", async () => {
  await duplicateSelected();
});

mobileDeleteBtn?.addEventListener("click", () => {
  const selected = getSelectedObject();
  if (!selected) return;

  removeObject(selected.id);
  clearSelection();
  saveHistoryState();
});

mobileSmallerBtn?.addEventListener("click", () => scaleSelected(-0.1));
mobileBiggerBtn?.addEventListener("click", () => scaleSelected(0.1));
mobileRotateLeftBtn?.addEventListener("click", () => rotateSelected(-15));
mobileRotateRightBtn?.addEventListener("click", () => rotateSelected(15));
mobileFrontBtn?.addEventListener("click", () => moveToFront());
mobileBackBtn?.addEventListener("click", () => moveToBack());
mobileLockBtn?.addEventListener("click", () => toggleLockSelected());
mobileVisibilityBtn?.addEventListener("click", () => toggleVisibilitySelected());
mobileGridBtn?.addEventListener("click", () => toggleGrid());
mobileSnapBtn?.addEventListener("click", () => toggleSnap());

assetSearchInput.addEventListener("input", () => {
  renderToolButtons(assetSearchInput.value);
});

smallerBtn.addEventListener("click", () => {
  scaleSelected(-0.1);

});

biggerBtn.addEventListener("click", () => {
  scaleSelected(0.1);

});

rotateLeftBtn.addEventListener("click", () => {
  rotateSelected(-15);

});

visibilityBtn.addEventListener("click", () => {
  toggleVisibilitySelected();
});

rotateRightBtn.addEventListener("click", () => {
  rotateSelected(15);

});

duplicateBtn.addEventListener("click", async () => {
  await duplicateSelected();
  updateLayerPanel();

});

undoBtn.addEventListener("click", async () => {
  await undo();
});

lockBtn.addEventListener("click", () => {
  toggleLockSelected();
});

redoBtn.addEventListener("click", async () => {
  await redo();
});
frontBtn.addEventListener("click", () => moveToFront());
backBtn.addEventListener("click", () => moveToBack());

exportSvgBtn.addEventListener("click", () => exportSvg());
exportPngBtn.addEventListener("click", () => exportPng());

saveProjectBtn.addEventListener("click", () => saveProject());

loadProjectInput.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  loadProjectFromFile(file);
  event.target.value = "";
      saveHistoryState();

});

toggleGridBtn.addEventListener("click", () => toggleGrid());
toggleSnapBtn.addEventListener("click", () => toggleSnap());

canvas.addEventListener("pointerdown", event => {
  if (event.target === canvas || event.target.id === "background" || event.target.id === "grid") {
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

  if (filteredItems.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "Keine passenden Objekte gefunden.";
    toolList.appendChild(emptyMessage);
    return;
  }

  const stations = {};

  filteredItems.forEach(item => {
    const stationName = item.station || "Allgemein";

    if (!stations[stationName]) {
      stations[stationName] = [];
    }

    stations[stationName].push(item);
  });

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
    await insertLibraryObject(item);
saveHistoryState();
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

async function insertLibraryObject(item) {
  const element = await createObject(item.id);

  if (!element) return;

  const object = new LabObject({
    type: item.id,
    name: item.label,
    x: 350,
    y: 200,
    scale: 1,
    rotation: 0,
    text: item.id === "label" ? "Beschriftung" : "",
    path: item.path || "",
    station: item.station || "",
    tags: item.tags || []
  });

  object.element = element;

  element.classList.add("draggable");
  element.dataset.objectId = object.id;

  addObject(object);
  renderObject(object);

  addToCanvas(element);
  makeDraggable(element);
  selectObject(object);
}