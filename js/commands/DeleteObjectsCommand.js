export class DeleteObjectsCommand {
  constructor(objectStore, objects) {
    this.objectStore = objectStore;
    this.objects = objects;
  }

  execute() {
    this.objects.forEach(object => {
      this.objectStore.remove(object.id);
    });
  }

  undo() {
    this.objects.forEach(object => {
      this.objectStore.add(object);
    });
  }
}