export class DeleteObjectCommand {
  constructor(objectStore, object) {
    this.objectStore = objectStore;
    this.object = object;
  }

  execute() {
    this.objectStore.remove(this.object.id);
  }

  undo() {
    this.objectStore.add(this.object);
  }
}