import { getModeler } from "@packages/bpmn-utils/BpmnDesignerUtils";

export default function () {
  let replaceElement;
  let elementFactory;
  let create;

  function replaceAction(target, currentElement) {
    if (!replaceElement) {
      replaceElement = getModeler.get("bpmnReplace").replaceElement;
    }
    replaceElement(currentElement, target);
  }

  function appendAction(target, event) {
    if (!elementFactory) {
      elementFactory = getModeler.get("elementFactory");
    }
    if (!create) {
      create = getModeler.get("create");
    }
    const shape = elementFactory.createShape(target);
    if (target.isExpanded != null) {
      shape.businessObject.di.isExpanded = target.isExpanded;
    }
    setTimeout(() => create.start(event, shape), 30);
  }

  return {
    replaceAction,
    appendAction
  };
}
