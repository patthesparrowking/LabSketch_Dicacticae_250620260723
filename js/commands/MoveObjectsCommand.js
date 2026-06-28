export class MoveObjectsCommand {
  constructor(objectStore, moves) {
    this.objectStore = objectStore;
    this.moves = moves;
  }

  execute() {
    this.moves.forEach(move => {
      const object = this.objectStore.get(move.objectId);
      if (!object || object.locked) return;

      this.objectStore.update(move.objectId, move.to);
    });
  }

  undo() {
    this.moves.forEach(move => {
      const object = this.objectStore.get(move.objectId);
      if (!object || object.locked) return;

      this.objectStore.update(move.objectId, move.from);
    });
  }
}