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

import { AddObjectsCommand } from "./commands/AddObjectsCommand.js";
import { DeleteObjectsCommand } from "./commands/DeleteObjectsCommand.js";
import { DistributeController } from "./ui/DistributeController.js";

import { GroupObjectsCommand } from "./commands/GroupObjectsCommand.js";
import { UngroupObjectsCommand } from "./commands/UngroupObjectsCommand.js";

import { GroupStore } from "./store/GroupStore.js";
import { UpdateObjectsCommand } from "./commands/UpdateObjectsCommand.js";
import { ArrowTool } from "./ui/ArrowTool.js";
import { ArrowHandleController } from "./ui/ArrowHandleController.js";
import { LineTool } from "./ui/LineTool.js";
import { ToolManager } from "./ui/ToolManager.js";
import { SelectionHandlesController } from "./ui/SelectionHandlesController.js";
import { SelectionBoxController } from "./ui/SelectionBoxController.js";
import { SmartGuideController } from "./ui/SmartGuideController.js";
import { GuideSettingsController } from "./ui/GuideSettingsController.js";
import { AnchorController } from "./ui/AnchorController.js";
import { AnchorSnapController } from "./ui/AnchorSnapController.js";
import { GeometryService } from "./services/GeometryService.js";

const canvas = document.getElementById("canvas");
const geometryService = new GeometryService(canvas);
const toolList = document.getElementById("toolList");
const assetSearchInput = document.getElementById("assetSearchInput");

const eventBus = new EventBus();
const objectStore = new ObjectStore(eventBus);
const groupStore = new GroupStore(eventBus);
const commandManager = new CommandManager(eventBus);

const libraryService = new LibraryService();
const objectFactory = new ObjectFactory(libraryService);

const renderer = new SvgRenderer({
  canvas,
  eventBus,
  objectStore
});

const selectionController = new SelectionController({
  objectStore,
  eventBus
});

const smartGuideController = new SmartGuideController({
  canvas,
  objectStore
});

const anchorController = new AnchorController({
  canvas,
  eventBus,
  selectionController
});

const anchorSnapController = new AnchorSnapController({
  objectStore,
  anchorController
});

const canvasController = new CanvasController({
  canvas,
  objectStore,
  commandManager,
  eventBus,
  selectionController,
  smartGuideController,
  anchorSnapController
});

const guideSettingsController = new GuideSettingsController({
  canvasController,
  smartGuideController
});

const selectionHandlesController = new SelectionHandlesController({
  canvas,
  eventBus,
  selectionController,
  objectStore,
  commandManager,
  geometryService
});





const selectionBoxController = new SelectionBoxController({
  canvas,
  objectStore,
  selectionController
});

const arrowHandleController = new ArrowHandleController({
  canvas,
  objectStore,
  commandManager,
  eventBus,
  getSelectedObject,
  anchorSnapController
});

const arrowTool = new ArrowTool({
  canvas,
  objectStore,
  commandManager,
  eventBus,
  anchorSnapController
});

const lineTool = new LineTool({
  canvas,
  objectStore,
  commandManager,
  eventBus
});

const toolManager = new ToolManager({ eventBus });

toolManager.registerTool("line", lineTool);
toolManager.registerTool("arrow", arrowTool);

const gridController = new GridController({
  canvasController,
  eventBus
});



// const alignController = new AlignController({
//   objectStore,
//   commandManager,
//   getSelectedObject
// });

const alignController = new AlignController({
  objectStore,
  commandManager,
  getSelectedObjects
});

const distributeController = new DistributeController({
  objectStore,
  commandManager,
  getSelectedObjects
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

  eventBus.on("groups:changed", () => {
  updateLayerPanel();
});

eventBus.on("tool:changed", ({ tool }) => {
  document.getElementById("lineToolBtn")?.classList.toggle("is-active", tool === "line");
  document.getElementById("arrowToolBtn")?.classList.toggle("is-active", tool === "arrow");
});

  eventBus.on("object:updated", () => {
    updatePropertiesPanel();
    updateStatusBar();
  });

  eventBus.on("tool:changed", ({ tool }) => {
  document
    .getElementById("arrowToolBtn")
    ?.classList.toggle("is-active", tool === "arrow");
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
  downloadButton.innerHTML = '<svg class="icon"><use href="assets/icons/ui-icons.svg#icon-download"></use></svg>';
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

  bindClick("arrowToolBtn", () => {
  arrowTool.toggle();
});

  bindClick("groupBtn", groupSelected);
bindClick("ungroupBtn", ungroupSelected);

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

  bindClick("distributeHorizontalBtn", () => {
  distributeController.distributeHorizontal();
});

bindClick("distributeVerticalBtn", () => {
  distributeController.distributeVertical();
});

bindClick("lineToolBtn", () => {
  lineTool.toggle();
});

bindClick("arrowToolBtn", () => {
  arrowTool.toggle();
});

bindClick("lineToolBtn", () => {
  toolManager.activateTool("line");
});

bindClick("arrowToolBtn", () => {
  toolManager.activateTool("arrow");
});
bindClick("toggleSmartGuidesBtn", toggleSmartGuides);
bindClick("mobileSmartGuidesBtn", toggleSmartGuides);
bindClick("toggleAnchorSnapBtn", toggleAnchorSnap);
bindClick("mobileAnchorSnapBtn", toggleAnchorSnap);
bindClick("detachStartAnchorBtn", detachStartAnchor);
bindClick("detachEndAnchorBtn", detachEndAnchor);

  document.addEventListener("keydown", handleShortcuts);
}

function detachStartAnchor() {
  const object = getSelectedObject();

  if (!object || !(object.type === "line" || object.type === "arrow")) return;
  if (!object.startAnchorRef) return;

  const startPoint = renderer.getConnectedStartPoint(object);

  commandManager.execute(
    new UpdateObjectCommand(objectStore, object.id, {
      x: startPoint.x,
      y: startPoint.y,
      startAnchorRef: null
    })
  );
}

function detachEndAnchor() {
  const object = getSelectedObject();

  if (!object || !(object.type === "line" || object.type === "arrow")) return;
  if (!object.endAnchorRef) return;

  const endPoint = renderer.getConnectedEndPoint(object);

  commandManager.execute(
    new UpdateObjectCommand(objectStore, object.id, {
      x2: endPoint.x,
      y2: endPoint.y,
      endAnchorRef: null
    })
  );
}

function toggleAnchorSnap() {
  const enabled = anchorSnapController.toggle();

  setActive("toggleAnchorSnapBtn", enabled);
  setActive("mobileAnchorSnapBtn", enabled);

  updateStatusBar();
}

function toggleSmartGuides() {
  const enabled = smartGuideController.toggle();

  setActive("toggleSmartGuidesBtn", enabled);
  setActive("mobileSmartGuidesBtn", enabled);

  updateStatusBar();
}

function bindClick(id, callback) {
  document.getElementById(id)?.addEventListener("click", callback);
}

function bindPropertyInputs() {
const inputs = [
  "nameInput",
  "posXInput",
  "posYInput",
  "posX2Input",
  "posY2Input",
  "scaleInput",
  "rotationInput",
  "strokeWidthInput",
  "strokeColorInput",
  "textInput",
  "arrowEndInput",
  "lineStyleSelect",
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
  if (objects.length === 0) return;

  commandManager.execute(
    new DeleteObjectsCommand(objectStore, objects)
  );

  cleanupEmptyGroups();

  clearSelection();
}

function cleanupEmptyGroups() {
  groupStore.getAll().forEach(group => {
    const hasObjects = objectStore
      .getAll()
      .some(object => object.groupId === group.id);

    if (!hasObjects) {
      groupStore.removeGroup(group.id);
    }
  });
}

function duplicateSelected() {
  const objects = getSelectedObjects();
  if (objects.length === 0) return;

  const groupMap = new Map();

  const clones = objects.map(object => {
    const clone = object.clone();

    if (object.groupId) {
      if (!groupMap.has(object.groupId)) {
        groupMap.set(object.groupId, crypto.randomUUID());
      }

      clone.groupId = groupMap.get(object.groupId);
    }

    return clone;
  });

  groupMap.forEach((newGroupId, oldGroupId) => {
    const oldGroup = groupStore.get(oldGroupId);

    groupStore.createGroup({
      id: newGroupId,
      name: oldGroup ? `${oldGroup.name} Kopie` : "Gruppe Kopie",
      collapsed: false
    });
  });

  commandManager.execute(
    new AddObjectsCommand(objectStore, clones)
  );

  selectionController.clear();

  clones.forEach(clone => {
    selectionController.toggle(clone.id);
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

  if (object.type === "line" || object.type === "arrow") {
  patch.x2 = safeNumber(
    getInputValue("posX2Input", object.x2),
    object.x2
  );

  patch.y2 = safeNumber(
    getInputValue("posY2Input", object.y2),
    object.y2
  );

  patch.strokeWidth = Math.max(
    1,
    safeNumber(
      getInputValue("strokeWidthInput", object.strokeWidth),
      object.strokeWidth
    )
  );

  const arrowEndInput = document.getElementById("arrowEndInput");

patch.arrowEnd = arrowEndInput?.checked || false;


  patch.strokeColor =
    getInputValue("strokeColorInput", object.strokeColor) ||
    object.strokeColor;

    const lineStyle = getInputValue("lineStyleSelect", object.lineStyle || "solid");

patch.lineStyle = lineStyle;

if (lineStyle === "solid") {
  patch.strokeDasharray = "";
}

if (lineStyle === "dashed") {
  patch.strokeDasharray = "14 10";
}

if (lineStyle === "dotted") {
  patch.strokeDasharray = "2 10";
}
}

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

  const posX2Input = document.getElementById("posX2Input");
  const posY2Input = document.getElementById("posY2Input");
  const strokeWidthInput = document.getElementById("strokeWidthInput");
  const strokeColorInput = document.getElementById("strokeColorInput");
  const lineStyleSelect = document.getElementById("lineStyleSelect");
  const arrowEndInput = document.getElementById("arrowEndInput");
  const lineProperties = document.querySelectorAll(".line-property");

  const detachStartAnchorBtn = document.getElementById("detachStartAnchorBtn");
  const detachEndAnchorBtn = document.getElementById("detachEndAnchorBtn");

  const allInputs = [
    nameInput,
    posXInput,
    posYInput,
    posX2Input,
    posY2Input,
    scaleInput,
    rotationInput,
    strokeWidthInput,
    strokeColorInput,
    lineStyleSelect,
    textInput,
    arrowEndInput
  ];

  if (!object) {
    allInputs.forEach(input => {
      if (!input) return;

      if (input.type === "checkbox") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });

    lineProperties.forEach(element => {
      element.style.display = "none";
    });

    if (textProperty) textProperty.style.display = "none";
    if (detachStartAnchorBtn) detachStartAnchorBtn.disabled = true;
    if (detachEndAnchorBtn) detachEndAnchorBtn.disabled = true;

    return;
  }

  const isMultiSelection = selectedObjects.length > 1;
  const isLineObject = object.type === "line" || object.type === "arrow";
  const isLabelObject = object.type === "label";

  if (nameInput) {
    nameInput.value = isMultiSelection
      ? `${selectedObjects.length} Objekte`
      : object.name;
  }

  if (posXInput) posXInput.value = Math.round(object.x);
  if (posYInput) posYInput.value = Math.round(object.y);
  if (scaleInput) scaleInput.value = object.scale;
  if (rotationInput) rotationInput.value = object.rotation;

  if (isLineObject) {
    lineProperties.forEach(element => {
      element.style.display = "flex";
    });

    if (posX2Input) posX2Input.value = Math.round(object.x2);
    if (posY2Input) posY2Input.value = Math.round(object.y2);
    if (strokeWidthInput) strokeWidthInput.value = object.strokeWidth ?? 4;
    if (strokeColorInput) strokeColorInput.value = object.strokeColor || "#18331f";
    if (lineStyleSelect) lineStyleSelect.value = object.lineStyle || "solid";

    if (arrowEndInput) {
      arrowEndInput.checked = object.type === "arrow" || object.arrowEnd;
    }

    if (detachStartAnchorBtn) {
      detachStartAnchorBtn.disabled = !object.startAnchorRef;
    }

    if (detachEndAnchorBtn) {
      detachEndAnchorBtn.disabled = !object.endAnchorRef;
    }
  } else {
    lineProperties.forEach(element => {
      element.style.display = "none";
    });

    if (posX2Input) posX2Input.value = "";
    if (posY2Input) posY2Input.value = "";
    if (strokeWidthInput) strokeWidthInput.value = "";
    if (strokeColorInput) strokeColorInput.value = "#18331f";
    if (lineStyleSelect) lineStyleSelect.value = "solid";

    if (arrowEndInput) {
      arrowEndInput.checked = false;
    }

    if (detachStartAnchorBtn) detachStartAnchorBtn.disabled = true;
    if (detachEndAnchorBtn) detachEndAnchorBtn.disabled = true;
  }

  if (isLabelObject && !isMultiSelection) {
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

  const objects = objectStore.getAll().slice().reverse();

  const grouped = new Map();
  const ungrouped = [];

  objects.forEach(object => {
    if (object.groupId) {
      if (!grouped.has(object.groupId)) {
        grouped.set(object.groupId, []);
      }

      grouped.get(object.groupId).push(object);
    } else {
      ungrouped.push(object);
    }
  });

  grouped.forEach((groupObjects, groupId) => {
    list.appendChild(createGroupLayerRow(groupId, groupObjects));
  });

  ungrouped.forEach(object => {
    list.appendChild(createObjectLayerRow(object));
  });
}

function createGroupLayerRow(groupId, objects) {
  const wrapper = document.createElement("div");
  wrapper.className = "layer-group";

  const header = document.createElement("div");
  header.className = "layer-group-header";

  const name = document.createElement("button");
  name.className = "layer-name";
  const group = groupStore.get(groupId);
  name.textContent = `▾ ${group?.name || "Gruppe"}`;
  name.addEventListener("click", () => {
  groupStore.updateGroup(groupId, {
    collapsed: !group?.collapsed
  });
  name.addEventListener("dblclick", event => {
  event.stopPropagation();

  const group = groupStore.get(groupId);
  if (!group) return;

  const newName = prompt("Gruppennamen ändern:", group.name);

  if (newName === null) return;

  groupStore.updateGroup(groupId, {
    name: newName.trim() || group.name
  });

  updateLayerPanel();
});

  updateLayerPanel();
});

  name.addEventListener("click", () => {
    objects.forEach(object => {
      selectionController.toggle(object.id);
    });
  });

  const visible = document.createElement("button");
  visible.className = "layer-action";
  visible.textContent = "👁";

visible.addEventListener("click", () => {
  const allVisible = objects.every(object => object.visible);
  const nextVisible = !allVisible;

  const updates = objects.map(object => ({
    objectId: object.id,
    patch: {
      visible: nextVisible
    }
  }));

  commandManager.execute(
    new UpdateObjectsCommand(objectStore, updates)
  );
});

  const locked = document.createElement("button");
  locked.className = "layer-action";
  locked.textContent = "🔒";

locked.addEventListener("click", () => {
  const allLocked = objects.every(object => object.locked);
  const nextLocked = !allLocked;

  const updates = objects.map(object => ({
    objectId: object.id,
    patch: {
      locked: nextLocked
    }
  }));

  commandManager.execute(
    new UpdateObjectsCommand(objectStore, updates)
  );
});

  header.appendChild(name);
  header.appendChild(visible);
  header.appendChild(locked);

  const children = document.createElement("div");
  children.className = "layer-group-children";

  if (group?.collapsed) {
  children.style.display = "none";
  name.textContent = `▸ ${group.name}`;
}

  objects.forEach(object => {
    children.appendChild(createObjectLayerRow(object));
  });

  wrapper.appendChild(header);
  wrapper.appendChild(children);

  return wrapper;
}

function createObjectLayerRow(object) {
  const row = document.createElement("div");
  row.className = "layer-row";

  if (selectionController.selectedIds.has(object.id)) {
    row.classList.add("is-selected");
  }

  const name = document.createElement("button");
  name.className = "layer-name";
  name.textContent = object.name;
  name.title = object.name;

  name.addEventListener("click", () => {
    selectionController.selectOnly(object.id);
  });

  const visible = document.createElement("button");
  visible.className = "layer-action";
  visible.textContent = object.visible ? "👁" : "—";

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

  return row;
}

function updateStatusBar() {
  const selectedObjects = getSelectedObjects();

  const selectedStatus = document.getElementById("selectedStatus");
  const gridStatus = document.getElementById("gridStatus");
  const snapStatus = document.getElementById("snapStatus");
  const smartStatus = document.getElementById("smartGuideStatus");
  const anchorSnapStatus = document.getElementById("anchorSnapStatus");

if (anchorSnapStatus) {
  anchorSnapStatus.textContent = anchorSnapController.isEnabled()
    ? "Anchor: an"
    : "Anchor: aus";
}

if (smartStatus) {
  smartStatus.textContent = smartGuideController.isEnabled()
    ? "Guides: an"
    : "Guides: aus";
}

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
    groups: groupStore.getAll(),
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
    const groups = data.groups || [];

    const recreatedObjects = [];

    for (const objectData of objects) {
      const object = await objectFactory.recreateFromProjectData(objectData);
      recreatedObjects.push(object);
    }

    groupStore.replaceAll(groups);
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

  if (event.key === "Escape") {
  event.preventDefault();
  toolManager.activateSelectTool();
  return;
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

function groupSelected() {
  const objects = getSelectedObjects()
    .filter(object => !object.locked);

  if (objects.length < 2) return;

  const name = prompt("Name der Gruppe:", "Neue Gruppe") || "Neue Gruppe";

  commandManager.execute(
    new GroupObjectsCommand(objectStore, groupStore, objects, name)
  );
}

function ungroupSelected() {
  const objects = getSelectedObjects()
    .filter(object => object.groupId && !object.locked);

  if (objects.length === 0) return;

  commandManager.execute(
    new UngroupObjectsCommand(objectStore, objects)
  );
}

function setActive(id, isActive) {
  const button = document.getElementById(id);

  if (!button) return;

  button.classList.toggle("is-active", isActive);
}