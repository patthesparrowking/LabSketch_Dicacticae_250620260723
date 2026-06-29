export class AnchorController {
  constructor({ canvas, eventBus, selectionController }) {
    this.canvas = canvas;
    this.eventBus = eventBus;
    this.selectionController = selectionController;
    this.anchorGroup = null;

    this.init();
  }

  init() {
    this.eventBus.on("selection:changed", () => {
      this.renderAnchors();
    });

    this.eventBus.on("object:updated", () => {
      this.renderAnchors();
    });
  }

  renderAnchors() {
    this.clearAnchors();

    const objects = this.selectionController
      .getSelectedObjects()
      .filter(object =>
        object.visible &&
        object.anchorPoints &&
        object.anchorPoints.length > 0
      );

    if (objects.length === 0) return;

    this.anchorGroup = this.createSvgElement("g");
    this.anchorGroup.classList.add("anchor-points");

    objects.forEach(object => {
      object.anchorPoints.forEach(anchor => {
        const point = this.getWorldAnchorPoint(object, anchor);

        const circle = this.createSvgElement("circle");
        circle.classList.add("anchor-point");
        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", 5);
        circle.dataset.objectId = object.id;
        circle.dataset.anchorId = anchor.id;

        this.anchorGroup.appendChild(circle);
      });
    });

    this.canvas.appendChild(this.anchorGroup);
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

  clearAnchors() {
    if (this.anchorGroup) {
      this.anchorGroup.remove();
      this.anchorGroup = null;
    }
  }

  createSvgElement(tagName) {
    return document.createElementNS(
      "http://www.w3.org/2000/svg",
      tagName
    );
  }
}