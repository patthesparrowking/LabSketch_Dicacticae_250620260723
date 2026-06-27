export class SvgRenderer {
  constructor({ canvas, eventBus }) {
    this.canvas = canvas;
    this.eventBus = eventBus;
    this.objectElements = new Map();

    this.bindEvents();
  }

  bindEvents() {
    this.eventBus.on("object:added", ({ object }) => {
      this.renderObject(object);
    });

    this.eventBus.on("object:updated", ({ object }) => {
      this.renderObject(object);
    });

    this.eventBus.on("object:removed", ({ object }) => {
      this.removeObject(object);
    });

    this.eventBus.on("objects:cleared", () => {
      this.clearObjects();
    });

    this.eventBus.on("project:loaded", ({ objects }) => {
      this.clearObjects();
      objects.forEach(object => this.renderObject(object));
    });
  }

  renderObject(object) {
    let element = this.objectElements.get(object.id);

    if (!element) {
      element = this.createElement(object);
      this.objectElements.set(object.id, element);
      this.canvas.appendChild(element);
      object.element = element;
    }

    element.dataset.objectId = object.id;
    element.classList.add("draggable");
    element.classList.toggle("is-locked", object.locked);
    element.style.display = object.visible ? "block" : "none";

    element.setAttribute(
      "transform",
      `translate(${object.x} ${object.y}) rotate(${object.rotation}) scale(${object.scale})`
    );

    if (object.type === "label") {
      element.textContent = object.text || "Beschriftung";
    }
  }

  createElement(object) {
    if (object.type === "label") {
      const text = this.createSvgElement("text");

      text.textContent = object.text || "Beschriftung";
      text.setAttribute("x", "0");
      text.setAttribute("y", "0");
      text.setAttribute("font-size", "32");
      text.setAttribute("font-family", "Arial, sans-serif");
      text.setAttribute("fill", "#18331f");

      return text;
    }

    const group = this.createSvgElement("g");

    if (object.metadata?.svgContent) {
  group.innerHTML = object.metadata.svgContent;
}

    return group;
  }

  removeObject(object) {
    const element = this.objectElements.get(object.id);

    if (element) {
      element.remove();
      this.objectElements.delete(object.id);
    }

    object.element = null;
  }

  clearObjects() {
    this.objectElements.forEach(element => {
      element.remove();
    });

    this.objectElements.clear();
  }

  createSvgElement(tagName) {
    return document.createElementNS(
      "http://www.w3.org/2000/svg",
      tagName
    );
  }
}