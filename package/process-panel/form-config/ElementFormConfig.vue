<template>
  <div class="panel-tab__content">
    <div class="el-form-item">
      <div class="el-form-item__label">表单key：</div>
      <div class="el-form-item__content"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ElementFormConfig",
  props: {
    bpmnModeler: Object,
    elementId: String,
    elementBusinessObject: Object
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
