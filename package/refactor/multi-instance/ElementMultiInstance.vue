<template>
  <el-form size="mini" label-width="90px" label-suffix="：">
    <el-form-item label="回路特性">
      <el-select v-model="loopCharacteristics" @change="updateLoopCharacteristics">
        <!--bpmn:MultiInstanceLoopCharacteristics-->
        <el-option label="并行多重事件" value="ParallelMultiInstance" />
        <el-option label="时序多重事件" value="SequentialMultiInstance" />
        <!--bpmn:StandardLoopCharacteristics-->
        <el-option label="循环事件" value="StandardLoop" />
        <el-option label="无" value="Null" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "ElementMultiInstance",
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      loopCharacteristics: "",
      loopInstanceForm: {}
    };
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.getElementLoop();
      }
    }
  },
  methods: {
    getElementLoop() {},
    updateLoopCharacteristics(type) {
      this.loopInstanceForm = {}; // 切换类型取消原表单配置
      // 取消多实例配置
      if (type === "Null") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, { loopCharacteristics: null });
        return;
      }
      // 配置循环
      if (type === "StandardLoop") {
        const loopCharacteristicsObject = window.bpmnInstances.moddle.create("bpmn:StandardLoopCharacteristics");
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          loopCharacteristics: loopCharacteristicsObject
        });
        this.multiLoopInstance = null;
        return;
      }
      // 时序
      if (type === "SequentialMultiInstance") {
        this.multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics", { isSequential: true });
      } else {
        this.multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics");
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        loopCharacteristics: this.multiLoopInstance
      });
    }
  }
};
</script>
