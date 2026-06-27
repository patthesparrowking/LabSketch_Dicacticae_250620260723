import { getObjectByElement } from "./store/ObjectStore.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { updatePropertiesPanel } from "./properties.js";
import { updateStatusBar } from "./status.js";

export function makeTextEditable(textElement) {
  textElement.addEventListener("dblclick", event => {
    event.stopPropagation();

    const object = getObjectByElement(textElement);
    if (!object || object.locked || object.type !== "label") return;

    const oldText = object.text || textElement.textContent || "Beschriftung";
    const newText = prompt("Beschriftung ändern:", oldText);

    if (newText === null) return;

    object.text = newText.trim() || oldText;

    renderObject(object);
    updatePropertiesPanel();
    updateStatusBar();
  });
}