export class UpdateObjectsCommand {
  constructor(objectStore, updates) {
    this.objectStore = objectStore;
    this.updates = updates;
    this.previousStates = [];
  }

  execute() {
    this.previousStates = this.updates.map(update => {
      const object = this.objectStore.get(update.objectId);

      return {
        objectId: update.objectId,
        previous: object ? { ...object } : null
      };
    });

    this.updates.forEach(update => {
      const object = this.objectStore.get(update.objectId);
      if (!object) return;

      this.objectStore.update(update.objectId, update.patch);
    });
  }

  undo() {
    this.previousStates.forEach(state => {
      if (!state.previous) return;

      this.objectStore.update(state.objectId, {
        name: state.previous.name,
        x: state.previous.x,
        y: state.previous.y,
        scale: state.previous.scale,
        rotation: state.previous.rotation,
        visible: state.previous.visible,
        locked: state.previous.locked,
        groupId: state.previous.groupId,
        text: state.previous.text,
        path: state.previous.path,
        station: state.previous.station,
        tags: state.previous.tags,
        metadata: state.previous.metadata
      });
    });
  }
}