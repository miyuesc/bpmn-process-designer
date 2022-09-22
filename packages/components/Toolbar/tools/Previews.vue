<template>
  <el-button v-popover:popover>
    预览文件
    <el-popover ref="popover" placement="bottom" popper-class="button-popover" trigger="hover">
      <div class="button-list_column">
        <el-button type="primary" @click="openXMLPreviewModel"> 预览XML </el-button>
        <el-button type="primary" @click="openJsonPreviewModel"> 预览JSON </el-button>
      </div>
    </el-popover>
  </el-button>
</template>

<script>
export default {
  name: "BpmnPreviews",
  methods: {
    openXMLPreviewModel() {},
    openJsonPreviewModel() {}
  }
};
</script>
