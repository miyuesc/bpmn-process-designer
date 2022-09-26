<template>
  <el-button-group>
    <el-button v-r-popover:zoomOut class="el-button__no-padding" @click="zoomOut()">
      <lucide-icon name="ZoomOut" :size="16" />
      <el-popover ref="zoomOut" placement="bottom" trigger="hover" popper-class="button-popover" content="缩小视图" />
    </el-button>
    <el-button v-r-popover:zoomReset @click="zoomReset('fit-viewport')">
      <span style="text-align: center; display: inline-block; width: 40px">
        {{ Math.floor(currentScale * 10) * 10 + "%" }}
      </span>
      <el-popover ref="zoomReset" placement="bottom" trigger="hover" popper-class="button-popover" content="重置缩放" />
    </el-button>
    <el-button v-r-popover:zoomIn class="el-button__no-padding" @click="zoomIn()">
      <lucide-icon name="ZoomIn" :size="16" />
      <el-popover ref="zoomIn" placement="bottom" trigger="hover" popper-class="button-popover" content="放大视图" />
    </el-button>
  </el-button-group>
</template>

<script>
import { mapGetters } from "vuex";

import EventEmitter from "@utils/EventEmitter";
export default {
  name: "BpmnScales",
  data() {
    return {
      currentScale: 1
    };
  },
  computed: {
    ...mapGetters(["getModeler"])
  },
  created() {
    EventEmitter.on("modeler-init", (modeler) => {
      try {
        this._canvas = modeler.get("canvas");
        this.currentScale = this._canvas.zoom();
      } finally {
        modeler.on("canvas.viewbox.changed", ({ viewbox }) => {
          this.currentScale = viewbox.scale;
        });
      }
    });
  },
  methods: {
    zoomReset(newScale) {
      this._canvas && this._canvas.zoom(newScale, newScale === "fit-viewport" ? undefined : { x: 0, y: 0 });
    },
    zoomOut(newScale) {
      this.currentScale = newScale || Math.floor(this.currentScale * 100 - 0.1 * 100) / 100;
      this.zoomReset(this.currentScale);
    },
    zoomIn(newScale) {
      this.currentScale = newScale || Math.floor(this.currentScale * 100 + 0.1 * 100) / 100;
      this.zoomReset(this.currentScale);
    }
  }
};
</script>

<style scoped></style>
