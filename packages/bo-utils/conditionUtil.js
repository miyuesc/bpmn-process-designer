import { getBusinessObject, is, isAny } from "bpmn-js/lib/util/ModelUtil";
import { getEventDefinition } from "@packages/bpmn-utils/BpmnEventDefinition";
import { createModdleElement } from "@packages/bpmn-utils/BpmnExtensionElements";
import { getModeler, getProcessEngine } from "@packages/bpmn-utils/BpmnDesignerUtils";

///////////////////////////////// 配置项可见性
const CONDITIONAL_SOURCES = ["bpmn:Activity", "bpmn:ExclusiveGateway", "bpmn:InclusiveGateway", "bpmn:ComplexGateway"];
const defaultConditionTypeOptions = [
  { label: "无条件( None )", value: "none" },
  { label: "默认路径( Default )", value: "default" },
  { label: "条件表达式( Expression )", value: "expression" },
  { label: "条件脚本( Script )", value: "script" }
];
// 父节点符合条件的连线
export function isConditionalSource(element) {
  return isAny(element, CONDITIONAL_SOURCES);
}
// 是否是 定义条件的事件 （ 控制变量 Variables 配置 ）
export function isConditionEventDefinition(element) {
  return is(element, "bpmn:Event") && !!getEventDefinition(element, "bpmn:ConditionalEventDefinition");
}
export function isExtendStartEvent(element) {
  return is(element, "bpmn:StartEvent");
}
// 元素 是否符合 可以设置条件 的情况
export function isCanbeConditional(element) {
  return (
    (is(element, "bpmn:SequenceFlow") && isConditionalSource(element?.source)) || isConditionEventDefinition(element)
  );
}

///////////////////////////
// 1. 条件变量部分
export function getVariableNameValue(element) {
  if (getConditionalEventDefinition(element)) {
    return getConditionalEventDefinition(element).get("variableName");
  }
}
export function setVariableNameValue(element, value) {
  const modeling = getModeler.get("modeling");
  const eventDefinition = getConditionalEventDefinition(element);
  if (eventDefinition) {
    modeling.updateModdleProperties(element, eventDefinition, { variableName: value || "" });
  }
}

// 2. 条件事件部分
export function getVariableEventsValue(element) {
  if (getConditionalEventDefinition(element)) {
    return getConditionalEventDefinition(element).get("variableEvents");
  }
}
export function setVariableEventsValue(element, value) {
  const modeling = getModeler.get("modeling");
  const eventDefinition = getConditionalEventDefinition(element);
  if (eventDefinition) {
    modeling.updateModdleProperties(element, eventDefinition, { variableName: value || "" });
  }
}

// 3. 元素条件类型
export function getConditionTypeValue(element) {
  const conditionExpression = getConditionExpression(element);
  if (conditionExpression) {
    return conditionExpression.get("language") === undefined ? "expression" : "script";
  }
  if (element.source?.businessObject?.default === element.businessObject) return "default";
  return "none";
}
export function setConditionTypeValue(element, value) {
  if (!value || value === "none" || value === "default") {
    updateCondition(element);
    return setDefaultCondition(element, value === "default");
  }
  const attributes = {
    // body: '',
    language: value === "script" ? "" : undefined
  };
  const parent = is(element, "bpmn:SequenceFlow") ? getBusinessObject(element) : getConditionalEventDefinition(element);
  const formalExpressionElement = createModdleElement("bpmn:FormalExpression", attributes, parent);
  updateCondition(element, formalExpressionElement);
}

// 4. 元素条件表达式
export function getConditionExpressionValue(element) {
  const conditionExpression = getConditionExpression(element);
  if (conditionExpression) {
    return conditionExpression.get("body");
  }
}
export function setConditionExpressionValue(element, body) {
  const parent = is(element, "bpmn:SequenceFlow") ? getBusinessObject(element) : getConditionalEventDefinition(element);
  const formalExpressionElement = createModdleElement("bpmn:FormalExpression", { body }, parent);
  updateCondition(element, formalExpressionElement);
}

// 5. 元素脚本来源类型
export function getConditionScriptTypeValue(element) {
  const prefix = getProcessEngine();
  const conditionExpression = getConditionExpression(element);
  console.log(conditionExpression);
  if (conditionExpression.get("body") !== undefined) return "inline";
  if (conditionExpression.get(`${prefix}:resource`) !== undefined) return "external";
  return "none";
}
export function setConditionScriptTypeValue(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.get("modeling");
  let props;
  if (!value || value === "none") {
    props = { body: undefined, [`${prefix}:resource`]: undefined };
  }
  if (value === "inline") {
    props = { body: "", [`${prefix}:resource`]: undefined };
  }
  if (value === "external") {
    props = { body: undefined, [`${prefix}:resource`]: "" };
  }
  modeling.updateModdleProperties(element, getConditionExpression(element), props);
}

// 6. 元素脚本 语言类型
export function getConditionScriptLanguageValue(element) {
  return getConditionExpression(element)?.get("language");
}
export function setConditionScriptLanguageValue(element, value) {
  const modeling = getModeler.get("modeling");
  modeling.updateModdleProperties(element, getConditionExpression(element), { language: value });
}

// 7. 元素脚本 body
export function getConditionScriptBodyValue(element) {
  return getConditionExpression(element)?.get("body");
}
export function setConditionScriptBodyValue(element, value) {
  const modeling = getModeler.get("modeling");
  modeling.updateModdleProperties(element, getConditionExpression(element), { body: value });
}

// 8. 元素脚本 source
export function getConditionScriptResourceValue(element) {
  const prefix = getProcessEngine();
  return getConditionExpression(element)?.get(`${prefix}:resource`);
}
export function setConditionScriptResourceValue(element, value) {
  const modeling = getModeler.get("modeling");
  const prefix = getProcessEngine();
  modeling.updateModdleProperties(element, getConditionExpression(element), {
    [`${prefix}:resource`]: value
  });
}

///////// helpers
// 获取事件的条件定义
export function getConditionTypeOptions(element) {
  if (is(element, "bpmn:SequenceFlow")) {
    return defaultConditionTypeOptions;
  }
  return defaultConditionTypeOptions.filter((condition) => condition.value !== "default");
}
function getConditionalEventDefinition(element) {
  if (!is(element, "bpmn:Event")) return false;
  return getEventDefinition(element, "bpmn:ConditionalEventDefinition");
}
//获取给定元素的条件表达式的值
function getConditionExpression(element) {
  const businessObject = getBusinessObject(element);
  if (is(businessObject, "bpmn:SequenceFlow")) {
    return businessObject.get("conditionExpression");
  }
  if (getConditionalEventDefinition(businessObject)) {
    return getConditionalEventDefinition(businessObject).get("condition");
  }
}
//
function updateCondition(element, condition) {
  const modeling = getModeler.get("modeling");
  if (is(element, "bpmn:SequenceFlow")) {
    modeling.updateProperties(element, { conditionExpression: condition });
  } else {
    modeling.updateModdleProperties(element, getConditionalEventDefinition(element), { condition });
  }
}
//
function setDefaultCondition(element, isDefault) {
  const modeling = getModeler.get("modeling");
  modeling.updateProperties(element.source, { default: isDefault ? element : undefined });
}
