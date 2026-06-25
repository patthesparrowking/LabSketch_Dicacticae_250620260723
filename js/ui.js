export function initUiControls() {
  const toggleAssetsBtn = document.getElementById("toggleAssetsBtn");
  const togglePropertiesBtn = document.getElementById("togglePropertiesBtn");

  const assetPanel = document.querySelector(".asset-panel");
  const propertiesPanel = document.querySelector(".properties-panel");

  toggleAssetsBtn.addEventListener("click", () => {
    assetPanel.classList.toggle("is-hidden");
  });

  togglePropertiesBtn.addEventListener("click", () => {
    propertiesPanel.classList.toggle("is-hidden");
  });
}