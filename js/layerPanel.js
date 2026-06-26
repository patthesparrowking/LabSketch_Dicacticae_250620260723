import { getAllObjects } from "./store/objectStore.js";
import { selectObject, getSelectedObject } from "./selection.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { updateStatusBar } from "./status.js";
import { saveHistoryState } from "./history.js";

const layersList = document.getElementById("layersList");

export function updateLayerPanel() {
  if (!layersList) return;

  layersList.innerHTML = "";

  const objects = getAllObjects().slice().reverse();
  const selected = getSelectedObject();

  objects.forEach(object => {
    const row = document.createElement("div");
    row.className = "layer-row";

    if (selected?.id === object.id) {
      row.classList.add("is-selected");
    }

    const nameButton = document.createElement("button");
    nameButton.className = "layer-name";
    nameButton.textContent = object.name || object.type;

    nameButton.addEventListener("click", () => {
      selectObject(object);
      updateLayerPanel();
    });

    const visibilityButton = document.createElement("button");
    visibilityButton.className = "layer-action";
    visibilityButton.textContent = object.visible ? "👁" : "—";
    visibilityButton.title = "Sichtbarkeit umschalten";

    visibilityButton.addEventListener("click", event => {
      event.stopPropagation();

      object.visible = !object.visible;
      renderObject(object);
      updateStatusBar();
      updateLayerPanel();
      saveHistoryState();
    });

    const lockButton = document.createElement("button");
    lockButton.className = "layer-action";
    lockButton.textContent = object.locked ? "🔒" : "🔓";
    lockButton.title = "Sperren/Entsperren";

    lockButton.addEventListener("click", event => {
      event.stopPropagation();

      object.locked = !object.locked;
      renderObject(object);
      updateStatusBar();
      updateLayerPanel();
      saveHistoryState();
    });

    row.appendChild(nameButton);
    row.appendChild(visibilityButton);
    row.appendChild(lockButton);

    layersList.appendChild(row);
  });
}