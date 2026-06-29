import { LabObject } from "../models/LabObject.js";
import { AddObjectCommand } from "../commands/AddObjectCommand.js";

export class LineTool {
  constructor({ canvas, objectStore, commandManager, eventBus }) {
    this.canvas = canvas;
    this.objectStore = objectStore;
    this.commandManager = commandManager;
    this.eventBus = eventBus;

    this.active = false;
    this.startPoint = null;
    this.previewLine = null;

    this.init();
  }

  init() {
    this.canvas.addEventListener("pointerdown", event => {
      if (!this.active) return;

      event.preventDefault();
      event.stopPropagation();

      const point = this.getMousePosition(event);

      if (!this.startPoint) {
        this.startPoint = point;
        this.createPreview(point);
        return;
      }

      const line = new LabObject({
        type: "line",
        name: "Linie",
        x: this.startPoint.x,
        y: this.startPoint.y,
        x2: point.x,
        y2: point.y,
        strokeWidth: 4,
        strokeColor: "#18331f",
        arrowEnd: false
      });

      this.commandManager.execute(
        new AddObjectCommand(this.objectStore, line)
      );

      this.finish();
    });

    this.canvas.addEventListener("pointermove", event => {
      if (!this.active || !this.startPoint || !this.previewLine) return;

      const point = this.getMousePosition(event);
      this.updatePreview(point);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && this.active) {
        this.finish();
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
  }

  createPreview(point) {
    this.previewLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    this.previewLine.classList.add("line-preview");

    this.previewLine.setAttribute("x1", point.x);
    this.previewLine.setAttribute("y1", point.y);
    this.previewLine.setAttribute("x2", point.x);
    this.previewLine.setAttribute("y2", point.y);

    this.canvas.appendChild(this.previewLine);
  }

  updatePreview(point) {
    this.previewLine.setAttribute("x1", this.startPoint.x);
    this.previewLine.setAttribute("y1", this.startPoint.y);
    this.previewLine.setAttribute("x2", point.x);
    this.previewLine.setAttribute("y2", point.y);
  }

  removePreview() {
    if (this.previewLine) {
      this.previewLine.remove();
      this.previewLine = null;
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