<template>
  <div class="number-tag" :style="computedStyle">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: "NumberTag",
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    hidden: {
      type: Boolean,
      default: false
    },
    marginLeft: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    computedStyle() {
      const { marginLeft } = this;
      if (typeof marginLeft === "string") {
        return { marginLeft };
      }
      return { marginLeft: marginLeft + "px" };
    }
  }
};
</script>

<style scoped lang="scss">
.number-tag {
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  color: #409eff;
  border: 1px solid #d9ecff;
  background-color: #ecf5ff;
  text-align: center;
}
</style>
