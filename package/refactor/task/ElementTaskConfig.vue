<template>
  <el-form size="mini" label-width="90px" label-suffix="：">
    <el-form-item label="异步延续">
      <el-checkbox v-model="taskConfigForm.asyncBefore" label="异步前" @change="changeTaskAsync" />
      <el-checkbox v-model="taskConfigForm.asyncAfter" label="异步后" @change="changeTaskAsync" />
      <el-checkbox v-model="taskConfigForm.exclusive" v-if="taskConfigForm.asyncAfter || taskConfigForm.asyncBefore" label="排除" @change="changeTaskAsync" />
    </el-form-item>
    <component :is="witchTaskComponent" v-bind="$props" />
  </el-form>
</template>

<script>
import UserTask from "./task-components/UserTask";
import ScriptTask from "./task-components/ScriptTask";

export default {
  name: "ElementTaskConfig",
  components: { UserTask, ScriptTask },
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      taskConfigForm: {
        asyncAfter: false,
        asyncBefore: false,
        exclusive: false
      },
      witchTaskComponent: "",
      installedComponent: {
        UserTask: "UserTask",
        ScriptTask: "ScriptTask"
      }
    };
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.taskConfigForm.asyncBefore = this.bpmnElement?.businessObject?.asyncBefore;
        this.taskConfigForm.asyncAfter = this.bpmnElement?.businessObject?.asyncAfter;
        this.taskConfigForm.exclusive = this.bpmnElement?.businessObject?.exclusive;
      }
    },
    type: {
      immediate: true,
      handler() {
        this.witchTaskComponent = this.installedComponent[this.type];
      }
    }
  },
  methods: {
    changeTaskAsync() {
      if (!this.taskConfigForm.asyncBefore && !this.taskConfigForm.asyncAfter) {
        this.taskConfigForm.exclusive = false;
      }
      window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
        ...this.taskConfigForm
      });
    }
  }
};
</script>
