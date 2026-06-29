export class ToolManager {
  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.tools = new Map();
    this.activeToolName = "select";
  }

  registerTool(name, tool) {
    this.tools.set(name, tool);
  }

activateTool(name) {
  if (this.activeToolName === name) {
    this.activateSelectTool();
    return;
  }

  this.tools.forEach((tool, toolName) => {
    tool.setActive(toolName === name);
  });

  this.activeToolName = name;

  document.getElementById("canvas").dataset.tool = name;

  this.eventBus.emit("tool:changed", {
    tool: this.activeToolName
  });
}

  activateSelectTool() {

    this.tools.forEach(tool => {
      tool.setActive(false);
    });

    this.activeToolName = "select";

        document.getElementById("canvas").dataset.tool = "select";

    this.eventBus.emit("tool:changed", {
      tool: "select"
    });
  }

  getActiveTool() {
    return this.activeToolName;
  }
}