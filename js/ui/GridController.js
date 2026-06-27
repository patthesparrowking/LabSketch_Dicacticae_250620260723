export class GridController {
  constructor({ canvasController, eventBus }) {
    this.canvasController = canvasController;
    this.eventBus = eventBus;

    this.gridVisible = true;
    this.snapEnabled = true;

    this.gridElement = document.getElementById("grid");

    this.gridButtons = [
      document.getElementById("toggleGridBtn"),
      document.getElementById("mobileGridBtn")
    ];

    this.snapButtons = [
      document.getElementById("toggleSnapBtn"),
      document.getElementById("mobileSnapBtn")
    ];

    this.init();
  }

  init() {
    this.gridButtons.forEach(button => {
      button?.addEventListener("click", () => this.toggleGrid());
    });

    this.snapButtons.forEach(button => {
      button?.addEventListener("click", () => this.toggleSnap());
    });

    this.updateUi();
  }

  toggleGrid() {
    this.gridVisible = !this.gridVisible;
    this.updateUi();

    this.eventBus.emit("grid:changed", {
      visible: this.gridVisible
    });
  }

  toggleSnap() {
    this.snapEnabled = !this.snapEnabled;
    this.canvasController.setSnapEnabled(this.snapEnabled);
    this.updateUi();

    this.eventBus.emit("snap:changed", {
      enabled: this.snapEnabled
    });
  }

  updateUi() {
    if (this.gridElement) {
      this.gridElement.style.display = this.gridVisible ? "block" : "none";
    }

    this.gridButtons.forEach(button => {
      button?.classList.toggle("is-active", this.gridVisible);
    });

    this.snapButtons.forEach(button => {
      button?.classList.toggle("is-active", this.snapEnabled);
    });
  }

  getGridVisible() {
    return this.gridVisible;
  }

  getSnapEnabled() {
    return this.snapEnabled;
  }
}