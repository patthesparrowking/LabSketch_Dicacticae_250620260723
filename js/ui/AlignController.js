import { AlignObjectCommand } from "../commands/AlignObjectCommand.js";

export class AlignController {
  constructor({ objectStore, commandManager, getSelectedObject }) {
    this.objectStore = objectStore;
    this.commandManager = commandManager;
    this.getSelectedObject = getSelectedObject;

    this.canvasWidth = 1000;
    this.canvasHeight = 700;
  }

  alignLeft() {
    this.align({ x: 0 });
  }

  alignCenterX() {
    this.align({ x: this.canvasWidth / 2 });
  }

  alignRight() {
    this.align({ x: this.canvasWidth });
  }

  alignTop() {
    this.align({ y: 0 });
  }

  alignCenterY() {
    this.align({ y: this.canvasHeight / 2 });
  }

  alignBottom() {
    this.align({ y: this.canvasHeight });
  }

  align(patch) {
    const object = this.getSelectedObject();
    if (!object || object.locked) return;

    this.commandManager.execute(
      new AlignObjectCommand(
        this.objectStore,
        object.id,
        { x: object.x, y: object.y },
        {
          x: patch.x ?? object.x,
          y: patch.y ?? object.y
        }
      )
    );
  }
}