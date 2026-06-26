export class LabObject {
  constructor({
    type,
    name = "Objekt",
    x = 350,
    y = 200,
    scale = 1,
    rotation = 0,
    text = "",
    path = "",
    station = "",
    tags = []
  }) {
    this.id = crypto.randomUUID();

    this.type = type;
    this.name = name;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.rotation = rotation;

    this.text = text;
    this.path = path;
    this.station = station;
    this.tags = tags;

    this.locked = false;
    this.visible = true;

    this.element = null;
  }
}