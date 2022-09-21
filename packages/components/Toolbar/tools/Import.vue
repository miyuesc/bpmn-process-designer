<template>
  <el-button type="primary" @click="openImportWindow">
    打开文件
    <input type="file" ref="importRef" style="display: none" accept=".xml,.bpmn" @change="changeImportFile" />
  </el-button>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BpmnImport",
  computed: {
    ...mapGetters(["getModeler"])
  },
  methods: {
    openImportWindow() {
      this.$refs.importRef && this.$refs.importRef.click();
    },
    changeImportFile() {
      if (this.$refs.importRef && this.$refs.importRef.files) {
        const file = this.$refs.importRef.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
          const xmlStr = this.result;
          this.getModeler && this.getModeler.importXML(xmlStr);
        };
      }
    }
  }
};
</script>
