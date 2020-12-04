<template>
  <div class="my-process-designer__main-container">
    <div class="my-process-designer__header">
      <slot name="control-header"></slot>
      <el-button-group v-if="!$slots['control-header']">
        <el-tooltip effect="light">
          <div slot="content">
            <el-button :size="headerButtonSize" type="text">下载为XML文件</el-button>
            <br />
            <el-button :size="headerButtonSize" type="text">下载为SVG文件</el-button>
            <br />
            <el-button :size="headerButtonSize" type="text">下载为BPMN文件</el-button>
          </div>
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-more" />
        </el-tooltip>
        <el-tooltip effect="light" content="打开文件">
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-folder-opened" />
        </el-tooltip>
        <el-tooltip effect="light" content="撤销">
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-refresh-left" />
        </el-tooltip>
        <el-tooltip effect="light" content="恢复">
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-refresh-right" />
        </el-tooltip>
        <el-tooltip effect="light" content="缩小视图">
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-zoom-out" />
        </el-tooltip>
        <el-tooltip effect="light" content="视图缩放比">
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-folder-opened" />
        </el-tooltip>
        <el-tooltip effect="light" content="放大视图">
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-zoom-in" />
        </el-tooltip>
        <el-tooltip effect="light" content="重置视图并居中">
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-c-scale-to-original" />
        </el-tooltip>
        <el-tooltip effect="light" content="重新绘制">
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-refresh" />
        </el-tooltip>
      </el-button-group>
    </div>
    <div class="my-process-designer__container" ref="bpmn-canvas">
      <div v-if="camundaPenal" class="my-process-designer__property-panel" id="property-panel"></div>
    </div>
  </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import DefaultEmptyXML from "./pugins/defaultEmpty";
import translationsCN from "./pugins/translate/zh";
// 官方标签解析文件
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

export default {
  name: "MyProcessDesigner",
  componentName: "MyProcessDesigner",
  props: {
    value: String,
    translations: Object,
    camundaPenal: {
      type: Boolean,
      default: true
    },
    camunda: {
      type: Boolean,
      default: true
    },
    events: {
      type: Array,
      default: () => ["element.click"]
    },
    headerButtonSize: {
      type: String,
      default: "small",
      validator: value => ["default", "medium", "small", "mini"].indexOf(value) !== -1
    },
    headerButtonType: {
      type: String,
      default: "default",
      validator: value => ["default", "primary", "success", "warning", "danger", "info"].indexOf(value) !== -1
    }
  },
  data() {
    return {};
  },
  computed: {
    additionalModules() {
      const Modules = [];
      // 翻译模块
      const TranslateModule = {
        translate: ["value", require("./pugins/translate/customTranslate.js").default(this.translations || translationsCN)]
      };
      // 官方侧边栏
      if (this.camundaPenal) {
        Modules.push(require("bpmn-js-properties-panel"), require("bpmn-js-properties-panel/lib/provider/camunda"));
      }
      Modules.push(TranslateModule);
      return Modules;
    },
    moddleExtensions() {
      const Extensions = {};
      if (this.camunda) Extensions.camunda = camundaModdleDescriptor;
      return Extensions;
    }
  },
  mounted() {
    this.initBpmnModeler();
    this.createNewDiagram(this.value);
    this.$once("hook:beforeDestroy", () => {
      if (this.bpmnModeler) this.bpmnModeler.destroy();
      this.$emit("destroy", this.bpmnModeler);
      this.bpmnModeler = null;
    });
  },
  methods: {
    initBpmnModeler() {
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs["bpmn-canvas"],
        propertiesPanel: {
          parent: "#property-panel"
        },
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions
      });
      this.$emit("init-finished", this.bpmnModeler);
      this.initModelListeners();
    },
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      try {
        let xmlString = xml || DefaultEmptyXML(new Date().getTime(), "测试流程");
        const result = await this.bpmnModeler.importXML(xmlString);
        const { warnings } = result;
        if (warnings && warnings.length) console.warn(warnings);
      } catch (err) {
        console.error(err.message + err.warnings);
      }
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件
      this.events.forEach(event => {
        EventBus.on(event, function(eventObj) {
          let eventName = event.replace(".", "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async () => {
        try {
          let { xml } = await this.bpmnModeler.saveXML({ format: true });
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(e);
        }
      });
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.createNewDiagram(val);
      }
    }
  }
};
</script>
