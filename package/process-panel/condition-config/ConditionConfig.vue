<template>
  <div class="element-property input-property">
    <div class="element-property__label">流转类型</div>
    <div class="element-property__value">
      <el-select v-model="condition.type" size="small" @change="updateFlowType">
        <el-option label="普通流转路径" value="normal" />
        <el-option label="默认流转路径" value="default" />
        <el-option label="条件流转路径" value="condition" />
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConditionConfig",
  props: {
    bpmnModeler: Object,
    conditions: Object,
    elementId: String
  },
  data() {
    return {
      condition: {}
    };
  },
  watch: {
    conditions: {
      deep: true,
      immediate: true,
      handler: function() {
        console.log("this.conditions", this.conditions);
        console.log("this.condition", this.condition);
        if (this.conditions && Object.keys(this.conditions).length) {
          this.condition = this.conditions;
        }
      }
    }
  },
  mounted() {
    if (!this.bpmnModeler) return;
    this.modeling = this.bpmnModeler.get("modeling");
    this.moddle = this.bpmnModeler.get("moddle");
    this.elementRegistry = this.bpmnModeler.get("elementRegistry");
  },
  methods: {
    // 更新连线类型
    updateFlowType(type) {
      const line = this.elementRegistry.get(this.elementId);
      const sourceShape = this.elementRegistry.get(line.businessObject.sourceRef.id);
      setTimeout(() => {
        if (type === "normal") {
          // delete sourceShape.businessObject.default;
          if (sourceShape.default && sourceShape.default.id === line.id) {
            this.modeling.updateProperties(sourceShape, { default: null });
            delete sourceShape.businessObject.default;
          }
          this.modeling.updateProperties(line, { conditionExpression: null });
        }
        if (type === "default") {
          this.modeling.updateProperties(sourceShape, { default: line });
        }
        if (type === "condition") {
          this.modeling.updateProperties(line, { conditionExpression: this.moddle.create("bpmn:FormalExpression") });
        }
      });
    }
  }
};
</script>
