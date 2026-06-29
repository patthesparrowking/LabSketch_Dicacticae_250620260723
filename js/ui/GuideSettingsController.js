export class GuideSettingsController {
  constructor({ canvasController, smartGuideController }) {
    this.canvasController = canvasController;
    this.smartGuideController = smartGuideController;

    this.guideThresholdSelect =
      document.getElementById("guideThresholdSelect");

    this.gridSizeSelect =
      document.getElementById("gridSizeSelect");

    this.init();
  }

  init() {
    this.guideThresholdSelect?.addEventListener("change", event => {
      this.smartGuideController.setThreshold(
        Number(event.target.value)
      );
    });

    this.gridSizeSelect?.addEventListener("change", event => {
      this.canvasController.setGridSize(
        Number(event.target.value)
      );
    });
  }
}