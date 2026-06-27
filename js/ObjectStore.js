const objects = new Map();

let nextObjectId = 1;

export function registerObject(element, data = {}) {
  const id = `obj_${nextObjectId++}`;

  const objectData = {
    id,
    type: data.type || element.dataset.type || "unknown",
    name: data.name || data.type || "Objekt",
    x: Number(data.x ?? element.dataset.x ?? 0),
    y: Number(data.y ?? element.dataset.y ?? 0),
    scale: Number(data.scale ?? element.dataset.scale ?? 1),
    rotation: Number(data.rotation ?? element.dataset.rotation ?? 0),
    locked: false,
    visible: true,
    element
  };

  objects.set(id, objectData);

  element.dataset.objectId = id;
  element.dataset.type = objectData.type;
  element.dataset.x = objectData.x;
  element.dataset.y = objectData.y;
  element.dataset.scale = objectData.scale;
  element.dataset.rotation = objectData.rotation;

  return objectData;
}


export function getObjectByElement(element) {
  if (!element) return null;
  return objects.get(element.dataset.objectId) || null;
}

export function getObjectById(id) {
  return objects.get(id) || null;
}

export function updateObjectFromElement(element) {
  const objectData = getObjectByElement(element);
  if (!objectData) return;

  objectData.x = Number(element.dataset.x);
  objectData.y = Number(element.dataset.y);
  objectData.scale = Number(element.dataset.scale);
  objectData.rotation = Number(element.dataset.rotation);
}

export function removeObject(element) {
  const objectData = getObjectByElement(element);
  if (!objectData) return;

  objects.delete(objectData.id);
  element.remove();
}

export function clearObjects() {
  objects.clear();
  nextObjectId = 1;
}

export function getAllObjects() {
  return Array.from(objects.values());
}
