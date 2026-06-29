export class SelectionBoxController {
  constructor({ canvas, objectStore, selectionController }) {
    this.canvas = canvas;
    this.objectStore = objectStore;
    this.selectionController = selectionController;

    this.isDragging = false;
    this.startPoint = null;
    this.selectionRect = null;

    this.init();
  }

init() {
  this.canvas.addEventListener("pointerdown", event => {
    const objectElement = event.target.closest("[data-object-id]");

    if (objectElement) return;

    const handleElement = event.target.closest(
      ".selection-handle, .rotation-handle, .arrow-handles, .anchor-point"
    );

    if (handleElement) return;

    if (this.canvas.dataset.tool && this.canvas.dataset.tool !== "select") {
      return;
    }

    this.startSelectionBox(event);
  });
}

  startSelectionBox(event) {
    event.preventDefault();

    this.isDragging = true;
    this.canvas.dataset.interaction = "selection-box";
    this.startPoint = this.getMousePosition(event);

    this.selectionController.clear();

    this.selectionRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    this.selectionRect.classList.add("selection-box");
    this.canvas.appendChild(this.selectionRect);

    this.canvas.setPointerCapture(event.pointerId);
    this.canvas.addEventListener("pointermove", this.dragSelectionBox);
    this.canvas.addEventListener("pointerup", this.endSelectionBox);
  }

  dragSelectionBox = event => {
    if (!this.isDragging || !this.startPoint) return;

    const point = this.getMousePosition(event);
    const box = this.createBox(this.startPoint, point);

    this.selectionRect.setAttribute("x", box.x);
    this.selectionRect.setAttribute("y", box.y);
    this.selectionRect.setAttribute("width", box.width);
    this.selectionRect.setAttribute("height", box.height);
  };

  endSelectionBox = event => {
    if (!this.isDragging) return;

    const endPoint = this.getMousePosition(event);
    const selectionBox = this.createBox(this.startPoint, endPoint);

    this.selectObjectsInside(selectionBox);

    this.selectionRect?.remove();
    this.selectionRect = null;

    this.canvas.releasePointerCapture(event.pointerId);
    this.canvas.removeEventListener("pointermove", this.dragSelectionBox);
    this.canvas.removeEventListener("pointerup", this.endSelectionBox);

    this.isDragging = false;
    this.startPoint = null;
    delete this.canvas.dataset.interaction;
  };

  selectObjectsInside(selectionBox) {
    this.objectStore.getAll().forEach(object => {
      if (!object.visible || !object.element) return;

      const box = this.getObjectBox(object);

const intersects =
  box.x < selectionBox.x + selectionBox.width &&
  box.x + box.width > selectionBox.x &&
  box.y < selectionBox.y + selectionBox.height &&
  box.y + box.height > selectionBox.y;

if (intersects) {
  this.selectionController.toggle(object.id);
}
    });
  }

  getObjectBox(object) {
    const bbox = object.element.getBBox();

    return {
      x: object.x + bbox.x * object.scale,
      y: object.y + bbox.y * object.scale,
      width: bbox.width * object.scale,
      height: bbox.height * object.scale
    };
  }

  createBox(start, end) {
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    return { x, y, width, height };
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