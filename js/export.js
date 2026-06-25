import { canvas } from "./canvas.js";
import { clearSelection } from "./selection.js";

export function exportSvg() {
  clearSelection();

  const clonedCanvas = canvas.cloneNode(true);

  clonedCanvas.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clonedCanvas.setAttribute("width", "1000");
  clonedCanvas.setAttribute("height", "700");

  const svgText = new XMLSerializer().serializeToString(clonedCanvas);
  const svgBlob = new Blob([svgText], {
    type: "image/svg+xml;charset=utf-8"
  });

  const url = URL.createObjectURL(svgBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "labsketch-export.svg";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(url);
}