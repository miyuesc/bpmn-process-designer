<template>
  <el-collapse-item name="element-conditional">
    <template #title>
      <collapse-title title="条件设置">
        <lucide-icon name="ArrowLeftRight" />
      </collapse-title>
    </template>
    <div class="element-conditional">
      <template v-if="varVisible">
        <edit-item key="variableName" label="变量名称" :label-width="120">
          <el-input v-model="variableName" maxlength="32" @change="setElementVariableName" />
        </edit-item>
        <edit-item v-if="varEventVisible" key="variableEvent" label="变量事件" :label-width="120">
          <el-input v-model="variableEvents" @change="setElementVariableEvents" />
        </edit-item>
      </template>
      <edit-item key="condition" label="条件类型" :label-width="120">
        <el-select
          v-model="conditionData.conditionType"
          :options="conditionTypeOptions"
          @change="setElementConditionType"
        />
      </edit-item>
      <edit-item
        v-if="conditionData.conditionType && conditionData.conditionType === 'expression'"
        key="expression"
        label="条件内容"
        :label-width="120"
      >
        <el-input v-model="conditionData.expression" @change="setConditionExpression" />
      </edit-item>
      <template v-if="conditionData.conditionType && conditionData.conditionType === 'script'">
        <edit-item key="scriptType" label="脚本类型" :label-width="120">
          <el-select v-model="conditionData.scriptType" @change="setElementConditionScriptType">
            <el-option v-for="{ label, value } in scriptTypeOptions" :label="label" :value="value" :key="value" />
          </el-select>
        </edit-item>
        <edit-item key="scriptLanguage" label="脚本语言" :label-width="120">
          <el-input v-model="conditionData.language" @change="setConditionScriptLanguage" />
        </edit-item>
        <edit-item v-show="conditionData.scriptType === 'inline'" key="scriptBody" label="脚本内容" :label-width="120">
          <el-input v-model="conditionData.body" type="textarea" @change="setConditionScriptBody" />
        </edit-item>
        <edit-item
          v-show="conditionData.scriptType === 'external'"
          key="scriptResource"
          label="资源地址"
          :label-width="120"
        >
          <el-input v-model="conditionData.resource" @change="setConditionScriptResource" />
        </edit-item>
      </template>
    </div>
  </el-collapse-item>
</template>

<script>
import * as CU from "@packages/bo-utils/conditionUtil";
import EventEmitter from "@utils/EventEmitter";
import { scriptTypeOptions } from "@packages/preset-configuration/enumsOption";
import { getActive } from "@packages/bpmn-utils/BpmnDesignerUtils";

export default {
  name: "ElementConditional",
  data() {
    return {
      varVisible: false,
      varEventVisible: false,
      variableName: "",
      variableEvents: {},
      conditionTypeOptions: [],
      conditionData: {},
      scriptTypeOptions: scriptTypeOptions
    };
  },

  mounted() {
    this.getElementVariables();
    this.getElementConditionType();
    this.conditionTypeOptions = CU.getConditionTypeOptions(getActive());
    EventEmitter.on("element-update", () => {
      this.conditionTypeOptions = CU.getConditionTypeOptions(getActive());
      this.getElementVariables();
      this.getElementConditionType();
    });
  },
  methods: {
    getElementVariables() {
      this.varVisible = CU.isConditionEventDefinition(getActive());
      this.variableName = CU.getVariableNameValue(getActive());
      if (this.varVisible) {
        this.varEventVisible = !CU.isExtendStartEvent(getActive());
        this.variableEvents = CU.getVariableEventsValue(getActive());
      }
    },
    getElementConditionType() {
      this.conditionData.conditionType = CU.getConditionTypeValue(getActive());
      this.conditionData.conditionType === "expression" && this.getConditionExpression();
      this.conditionData.conditionType === "script" && this.getConditionScript();
    },
    getConditionExpression() {
      this.conditionData.expression = CU.getConditionExpressionValue(getActive());
    },
    getConditionScript() {
      this.conditionData.language = CU.getConditionScriptLanguageValue(getActive());
      this.conditionData.scriptType = CU.getConditionScriptTypeValue(getActive());
      this.conditionData.body = CU.getConditionScriptBodyValue(getActive());
      this.conditionData.resource = CU.getConditionScriptResourceValue(getActive());
    },

    setElementVariableName(value) {
      CU.setVariableNameValue(getActive(), value);
    },
    setElementVariableEvents(value) {
      CU.setVariableEventsValue(getActive(), value);
    },
    setElementConditionType(value) {
      CU.setConditionTypeValue(getActive(), value);
    },
    setConditionExpression(value) {
      CU.setConditionExpressionValue(getActive(), value);
    },
    setConditionScriptLanguage(value) {
      CU.setConditionScriptLanguageValue(getActive(), value);
    },
    setElementConditionScriptType(value) {
      CU.setConditionScriptTypeValue(getActive(), value);
    },
    setConditionScriptBody(value) {
      CU.setConditionScriptBodyValue(getActive(), value);
    },
    setConditionScriptResource(value) {
      CU.setConditionScriptResourceValue(getActive(), value);
    }
  }
};
</script>
