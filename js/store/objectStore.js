export class ObjectStore {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.objects = new Map();
  }

  add(object) {
    this.objects.set(object.id, object);

    this.eventBus.emit("object:added", { object });
    this.eventBus.emit("objects:changed", {
      objects: this.getAll()
    });

    return object;
  }

  update(objectId, patch = {}) {
    const object = this.get(objectId);
    if (!object) return null;

    Object.assign(object, patch);

    this.eventBus.emit("object:updated", { object });
    this.eventBus.emit("objects:changed", {
      objects: this.getAll()
    });

    return object;
  }

  remove(objectId) {
    const object = this.get(objectId);
    if (!object) return null;

    this.objects.delete(objectId);

    this.eventBus.emit("object:removed", { object });
    this.eventBus.emit("objects:changed", {
      objects: this.getAll()
    });

    return object;
  }

  get(objectId) {
    return this.objects.get(objectId) || null;
  }

  getByElement(element) {
    if (!element) return null;
    return this.get(element.dataset.objectId);
  }

  getAll() {
    return Array.from(this.objects.values());
  }

  clear() {
    const removedObjects = this.getAll();

    this.objects.clear();

    this.eventBus.emit("objects:cleared", {
      objects: removedObjects
    });

    this.eventBus.emit("objects:changed", {
      objects: []
    });
  }

  replaceAll(objects) {
    this.clear();

    objects.forEach(object => {
      this.objects.set(object.id, object);
    });

    this.eventBus.emit("project:loaded", {
      objects: this.getAll()
    });

    this.eventBus.emit("objects:changed", {
      objects: this.getAll()
    });
  }
}