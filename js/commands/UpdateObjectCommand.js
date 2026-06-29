export class UpdateObjectCommand {
  constructor(objectStore, objectId, patch, previousState = null) {
    this.objectStore = objectStore;
    this.objectId = objectId;
    this.patch = patch;
    this.previousState = previousState;
  }

  execute() {
    const object = this.objectStore.get(this.objectId);
    if (!object) return;

    if (!this.previousState) {
      this.previousState = {
        name: object.name,
        x: object.x,
        y: object.y,
        x2: object.x2,
        y2: object.y2,
        scale: object.scale,
        rotation: object.rotation,
        visible: object.visible,
        locked: object.locked,
        groupId: object.groupId,
        text: object.text,
        strokeWidth: object.strokeWidth,
        strokeColor: object.strokeColor,
        arrowEnd: object.arrowEnd,
        path: object.path,
        station: object.station,
        tags: object.tags,
        metadata: object.metadata
      };
    }

    this.objectStore.update(this.objectId, this.patch);
  }

  undo() {
    if (!this.previousState) return;

    this.objectStore.update(this.objectId, this.previousState);
  }
}