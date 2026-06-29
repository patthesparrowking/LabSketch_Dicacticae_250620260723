import { DistributeObjectsCommand } from "../commands/DistributeObjectsCommand.js";

export class DistributeController {
  constructor({ objectStore, commandManager, getSelectedObjects }) {
    this.objectStore = objectStore;
    this.commandManager = commandManager;
    this.getSelectedObjects = getSelectedObjects;
  }

  distributeHorizontal() {
    const objects = this.getSelectedObjects()
      .filter(object => !object.locked)
      .sort((a, b) => a.x - b.x);

    if (objects.length < 3) return;

    const firstX = objects[0].x;
    const lastX = objects[objects.length - 1].x;
    const spacing = (lastX - firstX) / (objects.length - 1);

    const moves = objects.map((object, index) => ({
      objectId: object.id,
      from: { x: object.x, y: object.y },
      to: { x: firstX + spacing * index, y: object.y }
    }));

    this.commandManager.execute(
      new DistributeObjectsCommand(this.objectStore, moves)
    );
  }

  distributeVertical() {
    const objects = this.getSelectedObjects()
      .filter(object => !object.locked)
      .sort((a, b) => a.y - b.y);

    if (objects.length < 3) return;

    const firstY = objects[0].y;
    const lastY = objects[objects.length - 1].y;
    const spacing = (lastY - firstY) / (objects.length - 1);

    const moves = objects.map((object, index) => ({
      objectId: object.id,
      from: { x: object.x, y: object.y },
      to: { x: object.x, y: firstY + spacing * index }
    }));

    this.commandManager.execute(
      new DistributeObjectsCommand(this.objectStore, moves)
    );
  }
}