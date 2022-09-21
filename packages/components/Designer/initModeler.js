import Modeler from "bpmn-js/lib/Modeler";
import EventEmitter from "@utils/EventEmitter";
import { catchError } from "@utils/printCatch";

export default function (designerDom, moduleAndExtensions, context) {
  const options = {
    container: designerDom,
    additionalModules: moduleAndExtensions[0] || [],
    moddleExtensions: moduleAndExtensions[1] || {},
    ...moduleAndExtensions[2]
  };

  // 清除旧 modeler
  context.getModeler && context.getModeler.destroy();
  context.$store.commit("clearBpmnState");

  const modeler = new Modeler(options);

  context.$store.commit("setModeler", modeler);

  EventEmitter.emit("modeler-init", modeler);

  modeler.on("commandStack.changed", async (event) => {
    try {
      const { xml } = await modeler.saveXML({ format: true });

      context.$emit("update:xml", xml);
      context.$emit("command-stack-changed", event);
    } catch (error) {
      catchError(error);
    }
  });

  return modeler;
}
