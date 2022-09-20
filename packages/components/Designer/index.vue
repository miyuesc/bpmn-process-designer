<template>
  <div class="bpmn-designer" ref="designerRef"></div>
</template>

<script>
import { mapGetters } from "vuex";
import moduleAndExtensions from "./moduleAndExtensions";
import initModeler from "./initModeler";
import { createNewDiagram } from "@utils/xml";

export default {
  name: "BpmnDesigner",
  props: {
    xml: {
      type: String,
      default: undefined
    }
  },
  computed: {
    ...mapGetters(["getEditor"])
  },
  watch: {
    getEditor: {
      immediate: true,
      deep: true,
      handler: async function (value, oldValue) {
        try {
          const modelerModules = moduleAndExtensions(value);

          await this.$nextTick();
          const modeler = initModeler(this.$refs.designerRef, modelerModules, this);
          if (!oldValue || value.processEngine !== oldValue.processEngine) {
            await createNewDiagram(modeler);
          } else {
            await createNewDiagram(modeler, this.xml, value);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
};
</script>
