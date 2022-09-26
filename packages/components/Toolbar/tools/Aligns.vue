<template>
  <el-button-group>
    <template v-for="(btn, index) in buttons">
      <el-button
        v-r-popover:popover="index"
        class="el-button__no-padding"
        :key="btn.key"
        @click="alignElements(btn.key)"
      >
        <lucide-icon :name="btn.icon" :size="16" />
        <el-popover
          ref="popover"
          placement="bottom"
          trigger="hover"
          popper-class="button-popover"
          :content="btn.name"
        />
      </el-button>
    </template>
  </el-button-group>
</template>

<script>
import { mapGetters } from "vuex";
import EventEmitter from "@utils/EventEmitter";

export default {
  name: "BpmnAligns",
  computed: {
    ...mapGetters(["getModeler"])
  },
  data() {
    return {
      buttons: [
        { name: "左对齐", key: "left", icon: "AlignStartVertical" },
        { name: "水平居中", key: "center", icon: "AlignCenterVertical" },
        { name: "右对齐", key: "right", icon: "AlignEndVertical" },
        { name: "上对齐", key: "top", icon: "AlignStartHorizontal" },
        { name: "垂直居中", key: "middle", icon: "AlignCenterHorizontal" },
        { name: "下对齐", key: "bottom", icon: "AlignEndHorizontal" }
      ]
    };
  },
  created() {
    EventEmitter.on("modeler-init", (modeler) => {
      this._modeling = modeler.get("modeling");
      this._selection = modeler.get("selection");
      this._align = modeler.get("alignElements");
    });
  },
  methods: {
    alignElements(tag) {
      if (!this._align) {
        return this.$message.error("当前模式不支持自动对齐");
      }
      if (this._modeling && this._selection) {
        const SelectedElements = this._selection.get();
        if (!SelectedElements || SelectedElements.length <= 1) {
          return this.$message.warning("请按住 Shift 键选择多个元素对齐");
        }
        this._align.trigger(SelectedElements, tag);
      }
    }
  }
};
</script>
