import { LabObject } from "../models/LabObject.js";
import { AddObjectCommand } from "../commands/AddObjectCommand.js";

export class ArrowTool {
constructor({ canvas, objectStore, commandManager, eventBus, anchorSnapController }) {
  this.canvas = canvas;
  this.objectStore = objectStore;
  this.commandManager = commandManager;
  this.eventBus = eventBus;
  this.anchorSnapController = anchorSnapController;

    this.active = false;
    this.startPoint = null;
    this.previewGroup = null;

    this.init();
  }

  init() {
    this.canvas.addEventListener("pointerdown", event => {
      if (!this.active) return;

      event.preventDefault();
      event.stopPropagation();

      const point = this.getMousePosition(event);

      if (!this.startPoint) {
let startPoint = point;
let startAnchorRef = null;

if (this.anchorSnapController) {
  const virtualArrowStart = {
    id: "temp-arrow-start",
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    visible: true,
    anchorPoints: [{ id: "start", x: 0, y: 0 }]
  };

  const snapped = this.anchorSnapController.snapObject(
    virtualArrowStart,
    point.x,
    point.y
  );

  if (snapped.snapped) {
    startPoint = snapped.anchorPoint;
    startAnchorRef = snapped.anchorRef;
  }
}

this.startPoint = startPoint;
this.startAnchorRef = startAnchorRef;
this.createPreview(startPoint);
return;
      }

let endPoint = point;
let endAnchorRef = null;

if (this.anchorSnapController) {
  const virtualArrowEnd = {
    id: "temp-arrow-end",
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    visible: true,
    anchorPoints: [
      {
        id: "end",
        x: 0,
        y: 0
      }
    ]
  };

  const snapped = this.anchorSnapController.snapObject(
    virtualArrowEnd,
    point.x,
    point.y
  );

  if (snapped.snapped) {
    endPoint = snapped.anchorPoint;
    endAnchorRef = snapped.anchorRef;
  }
}

const arrow = new LabObject({
  type: "arrow",
  name: "Pfeil",
  x: this.startPoint.x,
  y: this.startPoint.y,
  x2: endPoint.x,
  y2: endPoint.y,
  strokeWidth: 4,
  strokeColor: "#18331f",
  arrowEnd: true,
  startAnchorRef: this.startAnchorRef,
  endAnchorRef
});

      this.commandManager.execute(
        new AddObjectCommand(this.objectStore, arrow)
      );

      this.finish();
    });

    this.canvas.addEventListener("pointermove", event => {
      if (!this.active || !this.startPoint || !this.previewGroup) return;

      const point = this.getMousePosition(event);
      this.updatePreview(point);
      this.anchorSnapController?.clearHighlights();
this.anchorSnapController?.clearPreview();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && this.active) {
        this.finish();
        this.anchorSnapController?.clearHighlights();
this.anchorSnapController?.clearPreview();
      }
    });
  }

  setActive(value) {
    this.active = value;
    this.startPoint = null;
    this.removePreview();
  }

  toggle() {
    this.setActive(!this.active);
  }

  finish() {
    this.startPoint = null;
    this.removePreview();
    this.setActive(false);
    this.startAnchorRef = null;
  }

  createPreview(point) {
    this.previewGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    this.previewGroup.classList.add("arrow-preview");

    this.previewGroup.innerHTML = `
      <line class="arrow-preview-line"
            x1="${point.x}"
            y1="${point.y}"
            x2="${point.x}"
            y2="${point.y}" />
      <path class="arrow-preview-head" />
    `;

    this.canvas.appendChild(this.previewGroup);
  }

  updatePreview(point) {
    const line = this.previewGroup.querySelector(".arrow-preview-line");
    const head = this.previewGroup.querySelector(".arrow-preview-head");

    line.setAttribute("x1", this.startPoint.x);
    line.setAttribute("y1", this.startPoint.y);
    line.setAttribute("x2", point.x);
    line.setAttribute("y2", point.y);

    head.setAttribute(
      "d",
      createArrowHeadPath(
        this.startPoint.x,
        this.startPoint.y,
        point.x,
        point.y
      )
    );
  }

  removePreview() {
    if (this.previewGroup) {
      this.previewGroup.remove();
      this.previewGroup = null;
    }
  }

  getMousePosition(event) {
    const point = this.canvas.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    return point.matrixTransform(
      this.canvas.getScreenCTM().inverse()
    );
  }
}

function createArrowHeadPath(x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 14;

  const p1x = x2;
  const p1y = y2;

  const p2x = x2 - size * Math.cos(angle - Math.PI / 6);
  const p2y = y2 - size * Math.sin(angle - Math.PI / 6);

  const p3x = x2 - size * Math.cos(angle + Math.PI / 6);
  const p3y = y2 - size * Math.sin(angle + Math.PI / 6);

  return `M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} Z`;
}