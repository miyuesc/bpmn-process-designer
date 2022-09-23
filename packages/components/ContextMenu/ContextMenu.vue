<template>
  <div class="bpmn-context-menu" v-if="showPopover" :style="currentPosition">
    <div class="context-menu_header">{{ contextMenuTitle }}</div>
    <div class="context-menu_body">
      <div v-for="item in currentReplaceOptions" :key="item.actionName" class="context-menu_item">
        <i :class="`context-menu_item_icon ${item.className}`"></i>
        <span @click="triggerAction(item, $event)">{{ translateCh(item.label) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { customTranslate } from "@packages/additional-modules/Translate";
import contextMenuActions from "@packages/components/ContextMenu/contextMenuActions";
import EventEmitter from "@utils/EventEmitter";
import { isAppendAction } from "@packages/bpmn-utils/BpmnDesignerUtils";
import BpmnReplaceOptions from "@packages/bpmn-utils/BpmnReplaceOptions";
import { catchError } from "@utils/printCatch";

export default {
  name: "BpmnContextMenu",
  data() {
    return {
      currentReplaceOptions: [],
      contextMenuTitle: "",
      showPopover: false,
      isAppend: false,
      position: { x: 0, y: 0 },
      currentPosition: {}
    };
  },
  created() {
    EventEmitter.on("show-contextmenu", this.initEventCallback);
    document.body.addEventListener("click", this.closePopover);
  },
  beforeDestroy() {
    EventEmitter.removeListener("show-contextmenu", this.initEventCallback);
    document.body.removeEventListener("click", this.closePopover);
  },
  methods: {
    translateCh(text) {
      return customTranslate(text);
    },
    triggerAction(entry, event) {
      try {
        const { appendAction, replaceAction } = contextMenuActions();
        this.isAppend ? appendAction(entry.target, event) : replaceAction(entry.target, this._currentElement);
        this.showPopover = false;
      } catch (e) {
        catchError(e);
      }
    },
    closePopover() {
      this.showPopover = false;
    },

    async initEventCallback(event, element) {
      console.log(event, this.$el.clientWidth);
      this._currentElement = element || null;
      this.isAppend = isAppendAction(element);
      this.currentReplaceOptions = BpmnReplaceOptions(element);
      this.contextMenuTitle = this.isAppend ? "创建元素" : "更改元素";
      this.showPopover = true;
      this.currentPosition = await this.resetPosition(event);
    },

    async resetPosition(event) {
      if (!this.$el) {
        await this.$nextTick();
        await this.resetPosition();
      }
      // 页面内容区尺寸
      const { clientWidth: pageWidth, clientHeight: pageHeight } = document.body;
      // 组件大小
      const { clientWidth: modelWidth, clientHeight: modelHeight } = this.$el;
      // 默认不靠边，边距 20 px
      const padding = 20;
      // 鼠标点击位置
      const { clientX, clientY } = event;

      // 组件位置计算
      let left = clientX,
        top = clientY;
      if (modelWidth + padding + clientX >= pageWidth) {
        left = clientX - modelWidth;
      }
      if (modelHeight + padding + clientY >= pageHeight) {
        top = clientY - modelHeight;
      }
      return { left: (left += "px"), top: (top += "px") };
    }
  }
};
</script>
