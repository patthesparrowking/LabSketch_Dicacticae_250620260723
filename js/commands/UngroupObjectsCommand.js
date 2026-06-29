export class UngroupObjectsCommand {
  constructor(objectStore, objects) {
    this.objectStore = objectStore;
    this.objects = objects;

    this.previousStates = objects.map(object => ({
      objectId: object.id,
      groupId: object.groupId
    }));
  }

  execute() {
    this.objects.forEach(object => {
      this.objectStore.update(object.id, {
        groupId: null
      });
    });
  }

  undo() {
    this.previousStates.forEach(state => {
      this.objectStore.update(state.objectId, {
        groupId: state.groupId
      });
    });
  }
}