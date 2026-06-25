import { updateStatusBar } from "./status.js";

export let snapEnabled = true;
export let gridVisible = true;

const GRID_SIZE = 25;

export function snapValue(value) {
  if (!snapEnabled) return value;
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function toggleGrid() {
  gridVisible = !gridVisible;

  const grid = document.getElementById("grid");
  if (grid) {
    grid.style.display = gridVisible ? "block" : "none";
  }

  const button = document.getElementById("toggleGridBtn");
  if (button) {
    button.classList.toggle("is-active", gridVisible);
  }

  updateStatusBar();
}

export function toggleSnap() {
  snapEnabled = !snapEnabled;

  const button = document.getElementById("toggleSnapBtn");
  if (button) {
    button.classList.toggle("is-active", snapEnabled);
  }

  updateStatusBar();
}

export function initGridUi() {
  const gridButton = document.getElementById("toggleGridBtn");
  const snapButton = document.getElementById("toggleSnapBtn");

  if (gridButton) gridButton.classList.toggle("is-active", gridVisible);
  if (snapButton) snapButton.classList.toggle("is-active", snapEnabled);

  updateStatusBar();
}