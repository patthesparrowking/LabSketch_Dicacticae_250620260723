export class GroupStore {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.groups = new Map();
  }

  createGroup({ id = crypto.randomUUID(), name = "Neue Gruppe", collapsed = false } = {}) {
    const group = {
      id,
      name,
      collapsed
    };

    this.groups.set(id, group);

    this.eventBus.emit("group:created", { group });
    this.eventBus.emit("groups:changed", { groups: this.getAll() });

    return group;
  }

  updateGroup(groupId, patch = {}) {
    const group = this.get(groupId);
    if (!group) return null;

    Object.assign(group, patch);

    this.eventBus.emit("group:updated", { group });
    this.eventBus.emit("groups:changed", { groups: this.getAll() });

    return group;
  }

  removeGroup(groupId) {
    const group = this.get(groupId);
    if (!group) return null;

    this.groups.delete(groupId);

    this.eventBus.emit("group:removed", { group });
    this.eventBus.emit("groups:changed", { groups: this.getAll() });

    return group;
  }

  replaceAll(groups = []) {
  this.clear();

  groups.forEach(group => {
    this.groups.set(group.id, {
      id: group.id,
      name: group.name || "Gruppe",
      collapsed: group.collapsed || false
    });
  });

  this.eventBus.emit("groups:changed", {
    groups: this.getAll()
  });
}

  get(groupId) {
    return this.groups.get(groupId) || null;
  }

  getAll() {
    return Array.from(this.groups.values());
  }

  clear() {
    this.groups.clear();

    this.eventBus.emit("groups:changed", {
      groups: []
    });
  }
}

