import { canvas } from "./canvas.js";
import { clearSelection } from "./selection.js";

export function exportPng() {
  clearSelection();

  const clonedSvg = canvas.cloneNode(true);

  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clonedSvg.setAttribute("width", "1000");
  clonedSvg.setAttribute("height", "700");

  const grid = clonedSvg.querySelector("#grid");
  if (grid) grid.remove();

  clonedSvg.querySelectorAll(".selected").forEach(el => {
    el.classList.remove("selected");
  });

  const svgString = new XMLSerializer().serializeToString(clonedSvg);

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8"
  });

  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1000;
    exportCanvas.height = 700;

    const ctx = exportCanvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(image, 0, 0);

    exportCanvas.toBlob(blob => {
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "labsketch-export.png";
      downloadLink.click();

      URL.revokeObjectURL(downloadLink.href);
    }, "image/png");

    URL.revokeObjectURL(url);
  };

  image.src = url;
}