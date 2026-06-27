export class UpdateObjectCommand {
  constructor(objectStore, objectId, patch) {
    this.objectStore = objectStore;
    this.objectId = objectId;
    this.patch = patch;
    this.previousState = null;
  }

  execute() {
    const object = this.objectStore.get(this.objectId);
    if (!object) return;

    if (!this.previousState) {
      this.previousState = {
        name: object.name,
        text: object.text,
        visible: object.visible,
        locked: object.locked
      };
    }

    this.objectStore.update(this.objectId, this.patch);
  }

  undo() {
    if (!this.previousState) return;

    this.objectStore.update(this.objectId, this.previousState);
  }
}