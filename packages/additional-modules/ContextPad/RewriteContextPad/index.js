import rewriteContextPadProvider from "./rewriteContextPadProvider";

const rewriteContextPad = {
  __init__: ["contextPadProvider"],
  contextPadProvider: ["type", rewriteContextPadProvider]
};

export default rewriteContextPad;
