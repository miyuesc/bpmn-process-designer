<template>
  <div id="app">
    <bpmn-toolbar v-if="getEditorConfig.toolbar" />
    <bpmn-designer :xml.sync="xmlString" />
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
export default {
  name: "App",
  components: { BpmnContextMenu, BpmnToolbar, BpmnSettings, BpmnDesigner },
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

<style lang="scss">
body,
html {
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
</style>
