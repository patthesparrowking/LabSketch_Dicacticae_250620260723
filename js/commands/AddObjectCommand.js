export class AddObjectCommand {
  constructor(objectStore, object) {
    this.objectStore = objectStore;
    this.object = object;
  }

  execute() {
    this.objectStore.add(this.object);
  }

  undo() {
    this.objectStore.remove(this.object.id);
  }
}