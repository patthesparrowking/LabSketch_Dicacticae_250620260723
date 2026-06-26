export function initUiControls() {
  const toggleAssetsBtn = document.getElementById("toggleAssetsBtn");
  const togglePropertiesBtn = document.getElementById("togglePropertiesBtn");

  const mobileAssetsBtn = document.getElementById("mobileAssetsBtn");
  const mobilePropertiesBtn = document.getElementById("mobilePropertiesBtn");
  const mobileLayersBtn = document.getElementById("mobileLayersBtn");
  const mobileExportBtn = document.getElementById("mobileExportBtn");
  const mobileOverlay = document.getElementById("mobileOverlay");

  const assetPanel = document.querySelector(".asset-panel");
  const propertiesPanel = document.querySelector(".properties-panel");
  const mobileExportPanel = document.getElementById("mobileExportPanel");

  const mobileSaveProjectBtn = document.getElementById("mobileSaveProjectBtn");
  const mobileLoadProjectBtn = document.getElementById("mobileLoadProjectBtn");
  const mobileExportSvgBtn = document.getElementById("mobileExportSvgBtn");
  const mobileExportPngBtn = document.getElementById("mobileExportPngBtn");

  const mobileMoreToolsBtn = document.getElementById("mobileMoreToolsBtn");
const mobileToolsPanel = document.getElementById("mobileToolsPanel");

  toggleAssetsBtn?.addEventListener("click", () => {
    assetPanel.classList.toggle("is-hidden");
  });

  togglePropertiesBtn?.addEventListener("click", () => {
    propertiesPanel.classList.toggle("is-hidden");
  });

  mobileAssetsBtn?.addEventListener("click", () => {
    openMobilePanel("assets");
  });

  mobilePropertiesBtn?.addEventListener("click", () => {
    openMobilePanel("properties");
  });

  mobileLayersBtn?.addEventListener("click", () => {
    openMobilePanel("layers");
  });

  mobileExportBtn?.addEventListener("click", () => {
    openMobilePanel("export");
  });

  mobileSaveProjectBtn?.addEventListener("click", () => {
    document.getElementById("saveProjectBtn")?.click();
    closeMobilePanels();
  });

  mobileLoadProjectBtn?.addEventListener("click", () => {
    document.getElementById("loadProjectBtn")?.click();
    closeMobilePanels();
  });

  mobileExportSvgBtn?.addEventListener("click", () => {
    document.getElementById("exportSvgBtn")?.click();
    closeMobilePanels();
  });

  mobileExportPngBtn?.addEventListener("click", () => {
    document.getElementById("exportPngBtn")?.click();
    closeMobilePanels();
  });

  mobileOverlay?.addEventListener("click", closeMobilePanels);

  mobileMoreToolsBtn?.addEventListener("click", () => {
  openMobilePanel("tools");
});

  document.querySelectorAll("[data-close-sheet]").forEach(button => {
    button.addEventListener("click", closeMobilePanels);
  });

  function openMobilePanel(panelName) {
    closeMobilePanels();

    mobileOverlay?.classList.add("is-visible");

    mobileAssetsBtn?.classList.remove("is-active");
    mobilePropertiesBtn?.classList.remove("is-active");
    mobileLayersBtn?.classList.remove("is-active");
    mobileExportBtn?.classList.remove("is-active");
    mobileMoreToolsBtn?.classList.remove("is-active");

    if (panelName === "tools") {
  mobileToolsPanel.classList.add("is-mobile-open");
  mobileMoreToolsBtn?.classList.add("is-active");
}

    if (panelName === "assets") {
      assetPanel.classList.add("is-mobile-open");
      mobileAssetsBtn?.classList.add("is-active");
    }

    if (panelName === "properties") {
      propertiesPanel.classList.add("is-mobile-open");
      propertiesPanel.classList.remove("show-layers");
      mobilePropertiesBtn?.classList.add("is-active");
    }

    if (panelName === "layers") {
      propertiesPanel.classList.add("is-mobile-open");
      propertiesPanel.classList.add("show-layers");
      mobileLayersBtn?.classList.add("is-active");
    }

    if (panelName === "export") {
      mobileExportPanel.classList.add("is-mobile-open");
      mobileExportBtn?.classList.add("is-active");
    }
  }

  function closeMobilePanels() {
    assetPanel?.classList.remove("is-mobile-open");
    propertiesPanel?.classList.remove("is-mobile-open");
    propertiesPanel?.classList.remove("show-layers");
    mobileExportPanel?.classList.remove("is-mobile-open");

    mobileOverlay?.classList.remove("is-visible");

    mobileAssetsBtn?.classList.remove("is-active");
    mobilePropertiesBtn?.classList.remove("is-active");
    mobileLayersBtn?.classList.remove("is-active");
    mobileExportBtn?.classList.remove("is-active");
    mobileToolsPanel?.classList.remove("is-mobile-open");
mobileMoreToolsBtn?.classList.remove("is-active");
  }
}