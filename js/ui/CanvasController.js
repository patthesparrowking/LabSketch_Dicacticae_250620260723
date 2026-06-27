import { MoveObjectCommand } from "../commands/MoveObjectCommand.js";

export class CanvasController {
  constructor({
    canvas,
    objectStore,
    commandManager,
    eventBus,
    selectionController
  }) {
    this.canvas = canvas;
    this.objectStore = objectStore;
    this.commandManager = commandManager;
    this.eventBus = eventBus;
    this.selectionController = selectionController;

    this.draggedObject = null;
    this.startX = 0;
    this.startY = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    this.snapEnabled = true;
    this.gridSize = 25;

    this.init();
  }

  init() {
    this.canvas.addEventListener("pointerdown", event => {
      const element = event.target.closest("[data-object-id]");

      if (!element) {
        this.selectionController.clear();
        return;
      }

      const object = this.objectStore.get(element.dataset.objectId);

      if (!object || object.locked) return;

      if (event.shiftKey) {
        this.selectionController.toggle(object.id);
      } else {
        this.selectionController.selectOnly(object.id);
      }

      this.startDrag(event, object, element);
    });
  }

  startDrag(event, object, element) {
    event.stopPropagation();

    this.draggedObject = object;

    const point = this.getMousePosition(event);

    this.startX = object.x;
    this.startY = object.y;

    this.offsetX = point.x - object.x;
    this.offsetY = point.y - object.y;

    element.setPointerCapture(event.pointerId);

    element.addEventListener("pointermove", this.drag);
    element.addEventListener("pointerup", this.endDrag);
  }

  drag = event => {
    if (!this.draggedObject) return;

    const point = this.getMousePosition(event);

    const x = this.snapValue(point.x - this.offsetX);
    const y = this.snapValue(point.y - this.offsetY);

    this.objectStore.update(this.draggedObject.id, { x, y });
  };

  endDrag = event => {
    if (!this.draggedObject?.element) return;

    const object = this.draggedObject;
    const element = object.element;

    element.releasePointerCapture(event.pointerId);
    element.removeEventListener("pointermove", this.drag);
    element.removeEventListener("pointerup", this.endDrag);

    const moved =
      object.x !== this.startX ||
      object.y !== this.startY;

    if (moved) {
      this.commandManager.execute(
        new MoveObjectCommand(
          this.objectStore,
          object.id,
          {
            x: this.startX,
            y: this.startY
          },
          {
            x: object.x,
            y: object.y
          }
        )
      );
    }

    this.draggedObject = null;
  };

  getMousePosition(event) {
    const point = this.canvas.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    return point.matrixTransform(
      this.canvas.getScreenCTM().inverse()
    );
  }

  snapValue(value) {
    if (!this.snapEnabled) return value;

    return Math.round(value / this.gridSize) * this.gridSize;
  }

  setSnapEnabled(value) {
    this.snapEnabled = value;
  }

  toggleSnap() {
    this.snapEnabled = !this.snapEnabled;

    this.eventBus.emit("snap:changed", {
      enabled: this.snapEnabled
    });
  }
}