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
    <template v-if="loopCharacteristics === 'ParallelMultiInstance' || loopCharacteristics === 'SequentialMultiInstance'">
      <el-form-item label="循环基数" key="loopCardinality">
        <el-input v-model="loopInstanceForm.loopCardinality" clearable />
      </el-form-item>
      <el-form-item label="集合" key="collection">
        <el-input v-model="loopInstanceForm.collection" clearable />
      </el-form-item>
      <el-form-item label="元素变量" key="elementVariable">
        <el-input v-model="loopInstanceForm.elementVariable" clearable />
      </el-form-item>
      <el-form-item label="完成条件" key="completionCondition">
        <el-input v-model="loopInstanceForm.completionCondition" clearable />
      </el-form-item>
      <el-form-item label="异步状态" key="async">
        <el-checkbox v-model="loopInstanceForm.asyncBefore" label="异步前" />
        <el-checkbox v-model="loopInstanceForm.asyncAfter" label="异步后" />
        <el-checkbox v-model="loopInstanceForm.exclusive" v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore" label="排除" />
      </el-form-item>
      <el-form-item label="重试周期" prop="failedJobRetryTimeCycle" v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore" key="cycle">
        <el-input v-model="loopInstanceForm.failedJobRetryTimeCycle" clearable />
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
export default {
  name: "ElementMultiInstance",
  props: {
    businessObject: Object,
    type: String
  },
  data() {
    return {
      loopCharacteristics: "",
      loopInstanceForm: {}
    };
  },
  watch: {
    businessObject: {
      immediate: true,
      handler(val) {
        console.log("watch", val);
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.getElementLoop(val);
      }
    }
  },
  methods: {
    getElementLoop(businessObject) {
      if (!businessObject.loopCharacteristics) {
        this.loopCharacteristics = "Null";
        this.loopInstanceForm = {};
        return;
      }
      if (businessObject.loopCharacteristics.$type === "bpmn:StandardLoopCharacteristics") {
        this.loopCharacteristics = "StandardLoop";
        this.loopInstanceForm = {};
        return;
      }
      if (businessObject.loopCharacteristics.isSequential) {
        this.loopCharacteristics = "SequentialMultiInstance";
      } else {
        this.loopCharacteristics = "ParallelMultiInstance";
      }
    },
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
