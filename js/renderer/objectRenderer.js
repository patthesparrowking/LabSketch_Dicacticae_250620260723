export function renderObject(object) {
  if (!object.element) return;

  object.element.dataset.objectId = object.id;

  object.element.setAttribute(
    "transform",
    `translate(${object.x} ${object.y}) rotate(${object.rotation}) scale(${object.scale})`
  );

  object.element.style.display = object.visible ? "block" : "none";
  object.element.classList.toggle("is-locked", object.locked);

  if (object.type === "label") {
    object.element.textContent = object.text || "Beschriftung";
  }
}