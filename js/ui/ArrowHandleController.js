import { UpdateObjectCommand } from "../commands/UpdateObjectCommand.js";

export class ArrowHandleController {
constructor({
  canvas,
  objectStore,
  commandManager,
  eventBus,
  getSelectedObject,
  anchorSnapController
}) {
  this.canvas = canvas;
  this.objectStore = objectStore;
  this.commandManager = commandManager;
  this.eventBus = eventBus;
  this.getSelectedObject = getSelectedObject;
  this.anchorSnapController = anchorSnapController;

  this.handleGroup = null;
  this.activeHandle = null;
  this.startState = null;
  this.currentAnchorRef = null;

  this.init();
}

  init() {
this.eventBus.on("selection:changed", () => {
  if (this.activeHandle) return;
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

    const object = this.getSelectedObject();

    if (!object || !(object.type === "line" || object.type === "arrow")) {
      return;
    }

    this.handleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.handleGroup.classList.add("arrow-handles");

    const startHandle = this.createHandle(object.x, object.y, "start");
    const endHandle = this.createHandle(object.x2, object.y2, "end");

    this.handleGroup.appendChild(startHandle);
    this.handleGroup.appendChild(endHandle);

    this.canvas.appendChild(this.handleGroup);
  }

createHandle(x, y, type) {
  const handle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

handle.setAttribute("cx", x);
handle.setAttribute("cy", y);
handle.setAttribute("r", 8);

handle.dataset.handle = type;
handle.classList.add(`handle-${type}`);

  const object = this.getSelectedObject();

  if (type === "start" && object?.startAnchorRef) {
    handle.classList.add("is-attached");
  }

  if (type === "end" && object?.endAnchorRef) {
    handle.classList.add("is-attached");
  }

  handle.addEventListener("pointerdown", event => {
    this.startDrag(event, type);
  });

  return handle;
}

  startDrag(event, type) {
    event.preventDefault();
    event.stopPropagation();

    const object = this.getSelectedObject();
    if (!object || object.locked) return;

    this.activeHandle = type;

    this.startState = {
  x: object.x,
  y: object.y,
  x2: object.x2,
  y2: object.y2,
  startAnchorRef: object.startAnchorRef,
  endAnchorRef: object.endAnchorRef
};

    event.currentTarget.setPointerCapture(event.pointerId);

    event.currentTarget.addEventListener("pointermove", this.drag);
    event.currentTarget.addEventListener("pointerup", this.endDrag);
  }

drag = event => {
  const object = this.getSelectedObject();
  if (!object || !this.activeHandle) return;

  const point = this.getMousePosition(event);

  let snappedPoint = point;
  this.currentAnchorRef = null;

  if (this.anchorSnapController) {
    const virtualHandle = {
      id: "temp-arrow-handle",
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      visible: true,
      anchorPoints: [{ id: "handle", x: 0, y: 0 }]
    };

    const snapped = this.anchorSnapController.snapObject(
      virtualHandle,
      point.x,
      point.y
    );

    if (snapped.snapped) {
      snappedPoint = snapped.anchorPoint;
      this.currentAnchorRef = snapped.anchorRef;
    }
  }

  if (this.activeHandle === "start") {
    this.objectStore.update(object.id, {
      x: snappedPoint.x,
      y: snappedPoint.y,
      startAnchorRef: this.currentAnchorRef
    });
  }

  if (this.activeHandle === "end") {
    this.objectStore.update(object.id, {
      x2: snappedPoint.x,
      y2: snappedPoint.y,
      endAnchorRef: this.currentAnchorRef
    });
  }
};

  endDrag = event => {
    const object = this.getSelectedObject();

    event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.removeEventListener("pointermove", this.drag);
    event.currentTarget.removeEventListener("pointerup", this.endDrag);

    if (!object || !this.startState) {
      this.activeHandle = null;
      this.startState = null;
      return;
    }

const patch = {
  x: object.x,
  y: object.y,
  x2: object.x2,
  y2: object.y2,
  startAnchorRef: object.startAnchorRef,
  endAnchorRef: object.endAnchorRef
};

this.commandManager.execute(
  new UpdateObjectCommand(
    this.objectStore,
    object.id,
    patch,
    this.startState
  )
);

this.activeHandle = null;
this.startState = null;
this.currentAnchorRef = null;

this.anchorSnapController?.clearPreview();
this.anchorSnapController?.clearHighlights();
this.renderHandles();
  };

  removeHandles() {
    if (this.handleGroup) {
      this.handleGroup.remove();
      this.handleGroup = null;
    }
  }

  getMousePosition(event) {
    const point = this.canvas.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    return point.matrixTransform(
      this.canvas.getScreenCTM().inverse()
    );
  }
}