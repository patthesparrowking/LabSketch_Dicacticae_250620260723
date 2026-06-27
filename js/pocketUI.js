export function initPocketUi() {
  const overlay = document.getElementById("pocketOverlay");
  const dockButtons = document.querySelectorAll("[data-pocket-panel]");

  const assetPanel = document.querySelector(".asset-panel");
  const propertiesPanel = document.querySelector(".properties-panel");

  dockButtons.forEach(button => {
    button.addEventListener("click", () => {
      const panel = button.dataset.pocketPanel;
      openPocketPanel(panel);
    });
  });

  overlay?.addEventListener("click", closePocketPanels);

  document.querySelectorAll("[data-close-sheet]").forEach(button => {
    button.addEventListener("click", closePocketPanels);
  });

  function openPocketPanel(panelName) {
    closePocketPanels();

    overlay?.classList.add("is-visible");

    dockButtons.forEach(button => {
      button.classList.toggle(
        "is-active",
        button.dataset.pocketPanel === panelName
      );
    });

    if (panelName === "assets") {
      assetPanel.classList.add("is-pocket-open");
    }

    if (panelName === "edit") {
      propertiesPanel.classList.add("is-pocket-open");
      propertiesPanel.classList.remove("show-layers");
    }

    if (panelName === "layers") {
      propertiesPanel.classList.add("is-pocket-open");
      propertiesPanel.classList.add("show-layers");
    }

    if (panelName === "more") {
      document.getElementById("pocketMoreSheet")?.classList.add("is-pocket-open");
    }
  }

  function closePocketPanels() {
    assetPanel?.classList.remove("is-pocket-open");
    propertiesPanel?.classList.remove("is-pocket-open");
    propertiesPanel?.classList.remove("show-layers");
    document.getElementById("pocketMoreSheet")?.classList.remove("is-pocket-open");

    overlay?.classList.remove("is-visible");

    dockButtons.forEach(button => {
      button.classList.remove("is-active");
    });
  }
}