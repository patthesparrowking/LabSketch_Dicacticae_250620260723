export class SelectionController {
  constructor({ objectStore, eventBus }) {
    this.objectStore = objectStore;
    this.eventBus = eventBus;
    this.selectedIds = new Set();
  }

  selectOnly(objectId) {
    this.clear();
    this.selectedIds.add(objectId);
    this.updateDomSelection();
    this.emitChange();
  }

  toggle(objectId) {
    if (this.selectedIds.has(objectId)) {
      this.selectedIds.delete(objectId);
    } else {
      this.selectedIds.add(objectId);
    }

    this.updateDomSelection();
    this.emitChange();
  }

  selectGroup(groupId) {
  this.clear();

  this.objectStore.getAll().forEach(object => {
    if (object.groupId === groupId) {
      this.selectedIds.add(object.id);
    }
  });

  this.updateDomSelection();
  this.emitChange();
}

toggleGroup(groupId) {
  const groupObjects = this.objectStore
    .getAll()
    .filter(object => object.groupId === groupId);

  const allSelected = groupObjects.every(object =>
    this.selectedIds.has(object.id)
  );

  groupObjects.forEach(object => {
    if (allSelected) {
      this.selectedIds.delete(object.id);
    } else {
      this.selectedIds.add(object.id);
    }
  });

  this.updateDomSelection();
  this.emitChange();
}

  clear() {
    this.selectedIds.clear();
    this.updateDomSelection();
    this.emitChange();
  }

  getSelectedObjects() {
    return Array.from(this.selectedIds)
      .map(id => this.objectStore.get(id))
      .filter(Boolean);
  }

  getPrimaryObject() {
    return this.getSelectedObjects()[0] || null;
  }

  hasSelection() {
    return this.selectedIds.size > 0;
  }

  updateDomSelection() {
    this.objectStore.getAll().forEach(object => {
      object.element?.classList.toggle(
        "selected",
        this.selectedIds.has(object.id)
      );
    });
  }

  emitChange() {
    this.eventBus.emit("selection:changed", {
      selectedIds: Array.from(this.selectedIds),
      selectedObjects: this.getSelectedObjects()
    });
  }
}