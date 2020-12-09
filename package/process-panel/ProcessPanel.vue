<template>
  <div class="process-panel__container">
    <el-collapse v-model="activeTab" accordion>
      <el-collapse-item name="base">
        <div slot="title" class="panel-tab__title">常规</div>
        <div class="panel-tab__content">
          <div class="element-property input-property">
            <div class="element-property__label">编号：</div>
            <div class="element-property__value"><el-input v-model="element.id" size="small" clearable /></div>
          </div>
          <div class="element-property input-property">
            <div class="element-property__label">名称：</div>
            <div class="element-property__value"><el-input v-model="element.name" size="small" clearable /></div>
          </div>
          <div class="element-property input-property">
            <div class="element-property__label">版本标签：</div>
            <div class="element-property__value"><el-input v-model="element.versionTag" size="small" clearable /></div>
          </div>
          <div class="element-property input-property">
            <div class="element-property__label">可执行：</div>
            <div class="element-property__value">
              <el-switch v-model="element.isExecutable" active-text="是" inactive-text="否" />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: "ProcessPanel",
  componentName: "ProcessPanel",
  props: {
    bpmnModeler: Object
  },
  data() {
    return {
      activeElement: {},
      activeTab: "base",
      element: {}
    };
  },
  computed: {
    elementType() {
      if (this.activeElement) return this.activeElement.type;
      return null;
    }
  },
  watch: {
    elementType(type) {
      console.log(type);
    }
  },
  methods: {
    getActiveElement() {
      if (!this.bpmnModeler) {
        setTimeout(() => this.getActiveElement(), 10);
        return;
      }
      this.modeling = this.bpmnModeler.get("modeling");
      this.eventBus = this.bpmnModeler.get("eventBus");
      this.bpmnFactory = this.bpmnModeler.get("bpmnFactory");
      this.elementRegistry = this.bpmnModeler.get("elementRegistry");
      this.replace = this.bpmnModeler.get("replace");
      this.selection = this.bpmnModeler.get("selection");

      // 初始第一个选中元素 bpmn:Process
      this.activeElement = this.elementRegistry.find(el => el.type === "bpmn:Process");

      // 监听选择事件，修改当前激活的元素
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        const element = newSelection[0] || this.elementRegistry.find(el => el.type === "bpmn:Process");
        this.activeElement = Object.assign({}, element);
      });
    }
  },
  mounted() {
    this.getActiveElement();
  }
};
</script>
