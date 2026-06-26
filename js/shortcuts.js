import { getSelectedObject, clearSelection } from "./selection.js";
import { removeObject } from "./store/objectStore.js";
import { scaleSelected, rotateSelected } from "./transform.js";
import { duplicateSelected } from "./layers.js";
import { undo, redo, saveHistoryState } from "./history.js";
import { toggleLockSelected } from "./lock.js";
import { toggleVisibilitySelected } from "./visibility.js";

export function initShortcuts() {
  document.addEventListener("keydown", async event => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();

    if (activeTag === "input" || activeTag === "textarea") {
      return;
    }

    const selected = getSelectedObject();

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      await undo();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
      event.preventDefault();
      await redo();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
      event.preventDefault();
      await duplicateSelected();
      return;
    }

    if ((event.key === "Delete" || event.key === "Backspace") && selected) {
      event.preventDefault();
      removeObject(selected.id);
      clearSelection();
      saveHistoryState();
      return;
    }

    if (event.key.toLowerCase() === "v" && selected) {
  event.preventDefault();
  toggleVisibilitySelected();
  return;
}

    if (event.key === "+") {
      event.preventDefault();
      scaleSelected(0.1);
      return;
    }

    if (event.key === "-") {
      event.preventDefault();
      scaleSelected(-0.1);
      return;
    }

    if (event.key.toLowerCase() === "l" && selected) {
  event.preventDefault();
  toggleLockSelected();
  return;
}

    if (event.key.toLowerCase() === "r" && selected) {
      event.preventDefault();

      if (event.shiftKey) {
        rotateSelected(-15);
      } else {
        rotateSelected(15);
      }
    }
  });
}