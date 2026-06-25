import { svgLibrary } from "./library.js";
import { createObject } from "./objects.js";
import { canvas, addToCanvas, makeDraggable } from "./canvas.js";
import { selectElement, getSelectedElement, clearSelection } from "./selection.js";
import { updateTransform, scaleSelected, rotateSelected } from "./transform.js";
import { duplicateSelected, moveToFront, moveToBack } from "./layers.js";
import { exportSvg } from "./export.js";

function renderToolButtons() {
  const toolList = document.getElementById("toolList");

  svgLibrary.forEach(item => {
const toolRow = document.createElement("div");
toolRow.className = "tool-row";

const button = document.createElement("button");
button.className = "tool";
button.dataset.object = item.id;
button.textContent = item.label;

const downloadButton = document.createElement("button");
downloadButton.className = "tool-download";
downloadButton.textContent = "↓";
downloadButton.title = `${item.label} als SVG herunterladen`;

downloadButton.addEventListener("click", event => {
  event.stopPropagation();

  const link = document.createElement("a");
  link.href = item.path;
  link.download = `${item.id}.svg`;
  link.click();
});

    button.addEventListener("click", async () => {
      const element = await createObject(item.id);

      if (!element) return;

      element.classList.add("draggable");
      element.dataset.x = 350;
      element.dataset.y = 200;
      element.dataset.scale = 1;
      element.dataset.rotation = 0;

      updateTransform(element);
      addToCanvas(element);
      makeDraggable(element);
      selectElement(element);
    });

    toolRow.appendChild(button);
    toolRow.appendChild(downloadButton);
    toolList.appendChild(toolRow);
  });
}

renderToolButtons();


// const tools = document.querySelectorAll(".tool");

const smallerBtn = document.getElementById("smallerBtn");
const biggerBtn = document.getElementById("biggerBtn");
const rotateLeftBtn = document.getElementById("rotateLeftBtn");
const rotateRightBtn = document.getElementById("rotateRightBtn");
const duplicateBtn = document.getElementById("duplicateBtn");
const frontBtn = document.getElementById("frontBtn");
const backBtn = document.getElementById("backBtn");
const exportSvgBtn = document.getElementById("exportSvgBtn");

// tools.forEach(button => {
//   button.addEventListener("click", async () => {
//     const type = button.dataset.object;
//     const element = await createObject(type);

//     if (!element) return;

//     element.classList.add("draggable");

//     element.dataset.x = 350;
//     element.dataset.y = 200;
//     element.dataset.scale = 1;
//     element.dataset.rotation = 0;

//     updateTransform(element);
//     addToCanvas(element);
//     makeDraggable(element);
//     selectElement(element);
//   });
// });

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