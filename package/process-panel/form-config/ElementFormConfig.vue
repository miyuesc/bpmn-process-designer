<template>
  <div class="panel-tab__content">
    表单配置部分
  </div>
</template>
<script>
export default {
  name: "ElementFormConfig",
  props: {
    listeners: {
      type: Array,
      default: () => []
    },
    bpmnModeler: Object,
    elementId: String
  },
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {};
  },
  created() {},
  computed: {},
  watch: {},
  methods: {}
};
</script>
