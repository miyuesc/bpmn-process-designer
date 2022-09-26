import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { without } from "min-dash";
import { createModdleElement, getExtensionElementsList } from "@packages/bpmn-utils/BpmnExtensionElements";
import { getModeler, getProcessEngine } from "@packages/bpmn-utils/BpmnDesignerUtils";

/////// 功能函数
export function getExtensionProperties(element) {
  const businessObject = getRelevantBusinessObject(element);

  if (!businessObject) return [];
  return getPropertiesList(businessObject) || [];
}

export function addExtensionProperty(element, property) {
  try {
    const modeling = getModeler.getModeling();
    const prefix = getProcessEngine();

    const businessObject = getRelevantBusinessObject(element);

    // 判断 extensionElements
    let extensionElements = businessObject.get("extensionElements");
    if (!extensionElements) {
      extensionElements = createModdleElement("bpmn:ExtensionElements", { values: [] }, businessObject);
      modeling.updateModdleProperties(element, businessObject, { extensionElements });
    }
    // 判断 extensionElements 是否有 properties
    let properties = getProperties(businessObject);
    if (!properties) {
      properties = createModdleElement(`${prefix}:Properties`, { values: [] }, extensionElements);
      modeling.updateModdleProperties(element, extensionElements, {
        values: [...extensionElements.get("values"), properties]
      });
    }
    // 创建新属性并添加
    const newProperty = createModdleElement(`${prefix}:Property`, property, properties);
    modeling.updateModdleProperties(element, properties, {
      values: [...properties?.get("values"), newProperty]
    });
  } catch (e) {
    console.log(e);
  }
}

export function removeExtensionProperty(element, property) {
  const businessObject = getRelevantBusinessObject(element);
  const extensionElements = businessObject.get("extensionElements");
  const properties = getProperties(businessObject);
  if (!properties) return;

  const modeling = getModeler.getModeling();

  const values = without(properties.get("values"), property);
  modeling.updateModdleProperties(element, properties, { values });

  if (!values || !values.length) {
    modeling.updateModdleProperties(element, extensionElements, {
      values: without(extensionElements.get("values"), properties)
    });
  }
}

///// helpers
function getRelevantBusinessObject(element) {
  const businessObject = getBusinessObject(element);
  if (is(element, "bpmn:Participant")) {
    return businessObject.get("processRef");
  }
  return businessObject;
}
function getPropertiesList(bo) {
  const properties = getProperties(bo);
  return properties && properties.get("values");
}
function getProperties(bo) {
  return getExtensionElementsList(bo)[0];
}
