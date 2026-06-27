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