<template>
  <el-button-group>
    <template v-for="(btn, index) in buttons">
      <el-button v-r-popover:popover="index" class="el-button__padding" :key="btn.key">
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
import LucideIcon from "../../common/LucideIcon";
export default {
  name: "BpmnAligns",
  components: { LucideIcon },
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
  }
};
</script>
