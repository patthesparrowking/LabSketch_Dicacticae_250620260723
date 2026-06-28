import { MoveObjectsCommand } from "../commands/MoveObjectsCommand.js";

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
    this.dragStartPoint = null;
    this.initialPositions = [];

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
        return;
      }

      const alreadySelected = this.selectionController.selectedIds.has(object.id);

      if (!alreadySelected) {
        this.selectionController.selectOnly(object.id);
      }

      this.startDrag(event, object, element);
    });
  }

  startDrag(event, object, element) {
    event.stopPropagation();

    this.draggedObject = object;
    this.dragStartPoint = this.getMousePosition(event);

    const selectedObjects = this.selectionController
      .getSelectedObjects()
      .filter(selected => !selected.locked);

    this.initialPositions = selectedObjects.map(selected => ({
      objectId: selected.id,
      x: selected.x,
      y: selected.y
    }));

    element.setPointerCapture(event.pointerId);

    element.addEventListener("pointermove", this.drag);
    element.addEventListener("pointerup", this.endDrag);
  }

  drag = event => {
    if (!this.draggedObject || !this.dragStartPoint) return;

    const point = this.getMousePosition(event);

    const dx = point.x - this.dragStartPoint.x;
    const dy = point.y - this.dragStartPoint.y;

    this.initialPositions.forEach(start => {
      const x = this.snapValue(start.x + dx);
      const y = this.snapValue(start.y + dy);

      this.objectStore.update(start.objectId, { x, y });
    });
  };

  endDrag = event => {
    if (!this.draggedObject?.element) return;

    const element = this.draggedObject.element;

    element.releasePointerCapture(event.pointerId);
    element.removeEventListener("pointermove", this.drag);
    element.removeEventListener("pointerup", this.endDrag);

    const moves = this.initialPositions
      .map(start => {
        const object = this.objectStore.get(start.objectId);
        if (!object) return null;

        return {
          objectId: object.id,
          from: {
            x: start.x,
            y: start.y
          },
          to: {
            x: object.x,
            y: object.y
          }
        };
      })
      .filter(move =>
        move &&
        (move.from.x !== move.to.x || move.from.y !== move.to.y)
      );

    if (moves.length > 0) {
      this.commandManager.execute(
        new MoveObjectsCommand(this.objectStore, moves)
      );
    }

    this.draggedObject = null;
    this.dragStartPoint = null;
    this.initialPositions = [];
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
}