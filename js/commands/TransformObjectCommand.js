export class TransformObjectCommand {
  constructor(objectStore, objectId, nextTransform) {
    this.objectStore = objectStore;
    this.objectId = objectId;
    this.nextTransform = nextTransform;
    this.previousTransform = null;
  }

  execute() {
    const object = this.objectStore.get(this.objectId);
    if (!object || object.locked) return;

    if (!this.previousTransform) {
      this.previousTransform = {
        x: object.x,
        y: object.y,
        scale: object.scale,
        rotation: object.rotation
      };
    }

    this.objectStore.update(this.objectId, this.nextTransform);
  }

  undo() {
    if (!this.previousTransform) return;

    this.objectStore.update(this.objectId, this.previousTransform);
  }
}