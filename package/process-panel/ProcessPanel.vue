<template>
  <div class="process-panel__container">
    <el-collapse v-model="activeTab" accordion>
      <el-collapse-item name="base">
        <div slot="title" class="panel-tab__title">常规</div>
        <div class="panel-tab__content">
          <div class="element-property input-property">
            <div class="element-property__label">编号</div>
            <div class="element-property__value">
              <el-input
                v-model="element.id"
                size="small"
                :disabled="idEditDisabled"
                clearable
                @change="updateBaseInfo('id', $event)"
              />
            </div>
          </div>
          <div class="element-property input-property">
            <div class="element-property__label">名称</div>
            <div class="element-property__value">
              <el-input v-model="element.name" size="small" clearable @change="updateBaseInfo('name', $event)" />
            </div>
          </div>
          <!--流程的基础属性-->
          <template v-if="elementType === 'bpmn:Process'">
            <div class="element-property input-property">
              <div class="element-property__label">版本标签</div>
              <div class="element-property__value">
                <el-input v-model="element.versionTag" size="small" clearable @change="updateBaseInfo('versionTag', $event)" />
              </div>
            </div>
            <div class="element-property input-property">
              <div class="element-property__label">可执行</div>
              <div class="element-property__value">
                <el-switch
                  v-model="element.isExecutable"
                  active-text="是"
                  inactive-text="否"
                  @change="updateBaseInfo('isExecutable', $event)"
                />
              </div>
            </div>
          </template>
          <!--连接线的基础配置-->
          <template v-if="flowTypeViewable">
            <div class="element-property input-property">
              <div class="element-property__label">条件类型</div>
              <div class="element-property__value">
                <el-select v-model="conditionType" size="small" @change="updateFlowType">
                  <el-option label="普通流转路径" value="normal" />
                  <el-option label="默认流转路径" value="default" />
                  <el-option label="条件流转路径" value="condition" />
                </el-select>
              </div>
            </div>
          </template>
        </div>
      </el-collapse-item>
      <el-collapse-item name="listeners">
        <div slot="title" class="panel-tab__title">监听器</div>
        <div class="panel-tab__content"></div>
      </el-collapse-item>
      <el-collapse-item name="extensions">
        <div slot="title" class="panel-tab__title">扩展属性</div>
        <div class="panel-tab__content"></div>
      </el-collapse-item>
      <el-collapse-item name="other">
        <div slot="title" class="panel-tab__title">其他</div>
        <div class="panel-tab__content">
          <div class="element-property input-property">
            <div class="element-property__label">元素文档</div>
            <div class="element-property__value">
              <el-input
                type="textarea"
                v-model="documentation"
                size="small"
                resize="vertical"
                :autosize="{ minRows: 2, maxRows: 4 }"
                @input="updateDocumentation"
                @blur="updateDocumentation"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { debounce } from "@/utils";
// import { is } from 'bpmn-js/lib/util/ModelUtil';

export default {
  name: "ProcessPanel",
  componentName: "ProcessPanel",
  props: {
    bpmnModeler: Object,
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeElement: {},
      activeTab: "base",
      element: {},
      documentation: "",
      conditionType: ""
    };
  },
  computed: {
    elementType() {
      if (this.activeElement) return this.activeElement.type;
      return null;
    },
    elementId() {
      if (this.activeElement) return this.activeElement.id;
      return null;
    },
    flowTypeViewable() {
      if (this.elementType !== "bpmn:SequenceFlow") return false;
      return this.element.sourceRef && this.element.sourceRef.$type !== "bpmn:StartEvent";
    }
  },
  watch: {
    elementType(type) {
      console.log(type);
    },
    elementId() {
      this.activeTab = "base";
    }
  },
  methods: {
    getActiveElement() {
      if (!this.bpmnModeler) {
        setTimeout(() => this.getActiveElement(), 10);
        return;
      }
      this.modeling = this.bpmnModeler.get("modeling");
      this.moddle = this.bpmnModeler.get("moddle");
      this.eventBus = this.bpmnModeler.get("eventBus");
      this.bpmnFactory = this.bpmnModeler.get("bpmnFactory");
      this.elementRegistry = this.bpmnModeler.get("elementRegistry");
      this.replace = this.bpmnModeler.get("replace");
      this.selection = this.bpmnModeler.get("selection");

      // 初始第一个选中元素 bpmn:Process
      this.activeElement = this.elementRegistry.find(el => el.type === "bpmn:Process");
      this.element = Object.assign({}, this.activeElement.businessObject);

      // 监听选择事件，修改当前激活的元素
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        const shape = newSelection[0] || this.elementRegistry.find(el => el.type === "bpmn:Process");
        debounce(this.initFormOnChanged(shape.id), 100);
      });

      // 监听选择事件，修改当前激活的元素
      this.bpmnModeler.on("element.changed", ({ element }) => {
        if (!element) return;
        if (this.elementType === "bpmn:SequenceFlow") return;
        debounce(this.initFormOnChanged(element.id), 100);
      });
    },
    // 元素更新时更新表单
    initFormOnChanged(elementId) {
      const shape = this.elementRegistry.get(elementId);
      const shapeDoc = shape.businessObject.documentation;
      this.activeElement = Object.assign({}, shape);
      this.element = Object.assign({}, shape.businessObject);
      this.documentation = shapeDoc && shapeDoc.length ? shapeDoc[0].text : "";
    },
    // 更新常规信息
    updateBaseInfo(key, value) {
      const shape = this.elementRegistry.get(this.elementId);
      let attrObj = {};
      attrObj[key] = value;
      this.modeling.updateProperties(shape, attrObj);
    },
    // 更新连线类型
    updateFlowType(type) {
      const shape = this.elementRegistry.get(this.elementId);
      console.log(type, shape, this.elementRegistry.get(shape.businessObject.sourceRef.id));
      const sourceShape = this.elementRegistry.get(shape.businessObject.sourceRef.id);
      setTimeout(() => {
        if (type === "normal") {
          this.modeling.updateProperties(sourceShape, { default: "" });
          this.modeling.updateProperties(shape, { conditionExpression: null });
        }
        if (type === "default") {
          this.modeling.updateProperties(sourceShape, { default: this.elementId });
        }
      });
    },
    // 更新元素文档
    updateDocumentation() {
      const shape = this.elementRegistry.get(this.elementId);
      const documentation = this.bpmnFactory.create("bpmn:Documentation", { text: this.documentation });
      this.modeling.updateProperties(shape, {
        documentation: [documentation]
      });
    }
  },
  mounted() {
    this.getActiveElement();
  },
  beforeDestroy() {
    clearTimeout();
  }
};
</script>
