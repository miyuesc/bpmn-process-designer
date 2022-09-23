import { is } from "bpmn-js/lib/util/ModelUtil";
import { isArray } from "min-dash";
import { getModeler } from "@packages/bpmn-utils/BpmnDesignerUtils";

/**
 * Get extension elements of business object. Optionally filter by type.
 */
export function getExtensionElementsList(businessObject, type) {
  const extensionElements = businessObject?.get("extensionElements");
  if (!extensionElements) return [];

  const values = extensionElements.get("values");
  if (!values || !values.length) return [];

  if (type) return values.filter((value) => is(value, type));

  return values;
}

/**
 * Add one or more extension elements. Create bpmn:ExtensionElements if it doesn't exist.
 */
export function addExtensionElements(element, businessObject, extensionElementToAdd) {
  const modeling = getModeler.get("modeling");
  let extensionElements = businessObject.get("extensionElements");

  // (1) create bpmn:ExtensionElements if it doesn't exist
  if (!extensionElements) {
    extensionElements = createModdleElement("bpmn:ExtensionElements", { values: [] }, businessObject);
    modeling.updateModdleProperties(element, businessObject, { extensionElements });
  }
  extensionElementToAdd.$parent = extensionElements;

  // (2) add extension element to list
  modeling.updateModdleProperties(element, extensionElements, {
    values: [...extensionElements.get("values"), extensionElementToAdd]
  });
}

/**
 * Remove one or more extension elements. Remove bpmn:ExtensionElements afterwards if it's empty.
 */
export function removeExtensionElements(element, businessObject, extensionElementsToRemove) {
  if (!isArray(extensionElementsToRemove)) {
    extensionElementsToRemove = [extensionElementsToRemove];
  }

  const extensionElements = businessObject.get("extensionElements"),
    values = extensionElements.get("values").filter((value) => !extensionElementsToRemove.includes(value));

  const modeling = getModeler.get("modeling");
  modeling.updateModdleProperties(element, extensionElements, { values });
}

/////////////
export function createModdleElement(elementType, properties, parent) {
  const moddle = getModeler.get("moddle");
  const element = moddle.create(elementType, properties);
  parent && (element.$parent = parent);
  return element;
}
