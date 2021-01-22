<template>
  <div>
    <div class="element-property input-property">
      <div class="element-property__label">流转类型：</div>
      <div class="element-property__value">
        <el-select v-model="condition.type" size="mini" @change="updateFlowType">
          <el-option label="普通流转路径" value="normal" />
          <el-option label="默认流转路径" value="default" />
          <el-option label="条件流转路径" value="condition" />
        </el-select>
      </div>
    </div>
    <div class="element-property input-property" v-if="condition.type === 'condition'">
      <div class="element-property__label">条件格式：</div>
      <div class="element-property__value">
        <el-select v-model="condition.conditionType" size="mini" @change="changeFlowConditionType">
          <el-option label="表达式" value="expression" />
          <el-option label="脚本" value="script" />
        </el-select>
      </div>
    </div>
    <div class="element-property input-property" v-if="condition.conditionType === 'expression'">
      <div class="element-property__label">表达式：</div>
      <div class="element-property__value">
        <el-input v-model="condition.body" size="mini" clearable @change="updateFlowCondition" />
      </div>
    </div>
    <template v-if="condition.conditionType === 'script'">
      <div class="element-property input-property">
        <div class="element-property__label">脚本格式：</div>
        <div class="element-property__value">
          <el-input v-model="condition.language" size="mini" clearable @change="updateFlowCondition" />
        </div>
      </div>
      <div class="element-property input-property">
        <div class="element-property__label">脚本类型：</div>
        <div class="element-property__value">
          <el-select v-model="condition.scriptType" size="mini" @change="updateFlowCondition">
            <el-option label="内联脚本" value="inlineScript" />
            <el-option label="外部脚本" value="externalScript" />
          </el-select>
        </div>
      </div>
      <div class="element-property input-property" v-if="condition.scriptType === 'inlineScript'">
        <div class="element-property__label">脚本：</div>
        <div class="element-property__value">
          <el-input v-model="condition.body" size="mini" type="textarea" clearable @change="updateFlowCondition" />
        </div>
      </div>
      <div class="element-property input-property" v-if="condition.scriptType === 'externalScript'">
        <div class="element-property__label">资源地址：</div>
        <div class="element-property__value">
          <el-input v-model="condition.resource" size="mini" clearable @change="updateFlowCondition" />
        </div>
      </div>
    </template>
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
        if (this.conditions && Object.keys(this.conditions).length) {
          this.initConditionForm(this.conditions);
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
    initConditionForm(conditions) {
      let conditionType = conditions.language ? "script" : "expression";
      let scriptType = conditions.resource ? "externalScript" : "inlineScript";
      this.condition = {
        ...conditions,
        conditionType: conditions.type === "condition" ? conditionType : undefined,
        scriptType: conditions.type === "condition" ? scriptType : undefined,
        resource: conditions.resource
      };
    },
    // 更新连线类型
    updateFlowType(type) {
      const line = this.elementRegistry.get(this.elementId);
      const sourceShape = this.elementRegistry.get(line.businessObject.sourceRef.id);
      setTimeout(() => {
        if (type === "normal") {
          // delete sourceShape.businessObject.default;
          if (sourceShape.businessObject.default && sourceShape.businessObject.default.id === line.id) {
            this.modeling.updateProperties(sourceShape, { default: null });
            // delete sourceShape.businessObject.default;
          }
          this.modeling.updateProperties(line, { conditionExpression: null });
          delete line.businessObject.conditionExpression;
        }
        if (type === "default") {
          this.modeling.updateProperties(sourceShape, { default: line });
          delete line.businessObject.conditionExpression;
        }
        if (type === "condition") {
          this.modeling.updateProperties(line, { conditionExpression: this.moddle.create("bpmn:FormalExpression") });
        }
        this.initConditionForm({ type: type });
      });
    },
    changeFlowConditionType(type) {
      this.$set(this.condition, "body", "");
      if (type === "expression") {
        this.$set(this.condition, "language", undefined);
        this.$set(this.condition, "resource", undefined);
      }
      const line = this.elementRegistry.get(this.elementId);
      this.modeling.updateProperties(line, {
        conditionExpression: this.moddle.create("bpmn:FormalExpression", { body: "" })
      });
    },
    updateFlowCondition() {
      let { conditionType, scriptType, body, resource, language } = this.condition;
      let condition;
      const line = this.elementRegistry.get(this.elementId);
      if (conditionType === "expression") {
        condition = this.moddle.create("bpmn:FormalExpression", { body });
      } else {
        if (scriptType === "inlineScript") {
          this.$set(this.condition, "resource", undefined);
        } else {
          this.$set(this.condition, "body", undefined);
        }
        condition = this.moddle.create("bpmn:FormalExpression", { body, resource, language });
      }
      this.modeling.updateProperties(line, { conditionExpression: condition });
    }
  }
};
</script>
