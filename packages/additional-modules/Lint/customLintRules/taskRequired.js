const { is, isAny } = require("bpmnlint-utils");

module.exports = function () {
  function hasStartEvent(node) {
    const flowElements = node.flowElements || [];

    return flowElements.some((node) => is(node, "bpmn:Task"));
  }

  function check(node, reporter) {
    if (!isAny(node, ["bpmn:Process", "bpmn:SubProcess"])) {
      return;
    }

    if (!hasStartEvent(node)) {
      const type = is(node, "bpmn:SubProcess") ? "Sub process" : "Process";

      reporter.report(node.id, type + " is missing task node");
    }
  }

  return { check };
};
