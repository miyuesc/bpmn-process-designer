import Modeler from "bpmn-js/lib/Modeler";
import EventEmitter from "@utils/EventEmitter";

export default function (designerDom, moduleAndExtensions, context) {
  const options = {
    container: designerDom,
    additionalModules: moduleAndExtensions[0] || [],
    moddleExtensions: moduleAndExtensions[1] || {},
    ...moduleAndExtensions[2]
  };

  // 清除旧 modeler
  context.getModeler && context.getModeler.destroy();
  context.$store.commit("setModeler", null);

  const modeler = new Modeler(options);

  context.$store.commit("setModeler", modeler);
  context.$store.commit("setModules", { key: "modeling", module: modeler.get("modeling") });
  context.$store.commit("setModules", { key: "canvas", module: modeler.get("canvas") });
  context.$store.commit("setModules", { key: "eventBus", module: modeler.get("eventBus") });
  context.$store.commit("setModules", { key: "moddle", module: modeler.get("moddle") });
  context.$store.commit("setModules", { key: "elementRegistry", module: modeler.get("elementRegistry") });

  EventEmitter.emit("modeler-init", modeler);

  modeler.on("commandStack.changed", async (event) => {
    try {
      const { xml } = await modeler.saveXML({ format: true });

      context.$emit("update:xml", xml);
      context.$emit("command-stack-changed", event);
    } catch (error) {
      console.error(error);
    }
  });

  return modeler;
}
