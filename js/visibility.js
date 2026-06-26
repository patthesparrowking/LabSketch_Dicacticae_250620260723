import { getSelectedObject, clearSelection } from "./selection.js";
import { renderObject } from "./renderer/objectRenderer.js";
import { updateStatusBar } from "./status.js";
import { saveHistoryState } from "./history.js";

export function toggleVisibilitySelected() {
  const selected = getSelectedObject();
  if (!selected) return;

  selected.visible = !selected.visible;

  renderObject(selected);
  updateStatusBar();
  saveHistoryState();

  if (!selected.visible) {
    clearSelection();
  }
}