import { without } from "min-dash";
import { getModeler } from "@packages/bpmn-utils/BpmnDesignerUtils";

export function getDocumentValue(element) {
  const businessObject = element?.businessObject;
  const documentation = businessObject && findDocumentation(businessObject.get("documentation"));
  return documentation && documentation.text;
}

export function setDocumentValue(element, value) {
  const modeling = getModeler.get("modeling");
  const bpmnFactory = getModeler.get("bpmnFactory");

  const businessObject = element.businessObject;
  const documentation = findDocumentation(businessObject && businessObject.get("documentation"));
  // (1) 更新或者移除 原有 documentation
  if (documentation) {
    if (value) {
      return modeling.updateModdleProperties(element, documentation, { text: value });
    } else {
      return modeling.updateModdleProperties(element, businessObject, {
        documentation: without(businessObject.get("documentation"), documentation)
      });
    }
  }
  // (2) 创建新的 documentation
  if (value) {
    const newDocumentation = bpmnFactory?.create("bpmn:Documentation", {
      text: value
    });
    return modeling.updateModdleProperties(element, businessObject, {
      documentation: [...businessObject.get("documentation"), newDocumentation]
    });
  }
}

//////////// helpers

const DOCUMENTATION_TEXT_FORMAT = "text/plain";

function findDocumentation(docs) {
  return docs.find(function (d) {
    return (d.textFormat || DOCUMENTATION_TEXT_FORMAT) === DOCUMENTATION_TEXT_FORMAT;
  });
}
