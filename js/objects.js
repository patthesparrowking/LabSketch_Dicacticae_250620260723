import { svgLibrary } from "./library.js";

export async function createObject(type) {

  // Textobjekt wird intern erzeugt
  if (type === "label") {
    return createLabel();
  }

  // SVG-Objekt in Bibliothek suchen
  const item = svgLibrary.find(entry => entry.id === type);

  if (item) {
    return await createExternalSvg(item.path);
  }

  console.warn(`Objekttyp '${type}' nicht gefunden.`);
  return null;
}

async function createExternalSvg(path) {

  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`SVG konnte nicht geladen werden: ${path}`);
  }

  const svgText = await response.text();

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(
    svgText,
    "image/svg+xml"
  );

  const originalSvg = svgDoc.documentElement;

  const wrapper = createSvgElement("g");

  // Alle Elemente des SVG in eine Gruppe übernehmen
  Array.from(originalSvg.children).forEach(child => {
    wrapper.appendChild(
      document.importNode(child, true)
    );
  });

  return wrapper;
}

function createLabel() {

  const text = createSvgElement("text");

  text.textContent = "Beschriftung";

  text.setAttribute("x", "0");
  text.setAttribute("y", "0");

  text.setAttribute("font-size", "32");
  text.setAttribute("font-family", "Arial");
  text.setAttribute("fill", "#18331f");

  return text;
}

function createSvgElement(tagName) {
  return document.createElementNS(
    "http://www.w3.org/2000/svg",
    tagName
  );
}