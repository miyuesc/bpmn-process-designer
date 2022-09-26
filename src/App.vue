<template>
  <div id="app">
    <bpmn-toolbar v-if="getEditorConfig.toolbar" />
    <div class="main-content">
      <bpmn-designer :xml.sync="xmlString" />
      <bpmn-panel v-if="getEditorConfig.penalMode === 'custom'" />
      <div v-else class="camunda-panel" id="camunda-panel"></div>
    </div>

    <bpmn-settings />
    <bpmn-context-menu />
  </div>
</template>

<script>
import BpmnDesigner from "../packages/components/Designer";
import BpmnSettings from "../packages/components/Settings";
import { mapGetters } from "vuex";
import BpmnToolbar from "../packages/components/Toolbar";
import BpmnContextMenu from "@packages/components/ContextMenu/ContextMenu";
import BpmnPanel from "@packages/components/Panel";
export default {
  name: "App",
  components: { BpmnPanel, BpmnContextMenu, BpmnToolbar, BpmnSettings, BpmnDesigner },
  data() {
    return {
      xmlString: undefined
    };
  },
  computed: {
    ...mapGetters(["getEditorConfig"])
  },
  mounted() {
    document.body.addEventListener("contextmenu", function (ev) {
      ev.preventDefault();
    });
  }
};
</script>
