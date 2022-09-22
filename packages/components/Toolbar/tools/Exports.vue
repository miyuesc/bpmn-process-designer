<template>
  <el-button v-popover:popover>
    导出文件
    <el-popover ref="popover" placement="bottom" popper-class="button-popover" trigger="hover">
      <div class="button-list_column">
        <el-button type="primary" @click="downloadProcessAsBpmn"> 导出为Bpmn </el-button>
        <el-button type="primary" @click="downloadProcessAsXml"> 导出为XML </el-button>
        <el-button type="primary" @click="downloadProcessAsSvg"> 导出为SVG </el-button>
      </div>
    </el-popover>
  </el-button>
</template>

<script>
export default {
  name: "BpmnExports",
  methods: {
    downloadProcessAsBpmn() {},
    downloadProcessAsXml() {},
    downloadProcessAsSvg() {}
  }
};
</script>
