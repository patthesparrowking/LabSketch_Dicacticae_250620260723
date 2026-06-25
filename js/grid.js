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
  if (!grid) return;

  grid.style.display = gridVisible ? "block" : "none";
}

export function toggleSnap() {
  snapEnabled = !snapEnabled;
}