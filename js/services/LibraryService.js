import { svgLibrary } from "../data/library.js";

export class LibraryService {
  constructor() {
    this.items = svgLibrary;
    this.svgCache = new Map();
  }

  getAllItems() {
    return this.items;
  }

  findById(id) {
    return this.items.find(item => item.id === id) || null;
  }

  search(query = "") {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return this.items;
    }

    return this.items.filter(item => {
      const searchableText = [
        item.id,
        item.label,
        item.station,
        ...(item.tags || [])
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }

  async getSvgContent(item) {
    if (!item.path) return "";

    if (this.svgCache.has(item.path)) {
      return this.svgCache.get(item.path);
    }

    const response = await fetch(item.path);

    if (!response.ok) {
      throw new Error(`SVG konnte nicht geladen werden: ${item.path}`);
    }

    const svgText = await response.text();
    const svgContent = this.extractSvgContent(svgText);

    this.svgCache.set(item.path, svgContent);

    return svgContent;
  }

  extractSvgContent(svgText) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

    if (svgDoc.querySelector("parsererror")) {
      throw new Error("Ungültige SVG-Datei.");
    }

    const svg = svgDoc.documentElement;

    return Array.from(svg.children)
      .map(child => new XMLSerializer().serializeToString(child))
      .join("\n");
  }
}