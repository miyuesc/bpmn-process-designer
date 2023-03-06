<template>
  <div :class="['bpmn-designer', bgClass]" ref="designerRef"></div>
</template>

<script>
import { debounce } from "min-dash";
import { mapGetters } from "vuex";
import { createNewDiagram } from "@utils/xml";
import { catchError } from "@utils/printCatch";
import moduleAndExtensions from "./moduleAndExtensions";
import initModeler from "./initModeler";

export default {
  name: "BpmnDesigner",
  props: {
    xml: {
      type: String,
      default: undefined
    },
    events: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(["getEditor", "getModeler", "getModeling"]),
    bgClass() {
      const bg = this.getEditor.bg;
      if (bg === "grid-image") return "designer-with-bg";
      if (bg === "image") return "designer-with-image";
      return "";
    }
  },
  methods: {
    reloadProcess: debounce(async function (setting, oldSetting) {
      const modelerModules = moduleAndExtensions(setting);

      await this.$nextTick();
      const modeler = initModeler(this.$refs.designerRef, modelerModules, this);
      if (!oldSetting || setting.processEngine !== oldSetting.processEngine) {
        await createNewDiagram(modeler);
      } else {
        await createNewDiagram(modeler, this.xml, setting);
      }
    }, 100)
  },
  watch: {
    getEditor: {
      immediate: true,
      deep: true,
      handler: async function (value, oldValue) {
        try {
          this.reloadProcess(value, oldValue);
        } catch (e) {
          catchError(e);
        }
      }
    }
  }
};
</script>
