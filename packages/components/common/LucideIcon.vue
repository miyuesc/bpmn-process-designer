<template>
  <component :is="icon" v-bind="$props" />
</template>

<script>
import * as icons from "lucide-vue";

export default {
  name: "LucideIcon",
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: "currentColor"
    },
    strokeWidth: {
      type: Number,
      default: 2
    },
    defaultClass: {
      type: String,
      default: "lucide-icon"
    }
  },
  computed: {
    icon() {
      return icons[this.name];
    }
  }
};
</script>
