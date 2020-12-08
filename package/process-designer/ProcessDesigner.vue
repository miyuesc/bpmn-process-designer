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
          <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-more">下载文件</el-button>
        </el-tooltip>
        <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-folder-opened">打开文件</el-button>
        <el-tooltip effect="light" content="缩小视图">
          <el-button :size="headerButtonSize" :disabled="defaultZoom < 0.2" icon="el-icon-zoom-out" @click="processZoomOut" />
        </el-tooltip>
        <el-button :size="headerButtonSize">{{ currentScale }}</el-button>
        <el-tooltip effect="light" content="放大视图">
          <el-button :size="headerButtonSize" :disabled="defaultZoom > 5" icon="el-icon-zoom-in" @click="processZoomIn" />
        </el-tooltip>
        <el-tooltip effect="light" content="重置视图并居中">
          <el-button :size="headerButtonSize" icon="el-icon-c-scale-to-original" @click="processReZoom" />
        </el-tooltip>
        <el-tooltip effect="light" content="撤销">
          <el-button :size="headerButtonSize" :disabled="!revocable" icon="el-icon-refresh-left" @click="processUndo" />
        </el-tooltip>
        <el-tooltip effect="light" content="恢复">
          <el-button :size="headerButtonSize" :disabled="!recoverable" icon="el-icon-refresh-right" @click="processRedo" />
        </el-tooltip>
        <el-tooltip effect="light" content="重新绘制">
          <el-button :size="headerButtonSize" icon="el-icon-refresh" @click="processRestart" />
        </el-tooltip>
      </el-button-group>
    </div>
    <div class="my-process-designer__container">
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
      <div v-if="camundaPenal" class="my-process-designer__property-panel" id="property-panel" :style="panelStyle"></div>
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
    value: String, // xml 字符串
    translations: Object, // 自定义的翻译文件
    additionalModel: [Object, Array], // 自定义model
    moddleExtension: Object, // 自定义moddle
    onlyCustomizeAddi: {
      type: Boolean,
      default: false
    },
    onlyCustomizeModdle: {
      type: Boolean,
      default: false
    },
    camundaPenal: {
      type: Boolean,
      default: true
    },
    camunda: {
      type: Boolean,
      default: true
    },
    activiti: {
      type: Boolean,
      default: false
    },
    events: {
      type: Array,
      default: () => ["element.click"]
    },
    panelWidth: {
      type: [String, Number],
      default: 400
    },
    headerButtonSize: {
      type: String,
      default: "small",
      validator: value => ["default", "medium", "small", "mini"].indexOf(value) !== -1
    },
    headerButtonType: {
      type: String,
      default: "primary",
      validator: value => ["default", "primary", "success", "warning", "danger", "info"].indexOf(value) !== -1
    }
  },
  data() {
    return {
      currentScale: "100%",
      defaultZoom: 1,
      recoverable: false,
      revocable: false
    };
  },
  computed: {
    additionalModules() {
      const Modules = [];
      if (this.onlyCustomizeAddi) {
        if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
          return this.additionalModel || [];
        }
        return [this.additionalModel];
      }

      console.log(Object.prototype.toString.call(this.additionalModel));
      if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
        Modules.push(...this.additionalModel);
      } else {
        this.additionalModel && Modules.push(this.additionalModel);
      }
      // 翻译模块
      const TranslateModule = {
        translate: ["value", require("./pugins/translate/customTranslate.js").default(this.translations || translationsCN)]
      };
      Modules.push(TranslateModule);
      // 预置activity扩展
      if (this.activiti) {
        Modules.push(require("./pugins/activiti/index"));
      } else {
        // 官方侧边栏
        if (this.camundaPenal) {
          Modules.push(require("bpmn-js-properties-panel"), require("bpmn-js-properties-panel/lib/provider/camunda"));
        }
      }
      return Modules;
    },
    moddleExtensions() {
      const Extensions = {};
      if (this.onlyCustomizeModdle) {
        return this.moddleExtension || null;
      }
      if (this.moddleExtension) {
        for (let key in this.moddleExtension) {
          Extensions[key] = this.moddleExtension[key];
        }
      }
      if (this.activiti) {
        Extensions.activiti = require("./pugins/activiti/activitiDescriptor.json");
      } else {
        if (this.camunda || this.camundaPenal) {
          Extensions.camunda = camundaModdleDescriptor;
        }
      }
      return Extensions;
    },
    panelStyle() {
      if (typeof this.panelWidth === "number") return { width: `${this.panelWidth}px` };
      return { width: this.panelWidth };
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
      if (this.bpmnModeler) return;
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
    createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      let xmlString = xml || DefaultEmptyXML(new Date().getTime(), "测试流程");
      this.bpmnModeler
        .importXML(xmlString)
        .then(result => {
          const { warnings } = result;
          if (warnings && warnings.length) console.warn(warnings);
        })
        .catch(e => {
          console.error(e);
        });
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach(event => {
        EventBus.on(event, function(eventObj) {
          let eventName = event.replace(/./g, "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async () => {
        try {
          this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
          this.revocable = this.bpmnModeler.get("commandStack").canUndo();
          let { xml } = await this.bpmnModeler.saveXML({ format: true });
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(e);
        }
      });
      // 监听视图缩放变化
      this.bpmnModeler.on("canvas.viewbox.changed", e => {
        this.defaultZoom = Math.floor(e.viewbox.scale * 100) / 100;
        // this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
        this.currentScale = Math.floor(this.defaultZoom * 100) + "%";
      });
    },
    /* ------------------------------------------------ refs methods ------------------------------------------------------ */
    processRedo() {
      this.bpmnModeler.get("commandStack").redo();
    },
    processUndo() {
      this.bpmnModeler.get("commandStack").undo();
    },
    processZoomIn() {
      this.defaultZoom = Math.floor(this.defaultZoom * 10 + 1) / 10;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomOut() {
      this.defaultZoom = Math.floor(this.defaultZoom * 10 - 1) / 10;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processReZoom() {
      this.defaultZoom = 1;
      this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
    },
    processRestart() {
      this.createNewDiagram(null);
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
