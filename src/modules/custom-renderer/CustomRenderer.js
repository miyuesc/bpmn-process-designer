import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";

export default function CustomRenderer(eventBus, styles, pathMap, canvas, textRenderer) {
  const config = {
    defaultFillColor: "",
    defaultStrokeColor: "#8b238f",
    defaultLabelColor: "#2dd257"
  };
  BpmnRenderer.call(this, config, eventBus, styles, pathMap, canvas, textRenderer, 2000);
}

CustomRenderer.$inject = ["eventBus", "styles", "pathMap", "canvas", "textRenderer"];

const F = function() {}; // 核心，利用空对象作为中介；
F.prototype = BpmnRenderer.prototype; // 核心，将父类的原型赋值给空对象F；
CustomRenderer.prototype = new F(); // 核心，将 F的实例赋值给子类；
CustomRenderer.prototype.constructor = CustomRenderer; // 修复子类CustomRenderer的构造器指向，防止原型链的混乱；
