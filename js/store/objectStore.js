const objects = new Map();

export function addObject(object) {
  objects.set(object.id, object);
  return object;
}

export function removeObject(objectId) {
  const object = objects.get(objectId);

  if (object?.element) {
    object.element.remove();
  }

  objects.delete(objectId);
}

export function getObject(objectId) {
  return objects.get(objectId) || null;
}

export function getObjectByElement(element) {
  if (!element) return null;
  return getObject(element.dataset.objectId);
}

export function getAllObjects() {
  return Array.from(objects.values());
}

export function clearObjects() {
  objects.forEach(object => {
    if (object.element) {
      object.element.remove();
    }
  });

  objects.clear();
}