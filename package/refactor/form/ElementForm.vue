<template>
  <div class="panel-tab__content">
    表单配置
  </div>
</template>

<script>
export default {
  name: "ElementForm",
  props: {
    id: String,
    type: String
  },
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {
      fieldList: []
    };
  }
};
</script>
