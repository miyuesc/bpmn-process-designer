<template>
  <div class="process-panel__container" :style="panelStyle">
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <div slot="title" class="panel-tab__title"><i class="el-icon-info"></i>常规</div>
        <div class="panel-tab__content">
          <div class="element-property input-property">
            <div class="element-property__label">ID</div>
            <div class="element-property__value">
              <el-input
                v-model="element.id"
                size="small"
                :disabled="idEditDisabled"
                clearable
                @keyup.native="updateBaseInfo('id', element.id)"
                @change="updateBaseInfo('id', $event)"
              />
            </div>
          </div>
          <div class="element-property input-property">
            <div class="element-property__label">名称</div>
            <div class="element-property__value">
              <el-input
                v-model="element.name"
                size="small"
                clearable
                @keyup.native="updateBaseInfo('name', element.name)"
                @change="updateBaseInfo('name', $event)"
              />
            </div>
          </div>
          <!--流程的基础属性-->
          <template v-if="elementType === 'bpmn:Process'">
            <div class="element-property input-property">
              <div class="element-property__label">版本标签</div>
              <div class="element-property__value">
                <el-input
                  v-model="element.versionTag"
                  size="small"
                  clearable
                  @keyup.native="updateBaseInfo('versionTag', element.versionTag)"
                  @change="updateBaseInfo('versionTag', $event)"
                />
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
          <condition-config v-if="flowTypeViewable" v-bind="$props" :conditions="condition" :element-id="elementId" />
        </div>
      </el-collapse-item>
      <el-collapse-item name="listeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>监听器</div>
        <element-listener
          v-bind="$props"
          :element-id="elementId"
          :listeners="elementListeners"
          @change="updateElementListener"
        />
      </el-collapse-item>
      <el-collapse-item name="extensions">
        <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
        <element-attributes v-bind="$props" :element-id="elementId" :attributes="elementAttributes" />
      </el-collapse-item>
      <el-collapse-item name="other">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>其他</div>
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
import ConditionConfig from "./condition-config/ConditionConfig";
import ElementListener from "./extensional/listeners/ElementListener";
import ElementAttributes from "./extensional/attrbutes/ElementAttributes";
// import { is } from 'bpmn-js/lib/util/ModelUtil';

export default {
  name: "ProcessPanel",
  components: { ElementAttributes, ElementListener, ConditionConfig },
  componentName: "ProcessPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "camunda"
    },
    width: {
      type: Number,
      default: 480
    },
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    };
  },
  data() {
    return {
      activeElement: {},
      condition: {},
      activeTab: "base",
      element: {},
      documentation: "",
      conditionType: "",
      elementListeners: [],
      elementAttributes: []
    };
  },
  computed: {
    panelStyle() {
      return { width: `${this.width}px` };
    },
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
      // this.activeTab = "base";
    }
  },
  mounted() {
    this.getActiveElement();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    getActiveElement() {
      if (!this.bpmnModeler) {
        this.timer = setTimeout(() => this.getActiveElement(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
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
      // this.bpmnModeler.on("element.changed", ({ element }) => {
      //   if (!element) return;
      //   if (this.elementType === "bpmn:SequenceFlow") return;
      //   debounce(this.initFormOnChanged(element.id), 100);
      // });
    },
    // 元素更新时更新表单
    initFormOnChanged(elementId) {
      const element = this.elementRegistry.get(elementId);
      const shapeDoc = element.businessObject.documentation;
      this.activeElement = Object.assign({}, element);
      this.element = Object.assign({}, element.businessObject);
      // 设置文档属性
      this.documentation = shapeDoc && shapeDoc.length ? shapeDoc[0].text : "";
      // 设置扩展监听
      if (element.businessObject?.extensionElements?.values) {
        this.elementListeners = element.businessObject.extensionElements.values.filter(
          // ex => ex.$type === "camunda:ExecutionListener"
          ex => ex.$type === `${this.prefix}:ExecutionListener`
        );
        this.elementAttributes = element.businessObject.extensionElements.values.filter(
          ex => ex.$type === `${this.prefix}:Properties`
        );
      } else {
        this.elementListeners = [];
        this.elementAttributes = [];
      }
      // 设置条件属性
      if (element.type.indexOf("SequenceFlow") !== -1) {
        if (element.businessObject.conditionExpression) {
          this.condition = { ...element.businessObject.conditionExpression };
          this.$set(this.condition, "type", "condition");
          return;
        }
        const sourceShape = this.elementRegistry.get(element.businessObject.sourceRef.id);
        if (sourceShape.businessObject.default && sourceShape.businessObject.default.id === elementId) {
          this.$set(this.condition, "type", "default");
          return;
        }
        this.$set(this.condition, "type", "normal");
      }
    },
    // 更新常规信息
    updateBaseInfo(key, value) {
      const shape = this.elementRegistry.get(this.elementId);
      let attrObj = {};
      attrObj[key] = value;
      this.modeling.updateProperties(shape, attrObj);
    },
    // 更新元素文档
    updateDocumentation() {
      const element = this.elementRegistry.get(this.elementId);
      const documentation = this.bpmnFactory.create("bpmn:Documentation", { text: this.documentation });
      this.modeling.updateProperties(element, {
        documentation: [documentation]
      });
    },
    // 更新事件监听器
    updateElementListener(listeners) {
      const element = this.elementRegistry.get(this.elementId);
      const extensionElements = element.businessObject.get("extensionElements");
      // 截取不是监听器的属性
      const otherExtensions =
        extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:ExecutionListener`) || [];
      // 重建扩展属性
      const extensions = this.moddle.create("bpmn:ExtensionElements", {
        values: otherExtensions.concat(listeners)
      });
      // 更新属性到元素
      this.modeling.updateProperties(element, {
        extensionElements: extensions
      });

      this.initFormOnChanged(this.elementId);
    }
  }
};
</script>
