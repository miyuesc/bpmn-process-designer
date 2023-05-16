import { catchError, catchWarning } from "./printCatch";

export function emptyXML(key, name) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  targetNamespace="http://bpmn.io/schema/bpmn"
  id="Definitions_0001">
  <bpmn:process id="${key}" name="${name}" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
}

export async function createNewDiagram(modeler, newXml, settings) {
  try {
    const timestamp = Date.now();
    const { processId, processName } = settings || {};
    const newId = processId ? processId : `Process_${timestamp}`;
    const newName = processName || `业务流程_${timestamp}`;
    const xmlString = newXml || emptyXML(newId, newName);
    console.log(xmlString);
    const { warnings } = await modeler.importXML(xmlString);
    if (warnings && warnings.length) {
      warnings.forEach(catchWarning);
    }
  } catch (e) {
    catchError(e);
  }
}
