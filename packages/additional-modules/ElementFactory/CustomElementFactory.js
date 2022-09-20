import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";

class CustomElementFactory extends ElementFactory {
  constructor(config, bpmnFactory, moddle, translate) {
    super(bpmnFactory, moddle, translate);
    this._config = config;
  }

  getDefaultSize(element, di) {
    const bo = getBusinessObject(element);
    const types = Object.keys(this._config || {});
    for (const type of types) {
      if (is(bo, type)) {
        return this._config[type];
      }
    }
    return super.getDefaultSize(element, di);
  }
}

CustomElementFactory.$inject = ["config.elementFactory", "bpmnFactory", "moddle", "translate"];

export default CustomElementFactory;
