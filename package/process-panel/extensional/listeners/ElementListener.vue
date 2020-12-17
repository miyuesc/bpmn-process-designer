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
    <el-collapse-transition>
      <div v-if="showListenerForm">
        <el-divider>执行监听器</el-divider>
        <el-form size="small" :model="listenerForm" label-width="100px">
          <el-form-item label="事件类型">
            <el-select v-model="listenerForm.event">
              <el-option label="start" value="start" />
              <el-option label="end" value="end" />
            </el-select>
          </el-form-item>
          <el-form-item label="监听器类型">
            <el-select v-model="listenerForm.listenerType">
              <el-option label="Java类" value="classListener" />
              <el-option label="表达式" value="expressionListener" />
              <el-option label="代理表达式" value="delegateExpressionListener" />
              <el-option label="脚本" value="scriptListener" />
            </el-select>
          </el-form-item>
          <el-form-item label="Java类" v-show="listenerForm.listenerType === 'classListener'">
            <el-input v-model="listenerForm.class" clearable />
          </el-form-item>
          <el-form-item label="表达式" v-show="listenerForm.listenerType === 'expressionListener'">
            <el-input v-model="listenerForm.expression" clearable />
          </el-form-item>
          <el-form-item label="代理表达式" v-show="listenerForm.listenerType === 'delegateExpressionListener'">
            <el-input v-model="listenerForm.delegateExpression" clearable />
          </el-form-item>
        </el-form>
        <el-form
          :model="listenerScriptForm"
          size="small"
          label-width="100px"
          v-show="listenerForm.listenerType === 'scriptListener'"
        >
          <el-form-item label="脚本格式">
            <el-input v-model="listenerScriptForm.scriptFormat" clearable />
          </el-form-item>
          <el-form-item label="脚本类型">
            <el-select v-model="listenerScriptForm.scriptType">
              <el-option label="内联脚本" value="inlineScript" />
              <el-option label="外部脚本" value="externalScript" />
            </el-select>
          </el-form-item>
          <el-form-item label="脚本" v-show="listenerScriptForm.scriptType === 'inlineScript'">
            <el-input v-model="listenerScriptForm.value" clearable />
          </el-form-item>
          <el-form-item label="资源地址" v-show="listenerScriptForm.scriptType === 'externalScript'">
            <el-input v-model="listenerScriptForm.resource" clearable />
          </el-form-item>
        </el-form>
        <el-divider>字段注入</el-divider>
      </div>
    </el-collapse-transition>
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
      listenerForm: {},
      listenerScriptForm: {},
      showListenerForm: false
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
      this.showListenerForm = true;
      // this.newListener = this.moddle.create("camunda:ExecutionListener", {});
    }
  }
};
</script>

<style scoped></style>
