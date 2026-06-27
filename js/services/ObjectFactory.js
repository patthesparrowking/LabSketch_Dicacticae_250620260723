import { LabObject } from "../models/LabObject.js";

export class ObjectFactory {
  constructor(libraryService) {
    this.libraryService = libraryService;
  }

  async createFromLibraryItem(itemId, options = {}) {
    const item = this.libraryService.findById(itemId);

    if (!item) {
      throw new Error(`Bibliotheksobjekt nicht gefunden: ${itemId}`);
    }

    const svgContent =
      item.id === "label"
        ? ""
        : await this.libraryService.getSvgContent(item);

    return new LabObject({
      type: item.id,
      name: item.label,
      x: options.x ?? 350,
      y: options.y ?? 200,
      scale: options.scale ?? 1,
      rotation: options.rotation ?? 0,
      text: item.id === "label" ? "Beschriftung" : "",
      path: item.path || "",
      station: item.station || "",
      tags: item.tags || [],
      metadata: {
        svgContent
      }
    });
  }

  async recreateFromProjectData(data) {
    const svgContent =
      data.type === "label"
        ? ""
        : await this.loadSvgContentForProjectObject(data);

    return new LabObject({
      ...data,
      metadata: {
        ...(data.metadata || {}),
        svgContent
      }
    });
  }

  async loadSvgContentForProjectObject(data) {
    const item = this.libraryService.findById(data.type);

    if (item?.path) {
      return await this.libraryService.getSvgContent(item);
    }

    if (data.metadata?.svgContent) {
      return data.metadata.svgContent;
    }

    return "";
  }
}