export class LabObject {
  constructor({
    id = crypto.randomUUID(),
    type,
    name = "Objekt",
    x = 350,
    y = 200,
    scale = 1,
    rotation = 0,
    visible = true,
    locked = false,
    text = "",
    path = "",
    station = "",
    tags = [],
    groupId = null,
    x2 = 500,
y2 = 300,
strokeWidth = 3,
strokeColor = "#18331f",
arrowEnd = false,
anchorPoints = [],
startAnchorRef = null,
endAnchorRef = null,
strokeDasharray = "",
lineStyle = "solid",
    metadata = {}
  }) {
    this.id = id;
    this.type = type;
    this.name = name;

    this.x = x;
    this.y = y;
    this.scale = scale;
    this.rotation = rotation;

    this.visible = visible;
    this.locked = locked;

    this.text = text;
    this.path = path;
    this.station = station;
    this.tags = tags;
    this.groupId = groupId;
    this.x2 = x2;
this.y2 = y2;
this.strokeWidth = strokeWidth;
this.strokeColor = strokeColor;
this.arrowEnd = arrowEnd;
this.anchorPoints = anchorPoints;
this.startAnchorRef = startAnchorRef;
this.endAnchorRef = endAnchorRef;
this.strokeDasharray = strokeDasharray;
this.lineStyle = lineStyle;
    this.metadata = metadata;

    this.element = null;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      x: this.x,
      y: this.y,
      scale: this.scale,
      rotation: this.rotation,
      visible: this.visible,
      locked: this.locked,
      text: this.text,
      path: this.path,
      station: this.station,
      tags: this.tags,
      groupId: this.groupId,
      x2: this.x2,
y2: this.y2,
strokeWidth: this.strokeWidth,
strokeColor: this.strokeColor,
arrowEnd: this.arrowEnd,
anchorPoints: this.anchorPoints,
startAnchorRef: this.startAnchorRef,
endAnchorRef: this.endAnchorRef,
strokeDasharray: this.strokeDasharray,
lineStyle: this.lineStyle,
      metadata: this.metadata
    };
  }

  clone(overrides = {}) {
    return new LabObject({
      ...this.toJSON(),
      id: crypto.randomUUID(),
      x: this.x + 30,
      y: this.y + 30,
      ...overrides
    });
  }
}