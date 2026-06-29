import { ScaleObjectsCommand } from "../commands/ScaleObjectsCommand.js";
import { RotateObjectsCommand } from "../commands/RotateObjectsCommand.js";

export class SelectionHandlesController {
constructor({
  canvas,
  eventBus,
  selectionController,
  objectStore,
  commandManager,
  geometryService
}) {
  this.canvas = canvas;
  this.eventBus = eventBus;
  this.selectionController = selectionController;
  this.objectStore = objectStore;
  this.commandManager = commandManager;
  this.geometryService = geometryService;

  this.handleGroup = null;
  this.activeHandle = null;
  this.startPoint = null;
  this.startBounds = null;
  this.startObjects = [];

  this.init();
}

  init() {
    this.eventBus.on("selection:changed", () => {
      this.renderHandles();
    });

    this.eventBus.on("object:updated", () => {
  if (this.activeHandle) return;
  this.renderHandles();
});

    this.eventBus.on("objects:changed", () => {
  if (this.activeHandle) return;
  this.renderHandles();
});
  }

  renderHandles() {
    this.removeHandles();

    const objects = this.selectionController
      .getSelectedObjects()
      .filter(object =>
        object.visible &&
        object.element &&
        object.type !== "line" &&
        object.type !== "arrow"
      );

      if (objects.length === 1) {
  this.renderRotatedObjectHandles(objects[0]);
  return;
}

    if (objects.length === 0) return;

    const bounds = this.getSelectionBounds(objects);
    if (!bounds) return;

    this.handleGroup = this.createSvgElement("g");
    this.handleGroup.classList.add("selection-handles");

    const rect = this.createSvgElement("rect");
    rect.classList.add("selection-bounds");
    rect.setAttribute("x", bounds.x);
    rect.setAttribute("y", bounds.y);
    rect.setAttribute("width", bounds.width);
    rect.setAttribute("height", bounds.height);

    this.handleGroup.appendChild(rect);

    const corners = [
      ["nw", bounds.x, bounds.y],
      ["ne", bounds.x + bounds.width, bounds.y],
      ["se", bounds.x + bounds.width, bounds.y + bounds.height],
      ["sw", bounds.x, bounds.y + bounds.height]
    ];

    corners.forEach(([position, x, y]) => {
      const handle = this.createSvgElement("circle");
      handle.classList.add("selection-handle");
      handle.dataset.handle = position;
      handle.setAttribute("cx", x);
      handle.setAttribute("cy", y);
      handle.setAttribute("r", 7);
      handle.addEventListener("pointerdown", event => {
  this.startScale(event, position);
});

const rotateHandle = this.createSvgElement("circle");
rotateHandle.classList.add("selection-handle", "rotation-handle");
rotateHandle.dataset.handle = "rotate";
rotateHandle.setAttribute("cx", bounds.x + bounds.width / 2);
rotateHandle.setAttribute("cy", bounds.y - 32);
rotateHandle.setAttribute("r", 8);

rotateHandle.addEventListener("pointerdown", event => {
  this.startRotate(event);
});

this.handleGroup.appendChild(rotateHandle);

const rotateLine = this.createSvgElement("line");
rotateLine.classList.add("rotation-line");
rotateLine.setAttribute("x1", bounds.x + bounds.width / 2);
rotateLine.setAttribute("y1", bounds.y);
rotateLine.setAttribute("x2", bounds.x + bounds.width / 2);
rotateLine.setAttribute("y2", bounds.y - 32);

this.handleGroup.insertBefore(rotateLine, rotateHandle);

      this.handleGroup.appendChild(handle);
    });

    this.canvas.appendChild(this.handleGroup);
  }

getSelectionBounds(objects) {
  return this.geometryService.getSelectionBounds(objects);
}

  removeHandles() {
    if (this.handleGroup) {
      this.handleGroup.remove();
      this.handleGroup = null;
    }
  }

  createSvgElement(tagName) {
    return document.createElementNS(
      "http://www.w3.org/2000/svg",
      tagName
    );
  }

  startScale(event, handlePosition) {
  event.preventDefault();
  event.stopPropagation();

  const objects = this.selectionController
    .getSelectedObjects()
    .filter(object => !object.locked && object.visible);

  if (objects.length === 0) return;

  this.activeHandle = handlePosition;
  this.startPoint = this.getMousePosition(event);
  this.startBounds = this.getSelectionBounds(objects);

this.scaleCenter = {
  x: this.startBounds.x + this.startBounds.width / 2,
  y: this.startBounds.y + this.startBounds.height / 2
};

this.startObjects = objects.map(object => ({
  objectId: object.id,
  x: object.x,
  y: object.y,
  scale: object.scale
}));

  event.currentTarget.setPointerCapture(event.pointerId);
  event.currentTarget.addEventListener("pointermove", this.scaleDrag);
  event.currentTarget.addEventListener("pointerup", this.endScale);
}

startRotate(event) {
  event.preventDefault();
  event.stopPropagation();

  const objects = this.selectionController
    .getSelectedObjects()
    .filter(object => !object.locked && object.visible);

  if (objects.length === 0) return;

  this.activeHandle = "rotate";
  this.startPoint = this.getMousePosition(event);
  this.startBounds = this.getSelectionBounds(objects);

  this.rotationCenter = {
    x: this.startBounds.x + this.startBounds.width / 2,
    y: this.startBounds.y + this.startBounds.height / 2
  };

  this.startAngle = this.getAngle(this.startPoint, this.rotationCenter);

this.startObjects = objects.map(object => ({
  objectId: object.id,
  x: object.x,
  y: object.y,
  rotation: object.rotation
}));

  event.currentTarget.setPointerCapture(event.pointerId);
  event.currentTarget.addEventListener("pointermove", this.rotateDrag);
  event.currentTarget.addEventListener("pointerup", this.endRotate);
}

rotateDrag = event => {
  if (!this.rotationCenter || this.startAngle === undefined) return;

  const point = this.getMousePosition(event);

  let currentAngle = this.getAngle(point, this.rotationCenter);
  let delta = currentAngle - this.startAngle;

  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  if (event.shiftKey) {
    delta = Math.round(delta / 15) * 15;
  }

  const radians = delta * Math.PI / 180;

  this.startObjects.forEach(start => {
    const object = this.objectStore.get(start.objectId);
    if (!object) return;

    const offsetX = start.x - this.rotationCenter.x;
    const offsetY = start.y - this.rotationCenter.y;

    const rotatedX =
      offsetX * Math.cos(radians) -
      offsetY * Math.sin(radians);

    const rotatedY =
      offsetX * Math.sin(radians) +
      offsetY * Math.cos(radians);

    this.objectStore.update(object.id, {
      x: this.rotationCenter.x + rotatedX,
      y: this.rotationCenter.y + rotatedY,
      rotation: start.rotation + delta
    });
  });
};

endRotate = event => {
  event.currentTarget.releasePointerCapture(event.pointerId);
  event.currentTarget.removeEventListener("pointermove", this.rotateDrag);
  event.currentTarget.removeEventListener("pointerup", this.endRotate);

  const changes = this.startObjects
    .map(start => {
      const object = this.objectStore.get(start.objectId);
      if (!object) return null;

return {
  objectId: object.id,
  from: {
    x: start.x,
    y: start.y,
    rotation: start.rotation
  },
  to: {
    x: object.x,
    y: object.y,
    rotation: object.rotation
  }
};
    })
    .filter(Boolean);

  this.commandManager.execute(
    new RotateObjectsCommand(this.objectStore, changes)
  );

this.activeHandle = null;
this.startPoint = null;
this.startBounds = null;
this.startObjects = [];
this.rotationCenter = null;
this.startAngle = undefined;

this.renderHandles();
};

getAngle(point, center) {
  return Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI;
}


scaleDrag = event => {
  if (!this.activeHandle || !this.startPoint || !this.startBounds || !this.scaleCenter) return;

  const point = this.getMousePosition(event);

  const dx = point.x - this.startPoint.x;
  const dy = point.y - this.startPoint.y;

  const primary = this.selectionController.getPrimaryObject?.()
    || this.selectionController.getSelectedObjects()[0];

  const angle = primary ? -primary.rotation * Math.PI / 180 : 0;

  const localDx =
    dx * Math.cos(angle) -
    dy * Math.sin(angle);

  const localDy =
    dx * Math.sin(angle) +
    dy * Math.cos(angle);

  const sensitivity = 0.008;

  let scaleFactor = 1;

  if (this.activeHandle === "se") {
    scaleFactor = 1 + (localDx + localDy) * sensitivity;
  }

  if (this.activeHandle === "nw") {
    scaleFactor = 1 - (localDx + localDy) * sensitivity;
  }

  if (this.activeHandle === "ne") {
    scaleFactor = 1 + (localDx - localDy) * sensitivity;
  }

  if (this.activeHandle === "sw") {
    scaleFactor = 1 + (-localDx + localDy) * sensitivity;
  }

  scaleFactor = Math.max(0.1, scaleFactor);

  this.startObjects.forEach(start => {
    const object = this.objectStore.get(start.objectId);
    if (!object) return;

    const offsetX = start.x - this.scaleCenter.x;
    const offsetY = start.y - this.scaleCenter.y;

    this.objectStore.update(object.id, {
      x: this.scaleCenter.x + offsetX * scaleFactor,
      y: this.scaleCenter.y + offsetY * scaleFactor,
      scale: start.scale * scaleFactor
    });
  });
};

endScale = event => {
  event.currentTarget.releasePointerCapture(event.pointerId);
  event.currentTarget.removeEventListener("pointermove", this.scaleDrag);
  event.currentTarget.removeEventListener("pointerup", this.endScale);

  const changes = this.startObjects
    .map(start => {
      const object = this.objectStore.get(start.objectId);
      if (!object) return null;

      return {
        objectId: object.id,
        from: {
          x: start.x,
          y: start.y,
          scale: start.scale
        },
        to: {
          x: object.x,
          y: object.y,
          scale: object.scale
        }
      };
    })
    .filter(Boolean);

  this.commandManager.execute(
    new ScaleObjectsCommand(this.objectStore, changes)
  );

this.activeHandle = null;
this.startPoint = null;
this.startBounds = null;
this.startObjects = [];
this.scaleCenter = null;

this.renderHandles();
};

getMousePosition(event) {
  const point = this.canvas.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;

  return point.matrixTransform(
    this.canvas.getScreenCTM().inverse()
  );
}

renderRotatedObjectHandles(object) {
  const bbox = object.element.getBBox();

  const x = bbox.x;
  const y = bbox.y;
  const width = bbox.width;
  const height = bbox.height;

  this.handleGroup = this.createSvgElement("g");
  this.handleGroup.classList.add("selection-handles");

  this.handleGroup.setAttribute(
    "transform",
    `translate(${object.x} ${object.y}) rotate(${object.rotation}) scale(${object.scale})`
  );

  const rect = this.createSvgElement("rect");
  rect.classList.add("selection-bounds");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);

  this.handleGroup.appendChild(rect);

  const corners = [
    ["nw", x, y],
    ["ne", x + width, y],
    ["se", x + width, y + height],
    ["sw", x, y + height]
  ];

  corners.forEach(([position, cx, cy]) => {
    const handle = this.createSvgElement("circle");
    handle.classList.add("selection-handle");
    handle.dataset.handle = position;
    handle.setAttribute("cx", cx);
    handle.setAttribute("cy", cy);
    handle.setAttribute("r", 7 / object.scale);

    handle.addEventListener("pointerdown", event => {
      this.startScale(event, position);
    });

    this.handleGroup.appendChild(handle);
  });

  const rotateHandle = this.createSvgElement("circle");
  rotateHandle.classList.add("selection-handle", "rotation-handle");
  rotateHandle.dataset.handle = "rotate";
  rotateHandle.setAttribute("cx", x + width / 2);
//   rotateHandle.setAttribute("cy", y - 32);
  rotateHandle.setAttribute("r", 8 / object.scale);

  rotateHandle.addEventListener("pointerdown", event => {
    this.startRotate(event);
  });

  const rotateLine = this.createSvgElement("line");
  rotateLine.classList.add("rotation-line");
  rotateLine.setAttribute("x1", x + width / 2);
  rotateLine.setAttribute("y1", y);
  rotateLine.setAttribute("x2", x + width / 2);
//   rotateLine.setAttribute("y2", y - 32);

const handleDistance = 32 / object.scale;

rotateHandle.setAttribute("cy", y - handleDistance);
rotateLine.setAttribute("y2", y - handleDistance);

  this.handleGroup.appendChild(rotateLine);
  this.handleGroup.appendChild(rotateHandle);

  this.canvas.appendChild(this.handleGroup);
}
}