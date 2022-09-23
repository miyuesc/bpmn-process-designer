import { getModeler, getProcessEngine } from "@packages/bpmn-utils/BpmnDesignerUtils";

export function createScript(props) {
  const prefix = getProcessEngine();
  const moddle = getModeler.getModdle();
  const { scriptFormat, value, resource } = props;

  return moddle.create(`${prefix}:Script`, { scriptFormat, value, resource });
}

export function getScriptType(script) {
  if (script.get("resource")) {
    return "External Resource";
  }
  if (script.get("value")) {
    return "Inline Script";
  }
  return "none";
}
