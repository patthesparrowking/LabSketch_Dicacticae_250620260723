export class ScaleObjectsCommand {
  constructor(objectStore, changes) {
    this.objectStore = objectStore;
    this.changes = changes;
  }

  execute() {
    this.changes.forEach(change => {
      this.objectStore.update(change.objectId, change.to);
    });
  }

  undo() {
    this.changes.forEach(change => {
      this.objectStore.update(change.objectId, change.from);
    });
  }
}