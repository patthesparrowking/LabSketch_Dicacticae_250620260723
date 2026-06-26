import { getAllObjects } from "./store/objectStore.js";
import { loadProjectData } from "./project.js";

let undoStack = [];
let redoStack = [];
let isRestoring = false;

export function saveHistoryState() {
  if (isRestoring) return;

  const snapshot = getAllObjects().map(object => ({
    type: object.type,
    name: object.name,
    x: object.x,
    y: object.y,
    scale: object.scale,
    rotation: object.rotation,
    text: object.text,
    path: object.path,
    station: object.station,
    tags: object.tags,
    locked: object.locked,
    visible: object.visible
  }));

  undoStack.push(JSON.stringify(snapshot));
  redoStack = [];

  if (undoStack.length > 50) {
    undoStack.shift();
  }
}

export async function undo() {
  if (undoStack.length <= 1) return;

  isRestoring = true;

  const current = undoStack.pop();
  redoStack.push(current);

  const previous = undoStack[undoStack.length - 1];
  await loadProjectData(JSON.parse(previous));

  isRestoring = false;
}

export async function redo() {
  if (redoStack.length === 0) return;

  isRestoring = true;

  const next = redoStack.pop();
  undoStack.push(next);

  await loadProjectData(JSON.parse(next));

  isRestoring = false;
}