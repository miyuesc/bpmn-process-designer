<template>
  <el-button type="primary" @click="openImportWindow">
    打开文件
    <input type="file" ref="importRef" style="display: none" accept=".xml,.bpmn" @change="changeImportFile" />
  </el-button>
</template>

<script>
import { catchError } from "@utils/printCatch";
import { getModeler } from "@packages/bpmn-utils/BpmnDesignerUtils";

export default {
  name: "BpmnImport",
  methods: {
    openImportWindow() {
      this.$refs.importRef && this.$refs.importRef.click();
    },
    changeImportFile() {
      try {
        if (this.$refs.importRef && this.$refs.importRef.files) {
          const file = this.$refs.importRef.files[0];
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function () {
            const xmlStr = this.result;
            getModeler() && getModeler().importXML(xmlStr);
          };
          this.$refs.importRef.value = null;
          this.$refs.importRef.files = null;
        }
      } catch (e) {
        catchError(e);
      }
    }
  }
};
</script>
