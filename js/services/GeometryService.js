export class GeometryService {
  constructor(canvas) {
    this.canvas = canvas;
  }

  getObjectBounds(object) {
    if (!object?.element) return null;

    const bbox = object.element.getBBox();
    const matrix = object.element.getCTM();

    if (!matrix) return null;

    const points = [
      this.transformPoint(bbox.x, bbox.y, matrix),
      this.transformPoint(bbox.x + bbox.width, bbox.y, matrix),
      this.transformPoint(bbox.x + bbox.width, bbox.y + bbox.height, matrix),
      this.transformPoint(bbox.x, bbox.y + bbox.height, matrix)
    ];

    const xs = points.map(point => point.x);
    const ys = points.map(point => point.y);

    const left = Math.min(...xs);
    const right = Math.max(...xs);
    const top = Math.min(...ys);
    const bottom = Math.max(...ys);

    return {
      left,
      right,
      top,
      bottom,
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
      centerX: left + (right - left) / 2,
      centerY: top + (bottom - top) / 2
    };
  }

  getSelectionBounds(objects) {
    const boxes = objects
      .map(object => this.getObjectBounds(object))
      .filter(Boolean);

    if (boxes.length === 0) return null;

    const left = Math.min(...boxes.map(box => box.left));
    const right = Math.max(...boxes.map(box => box.right));
    const top = Math.min(...boxes.map(box => box.top));
    const bottom = Math.max(...boxes.map(box => box.bottom));

    return {
      left,
      right,
      top,
      bottom,
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
      centerX: left + (right - left) / 2,
      centerY: top + (bottom - top) / 2
    };
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

  transformPoint(x, y, matrix) {
    const point = this.canvas.createSVGPoint();

    point.x = x;
    point.y = y;

    return point.matrixTransform(matrix);
  }
}