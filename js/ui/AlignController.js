import { AlignObjectsCommand } from "../commands/AlignObjectsCommand.js";

export class AlignController {
  constructor({ objectStore, commandManager, getSelectedObjects }) {
    this.objectStore = objectStore;
    this.commandManager = commandManager;
    this.getSelectedObjects = getSelectedObjects;

    this.canvasWidth = 1000;
    this.canvasHeight = 700;
  }

  alignLeft() {
    this.alignGroup({ x: 0 });
  }

  alignCenterX() {
    const bounds = this.getSelectionBounds();
    if (!bounds) return;

    const targetCenter = this.canvasWidth / 2;
    const currentCenter = bounds.x + bounds.width / 2;
    const dx = targetCenter - currentCenter;

    this.moveSelection(dx, 0);
  }

  alignRight() {
    const bounds = this.getSelectionBounds();
    if (!bounds) return;

    const dx = this.canvasWidth - (bounds.x + bounds.width);
    this.moveSelection(dx, 0);
  }

  alignTop() {
    this.alignGroup({ y: 0 });
  }

  alignCenterY() {
    const bounds = this.getSelectionBounds();
    if (!bounds) return;

    const targetCenter = this.canvasHeight / 2;
    const currentCenter = bounds.y + bounds.height / 2;
    const dy = targetCenter - currentCenter;

    this.moveSelection(0, dy);
  }

  alignBottom() {
    const bounds = this.getSelectionBounds();
    if (!bounds) return;

    const dy = this.canvasHeight - (bounds.y + bounds.height);
    this.moveSelection(0, dy);
  }

  alignGroup(target) {
    const bounds = this.getSelectionBounds();
    if (!bounds) return;

    const dx = target.x !== undefined ? target.x - bounds.x : 0;
    const dy = target.y !== undefined ? target.y - bounds.y : 0;

    this.moveSelection(dx, dy);
  }

  moveSelection(dx, dy) {
    const objects = this.getSelectedObjects()
      .filter(object => !object.locked);

    if (objects.length === 0) return;

    const moves = objects.map(object => ({
      objectId: object.id,
      from: {
        x: object.x,
        y: object.y
      },
      to: {
        x: object.x + dx,
        y: object.y + dy
      }
    }));

    this.commandManager.execute(
      new AlignObjectsCommand(this.objectStore, moves)
    );
  }

  getSelectionBounds() {
    const objects = this.getSelectedObjects()
      .filter(object => !object.locked);

    if (objects.length === 0) return null;

    const xs = objects.map(object => object.x);
    const ys = objects.map(object => object.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}