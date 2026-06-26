import { getSelectedObject } from "./selection.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { updatePropertiesPanel } from "./properties.js";
import { updateStatusBar } from "./status.js";
import { saveHistoryState } from "./history.js";

export function toggleLockSelected() {
  const selected = getSelectedObject();
  if (!selected) return;

  selected.locked = !selected.locked;

  renderObject(selected);
  updatePropertiesPanel();
  updateStatusBar();
  saveHistoryState();
}