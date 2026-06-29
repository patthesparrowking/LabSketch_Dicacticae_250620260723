export class AddObjectsCommand {
  constructor(objectStore, objects) {
    this.objectStore = objectStore;
    this.objects = objects;
  }

  execute() {
    this.objects.forEach(object => {
      this.objectStore.add(object);
    });
  }

  undo() {
    this.objects.forEach(object => {
      this.objectStore.remove(object.id);
    });
  }
}