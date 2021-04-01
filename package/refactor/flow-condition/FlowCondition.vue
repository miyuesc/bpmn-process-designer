<template>
  <el-form :model="flowConditionForm" label-width="90px" label-suffix="：" size="mini">
    <el-form-item label="流转类型">
      <el-select v-model="flowConditionForm.type" @change="updateFlowType">
        <el-option label="普通流转路径" value="normal" />
        <el-option label="默认流转路径" value="default" />
        <el-option label="条件流转路径" value="condition" />
      </el-select>
    </el-form-item>
    <el-form-item label="条件格式" v-if="flowConditionForm.type === 'condition'" key="condition">
      <el-select v-model="flowConditionForm.conditionType" @change="changeFlowConditionType">
        <el-option label="表达式" value="expression" />
        <el-option label="脚本" value="script" />
      </el-select>
    </el-form-item>
    <el-form-item label="表达式" v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'expression'" key="express">
      <el-input v-model="flowConditionForm.body" clearable @change="updateFlowCondition" />
    </el-form-item>
    <template v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'script'">
      <el-form-item label="脚本语言" key="language">
        <el-input v-model="flowConditionForm.language" clearable @change="updateFlowCondition" />
      </el-form-item>
      <el-form-item label="脚本类型" key="scriptType">
        <el-select v-model="flowConditionForm.scriptType" @change="updateFlowCondition">
          <el-option label="内联脚本" value="inlineScript" />
          <el-option label="外部脚本" value="externalScript" />
        </el-select>
      </el-form-item>
      <el-form-item label="脚本" v-if="flowConditionForm.scriptType === 'inlineScript'" key="body">
        <el-input v-model="flowConditionForm.body" type="textarea" clearable @change="updateFlowCondition" />
      </el-form-item>
      <el-form-item label="资源地址" v-if="flowConditionForm.scriptType === 'externalScript'" key="resource">
        <el-input v-model="flowConditionForm.resource" clearable @change="updateFlowCondition" />
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
export default {
  name: "FlowCondition",
  props: {
    businessObject: Object,
    type: String
  },
  data() {
    return {
      flowConditionForm: {}
    };
  },
  watch: {
    businessObject: {
      immediate: true,
      handler() {
        console.log("condition watch");
        this.$nextTick(() => this.resetFlowCondition());
      }
    }
  },
  methods: {
    resetFlowCondition() {
      console.log(this.businessObject);
    },
    updateFlowType() {},
    changeFlowConditionType() {},
    updateFlowCondition() {}
  }
};
</script>
