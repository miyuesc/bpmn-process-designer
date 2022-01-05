<template>
  <div class="my-process-palette">
    <el-collapse>
      <el-collapse-item title="任务" name="1">
        <div class="custom-button" @click="addTask" @mousedown="addTask($event, 'Task')">任务</div>
        <div class="custom-button" @click="addTask" @mousedown="addTask($event, 'UserTask')">用户任务</div>
        <div class="custom-button" @click="addTask" @mousedown="addTask($event, 'SendTask')">发送任务</div>
        <div class="custom-button" @click="addTask" @mousedown="addTask($event, 'ReceiveTask')">接收任务</div>
        <div class="custom-button" @click="addTask" @mousedown="addTask($event, 'ScriptTask')">脚本任务</div>
        <div class="custom-button" @click="addTask" @mousedown="addTask($event, 'ServiceTask')">服务任务</div>
      </el-collapse-item>
      <el-collapse-item title="网关" name="2"> </el-collapse-item>
      <el-collapse-item title="开始" name="3"> </el-collapse-item>
      <el-collapse-item title="结束" name="4"> </el-collapse-item>
      <el-collapse-item title="工具" name="5"> </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { assign } from "min-dash";

export default {
  name: "MyProcessPalette",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    addTask(event, type, options = {}) {
      const ElementFactory = window.bpmnInstances.elementFactory;
      const create = window.bpmnInstances.modeler.get("create");
      const shape = ElementFactory.createShape(assign({ type: `bpmn:${type}` }, options));
      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }
      create.start(event, shape);
    }
  }
};
</script>

<style scoped lang="scss">
.my-process-palette {
  box-sizing: border-box;
  padding: 80px 8px 8px 8px;
  .custom-button {
    box-sizing: border-box;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(24, 144, 255, 0.8);
    cursor: pointer;
    & + .custom-button {
      margin-top: 8px;
    }
  }
}
</style>
