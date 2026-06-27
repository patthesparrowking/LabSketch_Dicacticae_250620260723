import { EventBus } from "./core/EventBus.js";
import { CommandManager } from "./core/CommandManager.js";

import { ObjectStore } from "./store/ObjectStore.js";
import { SvgRenderer } from "./renderer/SvgRenderer.js";

import { LibraryService } from "./services/LibraryService.js";
import { ObjectFactory } from "./services/ObjectFactory.js";

import { AddObjectCommand } from "./commands/AddObjectCommand.js";
import { DeleteObjectCommand } from "./commands/DeleteObjectCommand.js";
import { TransformObjectCommand } from "./commands/TransformObjectCommand.js";
import { UpdateObjectCommand } from "./commands/UpdateObjectCommand.js";

import { CanvasController } from "./ui/CanvasController.js";
import { SelectionController } from "./ui/SelectionController.js";
import { GridController } from "./ui/GridController.js";
import { AlignController } from "./ui/AlignController.js";

import { initPocketUi } from "./pocketUi.js";

const canvas = document.getElementById("canvas");
const toolList = document.getElementById("toolList");
const assetSearchInput = document.getElementById("assetSearchInput");

const eventBus = new EventBus();
const objectStore = new ObjectStore(eventBus);
const commandManager = new CommandManager(eventBus);

const libraryService = new LibraryService();
const objectFactory = new ObjectFactory(libraryService);

const renderer = new SvgRenderer({
  canvas,
  eventBus
});

const selectionController = new SelectionController({
  objectStore,
  eventBus
});

const canvasController = new CanvasController({
  canvas,
  objectStore,
  commandManager,
  eventBus,
  selectionController
});

const gridController = new GridController({
  canvasController,
  eventBus
});

const alignController = new AlignController({
  objectStore,
  commandManager,
  getSelectedObject
});

init();

function init() {
  renderLibrary();
  bindToolbar();
  bindPropertyInputs();
  bindEvents();
  initPocketUi();

  updatePropertiesPanel();
  updateLayerPanel();
  updateStatusBar();
}

function selectObject(objectId) {
  selectionController.selectOnly(objectId);
}

function clearSelection() {
  selectionController.clear();
}

function bindEvents() {
  eventBus.on("object:added", ({ object }) => {
    if (object.type === "label" && object.element) {
      object.element.addEventListener("dblclick", () => {
        editLabelText(object.id);
      });
    }

    selectionController.selectOnly(object.id);
  });

  eventBus.on("object:removed", ({ object }) => {
    if (selectionController.selectedIds.has(object.id)) {
      selectionController.clear();
    }
  });

  eventBus.on("object:updated", () => {
    updatePropertiesPanel();
    updateStatusBar();
  });

  eventBus.on("objects:changed", () => {
    updateLayerPanel();
  });

  eventBus.on("selection:changed", () => {
    updatePropertiesPanel();
    updateLayerPanel();
    updateStatusBar();
  });

  eventBus.on("history:changed", ({ canUndo, canRedo }) => {
    setButtonDisabled("undoBtn", !canUndo);
    setButtonDisabled("redoBtn", !canRedo);
    setButtonDisabled("mobileUndoBtn", !canUndo);
    setButtonDisabled("mobileRedoBtn", !canRedo);
  });

  eventBus.on("grid:changed", updateStatusBar);
  eventBus.on("snap:changed", updateStatusBar);
}

function renderLibrary(searchTerm = "") {
  if (!toolList) return;

  toolList.innerHTML = "";

  const items = libraryService.search(searchTerm);
  const stations = groupByStation(items);

  if (items.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "Keine passenden Objekte gefunden.";
    toolList.appendChild(emptyMessage);
    return;
  }

  Object.entries(stations).forEach(([stationName, stationItems]) => {
    const group = document.createElement("section");
    group.className = "station-group";

    const heading = document.createElement("button");
    heading.className = "station-heading";
    heading.type = "button";
    heading.textContent = `▾ ${stationName}`;

    const content = document.createElement("div");
    content.className = "station-items";

    stationItems.forEach(item => {
      content.appendChild(createLibraryButton(item));
    });

    heading.addEventListener("click", () => {
      group.classList.toggle("is-collapsed");
      heading.textContent = group.classList.contains("is-collapsed")
        ? `▸ ${stationName}`
        : `▾ ${stationName}`;
    });

    group.appendChild(heading);
    group.appendChild(content);
    toolList.appendChild(group);
  });
}

function groupByStation(items) {
  return items.reduce((groups, item) => {
    const station = item.station || "Allgemein";

    if (!groups[station]) {
      groups[station] = [];
    }

    groups[station].push(item);
    return groups;
  }, {});
}

function createLibraryButton(item) {
  const row = document.createElement("div");
  row.className = "tool-row";

  const button = document.createElement("button");
  button.className = "tool";
  button.type = "button";
  button.title = item.label;
  button.setAttribute("aria-label", item.label);

  if (item.path) {
    const img = document.createElement("img");
    img.className = "tool-thumbnail";
    img.src = item.path;
    img.alt = item.label;
    button.appendChild(img);
  }

  const label = document.createElement("span");
  label.textContent = item.label;
  button.appendChild(label);

  button.addEventListener("click", async () => {
    try {
      const object = await objectFactory.createFromLibraryItem(item.id);
      commandManager.execute(new AddObjectCommand(objectStore, object));
    } catch (error) {
      console.error(error);
      alert(`Objekt konnte nicht eingefügt werden: ${item.label}`);
    }
  });

  const downloadButton = document.createElement("button");
  downloadButton.className = "tool-download";
  downloadButton.type = "button";
  downloadButton.textContent = "↓";
  downloadButton.title = `${item.label} herunterladen`;
  downloadButton.setAttribute("aria-label", `${item.label} herunterladen`);

  downloadButton.addEventListener("click", event => {
    event.stopPropagation();

    if (!item.path) return;

    const link = document.createElement("a");
    link.href = item.path;
    link.download = `${item.id}.svg`;
    link.click();
  });

  row.appendChild(button);
  row.appendChild(downloadButton);

  return row;
}

assetSearchInput?.addEventListener("input", () => {
  renderLibrary(assetSearchInput.value);
});

function bindToolbar() {
  bindClick("deleteBtn", deleteSelected);
  bindClick("mobileDeleteBtn", deleteSelected);

  bindClick("duplicateBtn", duplicateSelected);
  bindClick("mobileDuplicateBtn", duplicateSelected);

  bindClick("smallerBtn", () => scaleSelected(-0.1));
  bindClick("biggerBtn", () => scaleSelected(0.1));
  bindClick("mobileSmallerBtn", () => scaleSelected(-0.1));
  bindClick("mobileBiggerBtn", () => scaleSelected(0.1));

  bindClick("rotateLeftBtn", () => rotateSelected(-15));
  bindClick("rotateRightBtn", () => rotateSelected(15));
  bindClick("mobileRotateLeftBtn", () => rotateSelected(-15));
  bindClick("mobileRotateRightBtn", () => rotateSelected(15));

  bindClick("lockBtn", toggleLockSelected);
  bindClick("mobileLockBtn", toggleLockSelected);

  bindClick("visibilityBtn", toggleVisibilitySelected);
  bindClick("mobileVisibilityBtn", toggleVisibilitySelected);

  bindClick("undoBtn", () => commandManager.undo());
  bindClick("redoBtn", () => commandManager.redo());
  bindClick("mobileUndoBtn", () => commandManager.undo());
  bindClick("mobileRedoBtn", () => commandManager.redo());

  bindClick("exportSvgBtn", exportSvg);
  bindClick("mobileExportSvgBtn", exportSvg);

  bindClick("exportPngBtn", exportPng);
  bindClick("mobileExportPngBtn", exportPng);

  bindClick("saveProjectBtn", saveProject);
  bindClick("mobileSaveProjectBtn", saveProject);

  bindClick("loadProjectBtn", () => {
    document.getElementById("loadProjectInput")?.click();
  });

  bindClick("mobileLoadProjectBtn", () => {
    document.getElementById("loadProjectInput")?.click();
  });

  document.getElementById("loadProjectInput")?.addEventListener("change", loadProjectFile);

  bindClick("frontBtn", moveSelectedToFront);
  bindClick("backBtn", moveSelectedToBack);

  bindClick("alignLeftBtn", () => alignController.alignLeft());
  bindClick("alignCenterXBtn", () => alignController.alignCenterX());
  bindClick("alignRightBtn", () => alignController.alignRight());
  bindClick("alignTopBtn", () => alignController.alignTop());
  bindClick("alignCenterYBtn", () => alignController.alignCenterY());
  bindClick("alignBottomBtn", () => alignController.alignBottom());

  bindClick("mobileAlignCenterXBtn", () => alignController.alignCenterX());
  bindClick("mobileAlignCenterYBtn", () => alignController.alignCenterY());

  document.addEventListener("keydown", handleShortcuts);
}

function bindClick(id, callback) {
  document.getElementById(id)?.addEventListener("click", callback);
}

function bindPropertyInputs() {
  const inputs = [
    "nameInput",
    "posXInput",
    "posYInput",
    "scaleInput",
    "rotationInput",
    "textInput"
  ];

  inputs.forEach(id => {
    document.getElementById(id)?.addEventListener("change", updateSelectedFromProperties);
  });
}

function getSelectedObject() {
  return selectionController.getPrimaryObject();
}

function getSelectedObjects() {
  return selectionController.getSelectedObjects();
}

function deleteSelected() {
  const objects = getSelectedObjects();

  objects.forEach(object => {
    commandManager.execute(new DeleteObjectCommand(objectStore, object));
  });
}

function duplicateSelected() {
  const objects = getSelectedObjects();

  objects.forEach(object => {
    const clone = object.clone();
    commandManager.execute(new AddObjectCommand(objectStore, clone));
  });
}

function scaleSelected(amount) {
  const objects = getSelectedObjects();

  objects.forEach(object => {
    if (object.locked) return;

    commandManager.execute(
      new TransformObjectCommand(objectStore, object.id, {
        scale: Math.max(0.1, object.scale + amount)
      })
    );
  });
}

function rotateSelected(amount) {
  const objects = getSelectedObjects();

  objects.forEach(object => {
    if (object.locked) return;

    commandManager.execute(
      new TransformObjectCommand(objectStore, object.id, {
        rotation: object.rotation + amount
      })
    );
  });
}

function toggleLockSelected() {
  const objects = getSelectedObjects();

  objects.forEach(object => {
    commandManager.execute(
      new UpdateObjectCommand(objectStore, object.id, {
        locked: !object.locked
      })
    );
  });
}

function toggleVisibilitySelected() {
  const objects = getSelectedObjects();

  objects.forEach(object => {
    commandManager.execute(
      new UpdateObjectCommand(objectStore, object.id, {
        visible: !object.visible
      })
    );
  });

  selectionController.clear();
}

function moveSelectedToFront() {
  const objects = getSelectedObjects();

  objects.forEach(object => {
    if (object.element) {
      canvas.appendChild(object.element);
    }
  });
}

function moveSelectedToBack() {
  const objects = getSelectedObjects();

  objects.forEach(object => {
    if (!object.element) return;

    const grid = document.getElementById("grid");
    const background = document.getElementById("background");

    if (grid) {
      canvas.insertBefore(object.element, grid.nextSibling);
    } else if (background) {
      canvas.insertBefore(object.element, background.nextSibling);
    }
  });
}

function updateSelectedFromProperties() {
  const object = getSelectedObject();
  if (!object || object.locked) return;

  const patch = {
    name: getInputValue("nameInput", object.name),
    x: safeNumber(getInputValue("posXInput", object.x), object.x),
    y: safeNumber(getInputValue("posYInput", object.y), object.y),
    scale: Math.max(
      0.1,
      safeNumber(getInputValue("scaleInput", object.scale), object.scale)
    ),
    rotation: safeNumber(
      getInputValue("rotationInput", object.rotation),
      object.rotation
    )
  };

  if (object.type === "label") {
    patch.text = getInputValue("textInput", object.text || "Beschriftung");
  }

  commandManager.execute(
    new UpdateObjectCommand(objectStore, object.id, patch)
  );
}

function updatePropertiesPanel() {
  const selectedObjects = getSelectedObjects();
  const object = getSelectedObject();

  const nameInput = document.getElementById("nameInput");
  const posXInput = document.getElementById("posXInput");
  const posYInput = document.getElementById("posYInput");
  const scaleInput = document.getElementById("scaleInput");
  const rotationInput = document.getElementById("rotationInput");
  const textInput = document.getElementById("textInput");
  const textProperty = document.getElementById("textProperty");

  if (!object) {
    [nameInput, posXInput, posYInput, scaleInput, rotationInput, textInput]
      .forEach(input => {
        if (input) input.value = "";
      });

    if (textProperty) {
      textProperty.style.display = "none";
    }

    return;
  }

  if (nameInput) {
    nameInput.value =
      selectedObjects.length > 1
        ? `${selectedObjects.length} Objekte`
        : object.name;
  }

  if (posXInput) posXInput.value = Math.round(object.x);
  if (posYInput) posYInput.value = Math.round(object.y);
  if (scaleInput) scaleInput.value = object.scale;
  if (rotationInput) rotationInput.value = object.rotation;

  if (object.type === "label" && selectedObjects.length === 1) {
    if (textProperty) textProperty.style.display = "flex";
    if (textInput) textInput.value = object.text || "Beschriftung";
  } else {
    if (textProperty) textProperty.style.display = "none";
    if (textInput) textInput.value = "";
  }
}

function updateLayerPanel() {
  const list = document.getElementById("layersList");
  if (!list) return;

  list.innerHTML = "";

  const selectedIds = new Set(
    getSelectedObjects().map(object => object.id)
  );

  objectStore.getAll().slice().reverse().forEach(object => {
    const row = document.createElement("div");
    row.className = "layer-row";

    if (selectedIds.has(object.id)) {
      row.classList.add("is-selected");
    }

    const name = document.createElement("button");
    name.className = "layer-name";
    name.textContent = object.name;
    name.title = object.name;

    name.addEventListener("click", event => {
      if (event.shiftKey) {
        selectionController.toggle(object.id);
      } else {
        selectionController.selectOnly(object.id);
      }
    });

    const visible = document.createElement("button");
    visible.className = "layer-action";
    visible.textContent = object.visible ? "👁" : "—";
    visible.title = "Sichtbarkeit";
    visible.addEventListener("click", () => {
      commandManager.execute(
        new UpdateObjectCommand(objectStore, object.id, {
          visible: !object.visible
        })
      );
    });

    const locked = document.createElement("button");
    locked.className = "layer-action";
    locked.textContent = object.locked ? "🔒" : "🔓";
    locked.title = "Sperren";
    locked.addEventListener("click", () => {
      commandManager.execute(
        new UpdateObjectCommand(objectStore, object.id, {
          locked: !object.locked
        })
      );
    });

    row.appendChild(name);
    row.appendChild(visible);
    row.appendChild(locked);

    list.appendChild(row);
  });
}

function updateStatusBar() {
  const selectedObjects = getSelectedObjects();

  const selectedStatus = document.getElementById("selectedStatus");
  const gridStatus = document.getElementById("gridStatus");
  const snapStatus = document.getElementById("snapStatus");

  if (selectedStatus) {
    if (selectedObjects.length === 0) {
      selectedStatus.textContent = "Ausgewählt: nichts";
    } else if (selectedObjects.length === 1) {
      const object = selectedObjects[0];
      selectedStatus.textContent =
        `Ausgewählt: ${object.name}${object.locked ? " 🔒" : ""}`;
    } else {
      selectedStatus.textContent = `Ausgewählt: ${selectedObjects.length} Objekte`;
    }
  }

  if (gridStatus) {
    gridStatus.textContent = gridController.getGridVisible()
      ? "Raster: an"
      : "Raster: aus";
  }

  if (snapStatus) {
    snapStatus.textContent = gridController.getSnapEnabled()
      ? "Snap: an"
      : "Snap: aus";
  }
}

function editLabelText(objectId) {
  const object = objectStore.get(objectId);

  if (!object || object.locked || object.type !== "label") return;

  const oldText = object.text || "Beschriftung";
  const newText = prompt("Beschriftung ändern:", oldText);

  if (newText === null) return;

  const finalText = newText.trim() || oldText;

  commandManager.execute(
    new UpdateObjectCommand(objectStore, object.id, {
      text: finalText,
      name: finalText
    })
  );
}

function saveProject() {
  const data = {
    version: "2.0",
    objects: objectStore.getAll().map(object => object.toJSON())
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "labsketch-project.json";
  link.click();

  URL.revokeObjectURL(url);
}

async function loadProjectFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const objects = data.objects || data;

    const recreatedObjects = [];

    for (const objectData of objects) {
      const object = await objectFactory.recreateFromProjectData(objectData);
      recreatedObjects.push(object);
    }

    objectStore.replaceAll(recreatedObjects);
    commandManager.clear();
    selectionController.clear();
  } catch (error) {
    console.error(error);
    alert("Projekt konnte nicht geladen werden.");
  }

  event.target.value = "";
}

function exportSvg() {
  selectionController.clear();

  const clone = canvas.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "1000");
  clone.setAttribute("height", "700");

  clone.querySelector("#grid")?.remove();

  const svgText = new XMLSerializer().serializeToString(clone);

  const blob = new Blob([svgText], {
    type: "image/svg+xml;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "labsketch-export.svg";
  link.click();

  URL.revokeObjectURL(url);
}

function exportPng() {
  selectionController.clear();

  const clone = canvas.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "1000");
  clone.setAttribute("height", "700");

  clone.querySelector("#grid")?.remove();

  const svgText = new XMLSerializer().serializeToString(clone);

  const blob = new Blob([svgText], {
    type: "image/svg+xml;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const image = new Image();

  image.onload = () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1000;
    exportCanvas.height = 700;

    const ctx = exportCanvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(image, 0, 0);

    exportCanvas.toBlob(pngBlob => {
      const pngUrl = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "labsketch-export.png";
      link.click();

      URL.revokeObjectURL(pngUrl);
    }, "image/png");

    URL.revokeObjectURL(url);
  };

  image.src = url;
}

function handleShortcuts(event) {
  const activeTag = document.activeElement?.tagName?.toLowerCase();

  if (activeTag === "input" || activeTag === "textarea") {
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    commandManager.undo();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
    event.preventDefault();
    commandManager.redo();
    return;
  }

  if ((event.key === "Delete" || event.key === "Backspace") && getSelectedObjects().length > 0) {
    event.preventDefault();
    deleteSelected();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
    event.preventDefault();
    duplicateSelected();
    return;
  }

  if (event.key === "+") {
    event.preventDefault();
    scaleSelected(0.1);
    return;
  }

  if (event.key === "-") {
    event.preventDefault();
    scaleSelected(-0.1);
    return;
  }

  if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    rotateSelected(event.shiftKey ? -15 : 15);
    return;
  }

  if (event.key.toLowerCase() === "l") {
    event.preventDefault();
    toggleLockSelected();
    return;
  }

  if (event.key.toLowerCase() === "v") {
    event.preventDefault();
    toggleVisibilitySelected();
  }
}

function safeNumber(value, fallback) {
  const number = parseFloat(value);
  return Number.isNaN(number) ? fallback : number;
}

function getInputValue(id, fallback = "") {
  const input = document.getElementById(id);
  return input ? input.value : fallback;
}

function setButtonDisabled(id, disabled) {
  const button = document.getElementById(id);

  if (button) {
    button.disabled = disabled;
  }
}
