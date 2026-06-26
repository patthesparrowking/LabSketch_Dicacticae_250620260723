import { canvas } from "./canvas.js";
import { clearSelection } from "./selection.js";

export function exportSvg() {
  clearSelection();

  const clonedCanvas = canvas.cloneNode(true);

  clonedCanvas.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clonedCanvas.setAttribute("width", "1000");
  clonedCanvas.setAttribute("height", "700");

  const grid = clonedCanvas.querySelector("#grid");
  if (grid) grid.remove();

  clonedCanvas.querySelectorAll(".selected").forEach(el => {
    el.classList.remove("selected");
  });

  const svgText = new XMLSerializer().serializeToString(clonedCanvas);

  const blob = new Blob([svgText], {
    type: "image/svg+xml;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "labsketch-export.svg";
  link.click();

  URL.revokeObjectURL(url);
}