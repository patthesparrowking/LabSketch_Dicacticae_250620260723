// js/ui/SmartGuideController.js

export class SmartGuideController {
  constructor({ canvas, objectStore }) {
    this.canvas = canvas;
    this.objectStore = objectStore;
    this.threshold = 8;
    this.guideGroup = null;
    this.enabled = true;
  }

  snapObject(object, targetX, targetY) {
    const others = this.objectStore
      .getAll()
      .filter(other =>
        other.id !== object.id &&
        other.visible &&
        other.element
      );

    let snappedX = targetX;
    let snappedY = targetY;
    const guides = [];

    const movingBox = this.getObjectBox({
      ...object,
      x: targetX,
      y: targetY
    });

    for (const other of others) {
      const otherBox = this.getObjectBox(other);

      const xMatches = [
        { moving: movingBox.left, other: otherBox.left },
        { moving: movingBox.centerX, other: otherBox.centerX },
        { moving: movingBox.right, other: otherBox.right }
      ];

      const yMatches = [
        { moving: movingBox.top, other: otherBox.top },
        { moving: movingBox.centerY, other: otherBox.centerY },
        { moving: movingBox.bottom, other: otherBox.bottom }
      ];

      for (const match of xMatches) {
        const diff = match.other - match.moving;

        if (Math.abs(diff) <= this.threshold) {
          snappedX += diff;

          guides.push({
            type: "vertical",
            x: match.other
          });

          break;
        }
      }

      for (const match of yMatches) {
        const diff = match.other - match.moving;

        if (Math.abs(diff) <= this.threshold) {
          snappedY += diff;

          guides.push({
            type: "horizontal",
            y: match.other
          });

          break;
        }
      }
    }

    this.renderGuides(guides);

    return {
      x: snappedX,
      y: snappedY
    };
  }

  getObjectBox(object) {
    const bbox = object.element.getBBox();

    const x = object.x + bbox.x * object.scale;
    const y = object.y + bbox.y * object.scale;
    const width = bbox.width * object.scale;
    const height = bbox.height * object.scale;

    return {
      left: x,
      top: y,
      right: x + width,
      bottom: y + height,
      centerX: x + width / 2,
      centerY: y + height / 2
    };
  }

  renderGuides(guides) {
    this.clearGuides();

    if (guides.length === 0) return;

    this.guideGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    this.guideGroup.classList.add("smart-guides");

    guides.forEach(guide => {

        

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      if (guide.type === "spacing-horizontal") {
  line.classList.add("spacing-guide");

  line.setAttribute("x1", guide.x1);
  line.setAttribute("x2", guide.x2);
  line.setAttribute("y1", guide.y);
  line.setAttribute("y2", guide.y);
}

if (guide.type === "spacing-vertical") {
  line.classList.add("spacing-guide");

  line.setAttribute("x1", guide.x);
  line.setAttribute("x2", guide.x);
  line.setAttribute("y1", guide.y1);
  line.setAttribute("y2", guide.y2);
}

      if (guide.type === "vertical") {
        line.setAttribute("x1", guide.x);
        line.setAttribute("x2", guide.x);
        line.setAttribute("y1", 0);
        line.setAttribute("y2", 700);
      }

      if (guide.type === "horizontal") {
        line.setAttribute("x1", 0);
        line.setAttribute("x2", 1000);
        line.setAttribute("y1", guide.y);
        line.setAttribute("y2", guide.y);
      }

      this.guideGroup.appendChild(line);
    });

    this.canvas.appendChild(this.guideGroup);
  }

  clearGuides() {
    if (this.guideGroup) {
      this.guideGroup.remove();
      this.guideGroup = null;
    }
  }

snapBox(selectionBox, ignoredIds = []) {
  if (!this.enabled) {
    this.clearGuides();
    return { dx: 0, dy: 0 };
  }

  const ignored = new Set(ignoredIds);

  const others = this.objectStore
    .getAll()
    .filter(other =>
      !ignored.has(other.id) &&
      other.visible &&
      other.element
    );

  let dx = 0;
  let dy = 0;
  const guides = [];

  let hasVerticalEdgeGuide = false;
  let hasHorizontalEdgeGuide = false;

  for (const other of others) {
    const otherBox = this.getObjectBox(other);

    const xMatches = [
      { moving: selectionBox.left, other: otherBox.left },
      { moving: selectionBox.centerX, other: otherBox.centerX },
      { moving: selectionBox.right, other: otherBox.right }
    ];

    const yMatches = [
      { moving: selectionBox.top, other: otherBox.top },
      { moving: selectionBox.centerY, other: otherBox.centerY },
      { moving: selectionBox.bottom, other: otherBox.bottom }
    ];

    if (!hasVerticalEdgeGuide) {
      for (const match of xMatches) {
        const diff = match.other - match.moving;

        if (Math.abs(diff) <= this.threshold) {
          dx = diff;
          hasVerticalEdgeGuide = true;

          guides.push({
            type: "vertical",
            x: match.other
          });

          break;
        }
      }
    }

    if (!hasHorizontalEdgeGuide) {
      for (const match of yMatches) {
        const diff = match.other - match.moving;

        if (Math.abs(diff) <= this.threshold) {
          dy = diff;
          hasHorizontalEdgeGuide = true;

          guides.push({
            type: "horizontal",
            y: match.other
          });

          break;
        }
      }
    }

    if (hasVerticalEdgeGuide && hasHorizontalEdgeGuide) {
      break;
    }
  }

  if (!hasVerticalEdgeGuide) {
    const horizontalSpacingSnap =
      this.findHorizontalSpacingSnap(selectionBox, ignoredIds);

    if (horizontalSpacingSnap) {
      dx += horizontalSpacingSnap.dx;
      guides.push(...horizontalSpacingSnap.guides);
    }
  }

  if (!hasHorizontalEdgeGuide) {
    const verticalSpacingSnap =
      this.findVerticalSpacingSnap(selectionBox, ignoredIds);

    if (verticalSpacingSnap) {
      dy += verticalSpacingSnap.dy;
      guides.push(...verticalSpacingSnap.guides);
    }
  }

  this.renderGuides(guides);

  return { dx, dy };
}

createBoxFromObjects(objects) {
  const boxes = objects.map(object => this.getObjectBox(object));

  const left = Math.min(...boxes.map(box => box.left));
  const right = Math.max(...boxes.map(box => box.right));
  const top = Math.min(...boxes.map(box => box.top));
  const bottom = Math.max(...boxes.map(box => box.bottom));

  return {
    left,
    right,
    top,
    bottom,
    centerX: left + (right - left) / 2,
    centerY: top + (bottom - top) / 2
  };
}

toggle() {
  this.enabled = !this.enabled;

  if (!this.enabled) {
    this.clearGuides();
  }

  return this.enabled;
}

isEnabled() {
  return this.enabled;
}

findHorizontalSpacingSnap(selectionBox, ignoredIds = []) {
  const ignored = new Set(ignoredIds);

  const others = this.objectStore
    .getAll()
    .filter(object =>
      !ignored.has(object.id) &&
      object.visible &&
      object.element
    )
    .map(object => this.getObjectBox(object))
    .sort((a, b) => a.left - b.left);

  if (others.length < 2) return null;

  for (let i = 0; i < others.length - 1; i++) {
    const leftBox = others[i];
    const rightBox = others[i + 1];

    const referenceGap = rightBox.left - leftBox.right;
    if (referenceGap < 0) continue;

    const movingGap = selectionBox.left - rightBox.right;
    const diff = referenceGap - movingGap;

    if (Math.abs(diff) <= this.threshold) {
      return {
        dx: diff,
        guides: [
          {
            type: "spacing-horizontal",
            x1: leftBox.right,
            x2: rightBox.left,
            y: Math.max(leftBox.bottom, rightBox.bottom) + 18
          },
          {
            type: "spacing-horizontal",
            x1: rightBox.right,
            x2: selectionBox.left + diff,
            y: Math.max(rightBox.bottom, selectionBox.bottom) + 18
          }
        ]
      };
    }
  }

  return null;
}

findVerticalSpacingSnap(selectionBox, ignoredIds = []) {
  const ignored = new Set(ignoredIds);

  const others = this.objectStore
    .getAll()
    .filter(object =>
      !ignored.has(object.id) &&
      object.visible &&
      object.element
    )
    .map(object => this.getObjectBox(object))
    .sort((a, b) => a.top - b.top);

  if (others.length < 2) return null;

  for (let i = 0; i < others.length - 1; i++) {
    const topBox = others[i];
    const bottomBox = others[i + 1];

    const referenceGap = bottomBox.top - topBox.bottom;
    if (referenceGap < 0) continue;

    const movingGap = selectionBox.top - bottomBox.bottom;
    const diff = referenceGap - movingGap;

    if (Math.abs(diff) <= this.threshold) {
      return {
        dy: diff,
        guides: [
          {
            type: "spacing-vertical",
            y1: topBox.bottom,
            y2: bottomBox.top,
            x: Math.max(topBox.right, bottomBox.right) + 18
          },
          {
            type: "spacing-vertical",
            y1: bottomBox.bottom,
            y2: selectionBox.top + diff,
            x: Math.max(bottomBox.right, selectionBox.right) + 18
          }
        ]
      };
    }
  }

  return null;
}

setThreshold(value) {
  this.threshold = value;
}

getThreshold() {
  return this.threshold;
}
}

