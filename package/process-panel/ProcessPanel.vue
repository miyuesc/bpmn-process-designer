<template>
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <div slot="title" class="panel-tab__title"><i class="el-icon-info"></i>常规</div>
        <div class="panel-tab__content">
          <el-form size="mini" label-width="90px">
            <el-form-item label="ID">
              <el-input
                v-model="elementBaseInfo.id"
                :disabled="idEditDisabled || elementType === 'bpmn:Process'"
                clearable
                @keyup.enter.native="updateBaseId(elementBaseInfo.id)"
              />
            </el-form-item>
            <el-form-item label="名称">
              <el-input
                v-model="elementBaseInfo.name"
                clearable
                @keyup.native="updateBaseInfo('name', elementBaseInfo.name)"
                @change="updateBaseInfo('name', $event)"
              />
            </el-form-item>
            <!--流程的基础属性-->
            <template v-if="elementType === 'bpmn:Process'">
              <el-form-item label="版本标签">
                <el-input
                  v-model="elementBaseInfo.versionTag"
                  clearable
                  @keyup.native="updateBaseInfo('versionTag', elementBaseInfo.versionTag)"
                  @change="updateBaseInfo('versionTag', $event)"
                />
              </el-form-item>
              <el-form-item label="可执行">
                <el-switch v-model="elementBaseInfo.isExecutable" active-text="是" inactive-text="否" @change="updateBaseInfo('isExecutable', $event)" />
              </el-form-item>
            </template>
          </el-form>
          <!-- 人员信息配置 -->
          <template v-if="elementType === 'bpmn:UserTask'">
            <div class="element-property input-property">
              <div class="element-property__label">处理人</div>
              <div class="element-property__value">
                <el-select
                  v-model="activeElementBusinessObject.assignee"
                  size="mini"
                  @change="updateBaseInfo('assignee', activeElementBusinessObject.assignee)"
                >
                  <el-option label="诸葛亮" value="zgl" />
                  <el-option label="张良" value="zhangliang" />
                  <el-option label="墨子" value="mozi" />
                </el-select>
              </div>
            </div>
            <div class="element-property input-property">
              <div class="element-property__label">候选人</div>
              <div class="element-property__value">
                <el-select
                  v-model="activeElementBusinessObject.candidateUsers"
                  size="mini"
                  @change="updateBaseInfo('candidateUsers', activeElementBusinessObject.candidateUsers)"
                >
                  <el-option label="孙悟空" value="swk" />
                  <el-option label="花木兰" value="hml" />
                  <el-option label="唐僧" value="ts" />
                </el-select>
              </div>
            </div>
            <div class="element-property input-property">
              <div class="element-property__label">候选组</div>
              <div class="element-property__value">
                <el-select
                  v-model="activeElementBusinessObject.candidateGroups"
                  size="mini"
                  @change="updateBaseInfo('candidateGroups', activeElementBusinessObject.candidateGroups)"
                >
                  <el-option label="战士" value="zs" />
                  <el-option label="坦克" value="tk" />
                  <el-option label="刺客" value="ck" />
                </el-select>
              </div>
            </div>
          </template>
          <!--连接线的基础配置-->
          <condition-config v-if="flowTypeViewable" v-bind="$props" :conditions="sequenceFlowCondition" :element-id="elementId" />
          <!--任务节点配置-->
          <task-loop-characteristics v-if="taskLoopViewable" v-bind="$props" :element-id="elementId" :element-business-object="activeElementBusinessObject" />
        </div>
      </el-collapse-item>
      <!-- 外置表单配置-->
      <template v-if="elementType === 'bpmn:UserTask' || elementType === 'bpmn:StartEvent'">
        <el-collapse-item name="form">
          <div slot="title" class="panel-tab__title"><i class="el-icon-s-order"></i>表单</div>
          <element-form-config
            v-bind="$props"
            :element-id="elementId"
            :element-business-object="activeElementBusinessObject"
            @change-form-key="updateBaseInfo('formKey', $event)"
          />
        </el-collapse-item>
      </template>
      <el-collapse-item name="listeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>监听器</div>
        <element-listener v-bind="$props" :element-id="elementId" :listeners="elementListeners" @change="updateElementListener" />
      </el-collapse-item>
      <el-collapse-item name="extensions">
        <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
        <element-attributes v-bind="$props" :element-id="elementId" :attributes="elementAttributes" @change="updateElementAttributes" />
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
                size="mini"
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
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年1月21日09:36:25
 */
import ConditionConfig from "./condition-config/ConditionConfig";
import ElementListener from "./extensional/listeners/ElementListener";
import ElementAttributes from "./extensional/attrbutes/ElementAttributes";
import TaskLoopCharacteristics from "./task-config/TaskLoopCharacteristics";
import ElementFormConfig from "./form-config/ElementFormConfig";
// import { is } from 'bpmn-js/lib/util/ModelUtil';
// import { debounce } from "@/utils";

export default {
  name: "MyProcessPanel",
  components: { ElementFormConfig, TaskLoopCharacteristics, ElementAttributes, ElementListener, ConditionConfig },
  componentName: "MyProcessPanel",
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
      default: false
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
      activeTab: "base",
      activeElementBusinessObject: {},
      elementBaseInfo: {}, // 基础属性：名称、标签等
      documentation: "", // 元素文档 对应的字符串
      sequenceFlowCondition: {}, // 连线条件实例（包含需要的类型字段）
      elementListeners: [], // 扩展属性 -- 监听器实例集合
      elementAttributes: [] // 扩展属性 -- 自定义字段属性实例集合
    };
  },
  computed: {
    elementType() {
      if (this.activeElementBusinessObject) return this.activeElementBusinessObject.$type;
      return null;
    },
    elementId() {
      if (this.activeElementBusinessObject) return this.activeElementBusinessObject.id;
      return null;
    },
    flowTypeViewable() {
      if (this.elementType !== "bpmn:SequenceFlow") return false;
      return this.activeElementBusinessObject.sourceRef && this.activeElementBusinessObject.sourceRef.$type !== "bpmn:StartEvent";
    },
    taskLoopViewable() {
      return this.elementType && this.elementType.indexOf("Task") !== -1;
    }
  },
  created() {
    this.initModels();
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
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
      this.$nextTick(() => this.getActiveElement());
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      const processElement = this.elementRegistry.find(el => el.type === "bpmn:Process");
      this.activeElementBusinessObject = { ...processElement.businessObject };
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        const shape = newSelection[0] || this.elementRegistry.find(el => el.type === "bpmn:Process");
        this.initFormOnChanged(shape.id);
      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        console.log(`
        ----------
        select element changed:
          id:  ${element.id}
        type:  ${element.businessObject.$type}
        ----------
        `);
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.activeElementBusinessObject.id) {
          this.initFormOnChanged(element.id);
        }
      });
    },
    // 元素更新时更新表单
    initFormOnChanged(elementId) {
      const element = this.elementRegistry.get(elementId); // 元素
      if (!element) return;
      this.activeElementBusinessObject = {
        ...JSON.parse(JSON.stringify(element.businessObject)),
        parent: element.businessObject?.$parent ? JSON.parse(JSON.stringify(element.businessObject?.$parent)) : null,
        sourceRef: element.businessObject.sourceRef ? JSON.parse(JSON.stringify(element.businessObject.sourceRef)) : null,
        targetRef: element.businessObject?.targetRef ? JSON.parse(JSON.stringify(element.businessObject?.targetRef)) : null
      };
      this.elementBaseInfo = JSON.parse(JSON.stringify(element.businessObject));
      const shapeDoc = element.businessObject?.documentation; // 元素文档
      // 设置文档属性
      this.documentation = shapeDoc && shapeDoc.length ? shapeDoc[0]?.text : "";
      // 设置扩展监听
      if (element.businessObject?.extensionElements?.values) {
        this.elementListeners = element.businessObject.extensionElements.values.filter(
          // ex => ex.$type === "camunda:ExecutionListener"
          ex => ex.$type === `${this.prefix}:ExecutionListener`
        );
        this.elementAttributes = element.businessObject.extensionElements.values.filter(ex => ex.$type === `${this.prefix}:Properties`);
      } else {
        this.elementListeners = [];
        this.elementAttributes = [];
      }
      // 设置条件属性
      if (element.type.indexOf("SequenceFlow") !== -1) {
        if (element.businessObject.conditionExpression) {
          this.sequenceFlowCondition = { ...element.businessObject.conditionExpression };
          this.$set(this.sequenceFlowCondition, "type", "condition");
          return;
        }
        const sourceShape = this.elementRegistry.get(element.businessObject.sourceRef.id);
        if (sourceShape.businessObject.default && sourceShape.businessObject.default.id === elementId) {
          this.$set(this.sequenceFlowCondition, "type", "default");
          return;
        }
        this.$set(this.sequenceFlowCondition, "type", "normal");
      }
    },
    // 更新 元素 ID
    updateBaseId(newId) {
      if (!newId || !newId.length) return this.$message.error("ID 不能为空");
      console.log("update id");
      const newShape = this.elementRegistry.get(this.elementId);
      this.modeling.updateProperties(newShape, { id: newId, di: { id: `${newId}_di` } }); // 同时更新 图形id
      this.initFormOnChanged(newId); // 重新更新表单
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
    // 更新事件监听器（这里返回的监听器都是实例，不需要再次实例化）
    updateElementListener(listeners) {
      const element = this.elementRegistry.get(this.elementId);
      // 获取当前元素的所有扩展配置实例数组
      const extensionElements = element.businessObject.get("extensionElements");
      // 截取不是监听器的属性
      const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:ExecutionListener`) || [];
      // 重建扩展属性
      const extensions = this.moddle.create("bpmn:ExtensionElements", {
        values: otherExtensions.concat(listeners)
      });
      this.updateElementExtensions(element, extensions);
    },
    // 更新扩展属性（attributes 是普通数组，需要重新创建实例）
    updateElementAttributes(attributes) {
      const properties = this.moddle.create(`${this.prefix}:Properties`, {
        values: attributes.map(attr => {
          return this.moddle.create(`${this.prefix}:Property`, { name: attr.name, value: attr.value });
        })
      });
      const element = this.elementRegistry.get(this.elementId);
      const extensionElements = element.businessObject.get("extensionElements");
      // 截取不是扩展属性的属性
      const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:Properties`) || [];
      // 重建扩展属性
      const extensions = this.moddle.create("bpmn:ExtensionElements", { values: otherExtensions.concat([properties]) });
      this.updateElementExtensions(element, extensions);
    },
    // 更新扩展配置 extensionElements 到元素
    updateElementExtensions(element, extensions) {
      this.modeling.updateProperties(element, { extensionElements: extensions });
      // 更新表单
      this.initFormOnChanged(this.elementId);
    }
  }
};
</script>
