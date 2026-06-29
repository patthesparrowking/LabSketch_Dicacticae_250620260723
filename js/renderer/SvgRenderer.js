export class SvgRenderer {
constructor({ canvas, eventBus, objectStore, anchorController }) {
  this.canvas = canvas;
  this.eventBus = eventBus;
  this.objectStore = objectStore;
  this.anchorController = anchorController;
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

  if (object.type === "line" || object.type === "arrow") {
    const line = element.querySelector(".line-shape");
    const startPoint = this.getConnectedStartPoint(object);
    const endPoint = this.getConnectedEndPoint(object);

    if (!line) return;

    line.setAttribute("x1", startPoint.x);
    line.setAttribute("y1", startPoint.y);
    line.setAttribute("x2", endPoint.x);
    line.setAttribute("y2", endPoint.y);
    line.setAttribute("stroke", object.strokeColor || "#18331f");
    line.setAttribute("stroke-width", object.strokeWidth || 4);
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-dasharray", object.strokeDasharray || "");

    let arrowHead = element.querySelector(".arrow-head");

    if (object.arrowEnd && !arrowHead) {
      arrowHead = this.createSvgElement("path");
      arrowHead.classList.add("arrow-head");
      element.appendChild(arrowHead);
    }

    if (!object.arrowEnd && arrowHead) {
      arrowHead.remove();
      arrowHead = null;
    }

    if (arrowHead) {
      arrowHead.setAttribute(
        "d",
        createArrowHeadPath(
          startPoint.x,
          startPoint.y,
          endPoint.x,
          endPoint.y
        )
      );

      arrowHead.setAttribute("fill", object.strokeColor || "#18331f");
    }

    element.removeAttribute("transform");
    return;
  }

  element.setAttribute(
    "transform",
    `translate(${object.x} ${object.y}) rotate(${object.rotation}) scale(${object.scale})`
  );

  if (object.type === "label") {
    element.textContent = object.text || "Beschriftung";
  }
}

  createElement(object) {

if (object.type === "line" || object.type === "arrow") {
  const group = this.createSvgElement("g");

  const line = this.createSvgElement("line");
  line.classList.add("line-shape");
  group.appendChild(line);

  if (object.arrowEnd) {
    const arrowHead = this.createSvgElement("path");
    arrowHead.classList.add("arrow-head");
    group.appendChild(arrowHead);
  }

  return group;
}


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

  getConnectedStartPoint(object) {
  if (!object.startAnchorRef || !this.objectStore) {
    return {
      x: object.x,
      y: object.y
    };
  }

  const targetObject = this.objectStore.get(object.startAnchorRef.objectId);
  if (!targetObject) {
    return {
      x: object.x,
      y: object.y
    };
  }

  const anchor = targetObject.anchorPoints?.find(
    point => point.id === object.startAnchorRef.anchorId
  );

  if (!anchor) {
    return {
      x: object.x,
      y: object.y
    };
  }

  return this.getWorldAnchorPoint(targetObject, anchor);
}

  getConnectedEndPoint(object) {
  if (!object.endAnchorRef || !this.objectStore) {
    return {
      x: object.x2,
      y: object.y2
    };
  }

  const targetObject = this.objectStore.get(object.endAnchorRef.objectId);
  if (!targetObject) {
    return {
      x: object.x2,
      y: object.y2
    };
  }

  const anchor = targetObject.anchorPoints?.find(
    point => point.id === object.endAnchorRef.anchorId
  );

  if (!anchor) {
    return {
      x: object.x2,
      y: object.y2
    };
  }

  return this.getWorldAnchorPoint(targetObject, anchor);
}

getWorldAnchorPoint(object, anchor) {
  const angle = object.rotation * Math.PI / 180;

  const localX = anchor.x * object.scale;
  const localY = anchor.y * object.scale;

  const rotatedX =
    localX * Math.cos(angle) -
    localY * Math.sin(angle);

  const rotatedY =
    localX * Math.sin(angle) +
    localY * Math.cos(angle);

  return {
    x: object.x + rotatedX,
    y: object.y + rotatedY
  };
}
}

function createArrowHeadPath(x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 14;

  const p1x = x2;
  const p1y = y2;

  const p2x = x2 - size * Math.cos(angle - Math.PI / 6);
  const p2y = y2 - size * Math.sin(angle - Math.PI / 6);

  const p3x = x2 - size * Math.cos(angle + Math.PI / 6);
  const p3y = y2 - size * Math.sin(angle + Math.PI / 6);

  return `M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} Z`;
}