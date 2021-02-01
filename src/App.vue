<template>
  <div id="app">
    <div class="test-bar" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 2000">
      <!--      <el-button size="mini" @click="testFunc">测试按钮</el-button>-->
    </div>
    <my-process-designer
      :additional-model="labelEditing"
      process-type="camunda"
      ref="processDesigner"
      @element-click="elementClick"
      @init-finished="initModeler"
    />
    <my-process-panel :bpmn-modeler="modeler" prefix="camunda" class="process-panel" />
  </div>
</template>

<script>
import translations from "@/translations";
import MyProcessPanel from "../package/process-panel/ProcessPanel";

export default {
  name: "App",
  components: { MyProcessPanel },
  data() {
    return {
      xmlString: "",
      modeler: null,
      translationsSelf: translations,
      labelEditing: [{ labelEditingProvider: ["value", ""] }]
    };
  },
  created() {
    // console.log(this.translationsSelf);
  },
  methods: {
    initModeler(modeler) {
      this.modeler = modeler;
    },
    elementClick(element) {
      this.element = element;
      console.log(element);
      // console.log(this.modeler.getDefinitions());
    },
    ProcessChanged(xml) {
      this.xmlString = xml;
    },
    testFunc() {
      this.$refs.processDesigner.processZoomIn(0.5);
    }
  }
};
</script>

<style lang="scss">
body {
  overflow: hidden;
  margin: 0;
  padding: 8px;
  box-sizing: border-box;
}
#app {
  width: 100%;
  height: calc(100vh - 16px);
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: auto max-content;
}
.my-process-designer {
  overflow: auto;
}
body,
body * {
  /* 滚动条 */
  &::-webkit-scrollbar-track-piece {
    background-color: #fff; /*滚动条的背景颜色*/
    -webkit-border-radius: 0; /*滚动条的圆角宽度*/
  }
  &::-webkit-scrollbar {
    width: 10px; /*滚动条的宽度*/
    height: 8px; /*滚动条的高度*/
  }
  &::-webkit-scrollbar-thumb:vertical {
    /*垂直滚动条的样式*/
    height: 50px;
    background-color: rgba(153, 153, 153, 0.5);
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.3);
    -webkit-border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.5);
    -webkit-border-radius: 4px;
  }
}
</style>
