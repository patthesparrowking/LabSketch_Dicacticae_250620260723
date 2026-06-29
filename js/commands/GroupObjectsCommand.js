export class GroupObjectsCommand {
  constructor(objectStore, groupStore, objects, groupName = "Neue Gruppe") {
    this.objectStore = objectStore;
    this.groupStore = groupStore;
    this.objects = objects;

    this.group = {
      id: crypto.randomUUID(),
      name: groupName,
      collapsed: false
    };

    this.previousStates = objects.map(object => ({
      objectId: object.id,
      groupId: object.groupId
    }));
  }

  execute() {
    if (!this.groupStore.get(this.group.id)) {
      this.groupStore.createGroup(this.group);
    }

    this.objects.forEach(object => {
      this.objectStore.update(object.id, {
        groupId: this.group.id
      });
    });
  }

  undo() {
    this.previousStates.forEach(state => {
      this.objectStore.update(state.objectId, {
        groupId: state.groupId
      });
    });

    this.groupStore.removeGroup(this.group.id);
  }
}