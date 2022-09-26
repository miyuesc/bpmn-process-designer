<template>
  <svg class="bpmn-icon" aria-hidden="true">
    <use :xlink:href="`#${name}`" :fill="color" />
  </svg>
</template>

<script>
export default {
  name: "BpmnIcon",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "bpmn-icon-process"
    },
    color: {
      type: String,
      default: "#1d1d1f"
    }
  }
};
</script>
