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