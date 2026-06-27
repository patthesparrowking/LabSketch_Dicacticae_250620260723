export class MoveObjectCommand {
  constructor(objectStore, objectId, fromPosition, toPosition) {
    this.objectStore = objectStore;
    this.objectId = objectId;
    this.fromPosition = fromPosition;
    this.toPosition = toPosition;
  }

  execute() {
    const object = this.objectStore.get(this.objectId);
    if (!object || object.locked) return;

    this.objectStore.update(this.objectId, this.toPosition);
  }

  undo() {
    const object = this.objectStore.get(this.objectId);
    if (!object || object.locked) return;

    this.objectStore.update(this.objectId, this.fromPosition);
  }
}