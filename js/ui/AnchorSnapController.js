export class AnchorSnapController {
    constructor({ objectStore, anchorController }) {
        this.objectStore = objectStore;
        this.anchorController = anchorController;
        this.enabled = true;
        this.threshold = 14;
        this.previewGroup = null;
        this.highlightGroup = null;
    }

snapObject(object, targetX, targetY) {
  if (!this.enabled || !object.anchorPoints?.length) {
    this.clearPreview();
    this.clearHighlights();

    return {
      x: targetX,
      y: targetY,
      snapped: false,
      anchorRef: null,
      anchorPoint: null
    };
  }

  const movingAnchors = object.anchorPoints.map(anchor => {
    const tempObject = {
      ...object,
      x: targetX,
      y: targetY
    };

    return {
      anchor,
      point: this.anchorController.getWorldAnchorPoint(tempObject, anchor)
    };
  });

  const targets = this.getTargetAnchors(object.id);

  this.renderAnchorHighlights(targets);

  for (const moving of movingAnchors) {
    for (const target of targets) {
      const dx = target.point.x - moving.point.x;
      const dy = target.point.y - moving.point.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= this.threshold) {
        this.renderPreview(moving.point, target.point);
        this.renderAnchorHighlights(targets, target);

        return {
          x: targetX + dx,
          y: targetY + dy,
          snapped: true,
          anchorRef: {
            objectId: target.object.id,
            anchorId: target.anchor.id
          },
          anchorPoint: target.point
        };
      }
    }
  }

  this.clearPreview();

  return {
    x: targetX,
    y: targetY,
    snapped: false,
    anchorRef: null,
    anchorPoint: null
  };
}

  getTargetAnchors(ignoreObjectId) {
    const targets = [];

    this.objectStore.getAll().forEach(object => {
      if (
        object.id === ignoreObjectId ||
        !object.visible ||
        !object.anchorPoints?.length
      ) {
        return;
      }

      object.anchorPoints.forEach(anchor => {
        targets.push({
          object,
          anchor,
          point: this.anchorController.getWorldAnchorPoint(object, anchor)
        });
      });
    });

    return targets;
  }

  setEnabled(value) {
    this.enabled = value;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  setThreshold(value) {
    this.threshold = value;
  }

  renderPreview(from, to) {
  this.clearPreview();

  this.previewGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  this.previewGroup.classList.add("anchor-snap-preview");

  const line = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );

  line.setAttribute("x1", from.x);
  line.setAttribute("y1", from.y);
  line.setAttribute("x2", to.x);
  line.setAttribute("y2", to.y);

  const target = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  target.setAttribute("cx", to.x);
  target.setAttribute("cy", to.y);
  target.setAttribute("r", 8);

  this.previewGroup.appendChild(line);
  this.previewGroup.appendChild(target);

  document.getElementById("canvas").appendChild(this.previewGroup);
}

clearPreview() {
  if (this.previewGroup) {
    this.previewGroup.remove();
    this.previewGroup = null;
  }
}

renderAnchorHighlights(targets, activeTarget = null) {
  this.clearHighlights();

  this.highlightGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  this.highlightGroup.classList.add("anchor-highlight-layer");

  targets.forEach(target => {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    const isActive =
      activeTarget &&
      activeTarget.object.id === target.object.id &&
      activeTarget.anchor.id === target.anchor.id;

    circle.classList.add("anchor-highlight");

    if (isActive) {
      circle.classList.add("is-active");
    }

    circle.setAttribute("cx", target.point.x);
    circle.setAttribute("cy", target.point.y);
    circle.setAttribute("r", isActive ? 10 : 6);

    this.highlightGroup.appendChild(circle);
  });

  document.getElementById("canvas").appendChild(this.highlightGroup);
}

clearHighlights() {
  if (this.highlightGroup) {
    this.highlightGroup.remove();
    this.highlightGroup = null;
  }
}
}