<template>
  <el-collapse-item name="element-extension-field">
    <template #title>
      <collapse-title title="扩展字段">
        <lucide-icon name="PlayCircle" />
      </collapse-title>
    </template>
    <div class="element-extension-field">
      <edit-item label="Name">
        <el-input v-model="field.name" />
      </edit-item>
      <edit-item label="Value">
        <el-input v-model="field.string" />
      </edit-item>

      <el-button type="primary" class="inline-large-button" @click="setElementExtensionField(-1)"> 更新字段 </el-button>
    </div>
  </el-collapse-item>
</template>

<script>
import EventEmitter from "@utils/EventEmitter";
import { getActive } from "@packages/bpmn-utils/BpmnDesignerUtils";
import { createModdleElement } from "../../../bpmn-utils/BpmnExtensionElements";
import { getModeler } from "../../../bpmn-utils/BpmnDesignerUtils";

export default {
  name: "ElementExtensionField",
  data() {
    return {
      field: {}
    };
  },
  mounted() {
    this.getElementExtensionField();
    EventEmitter.on("element-update", this.getElementExtensionField);
  },
  methods: {
    getElementExtensionField() {
      this.$extensionElements = getActive().businessObject.get("extensionElements");
      this.$otherExtensionElements = [];
      this.$extensionElements &&
        this.$extensionElements.get("values").forEach((item) => {
          if (item.$type !== "flowable:Field") {
            this.$otherExtensionElements.push(item);
          } else {
            this.field = { ...item };
          }
        });
    },
    setElementExtensionField() {
      const modeling = getModeler.getModeling();
      if (!this.$extensionElements) {
        this.$extensionElements = createModdleElement(
          "bpmn:ExtensionElements",
          { values: [] },
          getActive().businessObject
        );
        modeling.updateModdleProperties(getActive(), getActive().businessObject, {
          extensionElements: this.$extensionElements
        });
      }
      const field = getModeler.getModdle().create("flowable:Field", {
        name: this.field.name,
        string: this.field.string
      });
      modeling.updateModdleProperties(getActive(), this.$extensionElements, {
        values: [...this.$otherExtensionElements, field]
      });
    }
  }
};
</script>
