<template>
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <div slot="title" class="panel-tab__title"><i class="el-icon-info"></i>常规</div>
        <div class="panel-tab__content">
          <element-base-info :id-edit-disabled="idEditDisabled" :id="elementId" :type="elementType" />
        </div>
      </el-collapse-item>
      <el-collapse-item name="task" v-if="elementType.indexOf('Task') !== -1" key="task">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-order"></i>任务</div>
        <div class="panel-tab__content">
          <element-task-config :id="elementId" :type="elementType" />
        </div>
      </el-collapse-item>
      <el-collapse-item name="multiInstance" v-if="elementType.indexOf('Task') !== -1" key="multiInstance">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-help"></i>多实例</div>
        <div class="panel-tab__content">
          <element-multi-instance :id="elementId" :type="elementType" />
        </div>
      </el-collapse-item>
      <el-collapse-item name="listeners" key="listeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>监听器</div>
        <div class="panel-tab__content"></div>
      </el-collapse-item>
      <el-collapse-item name="extensions" key="extensions">
        <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
        <div class="panel-tab__content"></div>
      </el-collapse-item>
      <el-collapse-item name="other" key="other">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>其他</div>
        <div class="panel-tab__content">
          <element-other-config :id="elementId" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import ElementBaseInfo from "./base/ElementBaseInfo";
import ElementOtherConfig from "./other/ElementOtherConfig";
import ElementTaskConfig from "./task/ElementTaskConfig";
import ElementMultiInstance from "./multi-instance/ElementMultiInstance";
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
  name: "MyPropertiesPanel",
  components: { ElementMultiInstance, ElementTaskConfig, ElementOtherConfig, ElementBaseInfo },
  componentName: "MyPropertiesPanel",
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
      elementId: "",
      elementType: ""
    };
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
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get("modeling"),
        moddle: this.bpmnModeler.get("moddle"),
        eventBus: this.bpmnModeler.get("eventBus"),
        bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
        elementRegistry: this.bpmnModeler.get("elementRegistry"),
        replace: this.bpmnModeler.get("replace"),
        selection: this.bpmnModeler.get("selection")
      };
      this.getActiveElement();
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      const processElement = window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process");
      this.initFormOnChanged(processElement);
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        const element = newSelection[0] || window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process");
        console.log(`
        ----------
select element changed:
          id:  ${element.id}
        type:  ${element.businessObject.$type}
        ----------
        `);
        console.log("businessObject: ", element.businessObject);
        this.initFormOnChanged(element);
      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element);
        }
      });
    },
    // 初始化数据
    initFormOnChanged(element) {
      window.bpmnInstances.bpmnElement = element;
      this.bpmnElement = element;
      this.elementId = element.id;
      this.elementType = element.type.split(":")[1];
    },
    beforeDestroy() {
      window.bpmnInstances = null;
    }
  }
};
</script>
