<template>
  <div class="panel-tab__content">
    <div class="element-property input-property">
      <div class="element-property__label">监听列表</div>
      <div class="element-property__value">
        <div class="element-listener-item" v-for="(listener, index) in listenersSelf" :key="index">
          <span>{{ index + 1 }}.</span>
          <el-input :value="listener.class" size="small" readonly />
          <el-button icon="el-icon-close" size="small" circle />
        </div>
        <div class="element-listener-add__button">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addListener">添加监听器</el-button>
        </div>
      </div>
    </div>
    <el-collapse-transition></el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: "ElementListener",
  props: {
    listeners: {
      type: Array,
      default: () => []
    },
    bpmnModeler: Object,
    elementId: String
  },
  data() {
    return {
      listenersSelf: [{ class: "test" }],
      listenerForm: {}
    };
  },
  watch: {},
  mounted() {
    if (!this.bpmnModeler) return;
    this.modeling = this.bpmnModeler.get("modeling");
    this.moddle = this.bpmnModeler.get("moddle");
    this.elementRegistry = this.bpmnModeler.get("elementRegistry");
  },
  methods: {
    addListener() {
      this.newListener = this.moddle.create("camunda:ExecutionListener", {});
    }
  }
};
</script>

<style scoped></style>
