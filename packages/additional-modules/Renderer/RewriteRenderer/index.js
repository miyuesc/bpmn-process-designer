import RewriteRenderer from "./RewriteRenderer";

const rewriteRenderer = {
  __init__: ["bpmnRenderer"],
  bpmnRenderer: ["type", RewriteRenderer]
};

export default rewriteRenderer;
