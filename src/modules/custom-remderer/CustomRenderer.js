import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";

export default function CustomRenderer(config, eventBus, styles, pathMap, canvas, textRenderer) {
  BpmnRenderer.call(this, config, eventBus, styles, pathMap, canvas, textRenderer, 2000);
  this.handlers["label"] = function() {
    return null;
  };
}

CustomRenderer.prototype = BpmnRenderer.prototype;
