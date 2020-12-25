<template>
  <div class="panel-tab__content">
    <div class="element-property list-property">
      <el-table :data="listenersSelf" size="mini" border fit>
        <el-table-column label="序号" width="48px" type="index" />
        <el-table-column label="事件类型" min-width="100px" prop="event" />
        <el-table-column
          label="监听器类型"
          min-width="100px"
          show-overflow-tooltip
          :formatter="row => listenerTypeObject[row.listenerType]"
        />
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="$alert(scope.row.event)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" @click="$alert(scope.row.event)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer :visible.sync="showListenerForm" size="480px" append-to-body>
      <el-form size="small" :model="listenerForm" label-width="96px" ref="listenerFormRef">
        <el-form-item label="事件类型" prop="event" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.event">
            <el-option label="start" value="start" />
            <el-option label="end" value="end" />
          </el-select>
        </el-form-item>
        <el-form-item label="监听器类型" prop="listenerType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.listenerType">
            <el-option v-for="i in Object.keys(listenerTypeObject)" :key="i" :label="listenerTypeObject[i]" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Java类"
          prop="class"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
          v-if="listenerForm.listenerType === 'classListener'"
        >
          <el-input v-model="listenerForm.class" clearable />
        </el-form-item>
        <el-form-item
          label="表达式"
          prop="expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
          v-if="listenerForm.listenerType === 'expressionListener'"
        >
          <el-input v-model="listenerForm.expression" clearable />
        </el-form-item>
        <el-form-item
          label="代理表达式"
          prop="delegateExpression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
          v-if="listenerForm.listenerType === 'delegateExpressionListener'"
        >
          <el-input v-model="listenerForm.delegateExpression" clearable />
        </el-form-item>
      </el-form>
      <el-form
        :model="listenerScriptForm"
        size="small"
        label-width="96px"
        v-if="listenerForm.listenerType === 'scriptListener'"
        ref="listenerScriptFormRef"
      >
        <el-form-item label="脚本格式" prop="scriptFormat" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="listenerScriptForm.scriptFormat" clearable />
        </el-form-item>
        <el-form-item label="脚本类型" prop="scriptType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerScriptForm.scriptType">
            <el-option label="内联脚本" value="inlineScript" />
            <el-option label="外部脚本" value="externalScript" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="脚本"
          prop="value"
          v-if="listenerScriptForm.scriptType === 'inlineScript'"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerScriptForm.value" clearable />
        </el-form-item>
        <el-form-item
          label="资源地址"
          prop="resource"
          v-if="listenerScriptForm.scriptType === 'externalScript'"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerScriptForm.resource" clearable />
        </el-form-item>
      </el-form>
      <div class="listener-form-slider" style="flex: 1"></div>
      <div class="element-listener-add__button">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button size="small" type="primary" @click="addListener">添加</el-button>
      </div>
    </el-drawer>
    <div class="element-listener-add__button">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="openAddListenerForm">添加监听器</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ElementListener",
  props: {
    listeners: {
      type: Object,
      default: () => []
    },
    bpmnModeler: Object,
    elementId: String
  },
  data() {
    return {
      listenersSelf: [],
      listenerForm: {},
      listenerScriptForm: {},
      showListenerForm: false,
      listenerTypeObject: {
        classListener: "Java 类",
        expressionListener: "表达式",
        delegateExpressionListener: "代理表达式",
        scriptListener: "脚本"
      }
    };
  },
  watch: {
    listeners: {
      deep: true,
      handler: function(newVal) {
        if (newVal.length) {
          this.listenersSelf = newVal.map(li => {
            let listenerType;
            if (li.class) listenerType = "classListener";
            if (li.expression) listenerType = "expressionListener";
            if (li.delegateExpression) listenerType = "delegateExpressionListener";
            if (li.script) listenerType = "scriptListener";
            return {
              ...li,
              listenerType: listenerType
            };
          });
        } else {
          this.listenersSelf = [];
        }
      }
    }
  },
  mounted() {
    this.initModel();
  },
  methods: {
    initModel() {
      if (!this.bpmnModeler) {
        this.timer = setTimeout(() => this.initModel(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      if (!this.bpmnModeler) return;
      this.modeling = this.bpmnModeler.get("modeling");
      this.moddle = this.bpmnModeler.get("moddle");
      this.elementRegistry = this.bpmnModeler.get("elementRegistry");
    },
    openAddListenerForm() {
      this.showListenerForm = true;
      // this.newListener = this.moddle.create("camunda:ExecutionListener", {});
    },
    handleCancel() {
      this.showListenerForm = false;
      this.listenerForm = {};
      this.listenerScriptForm = {};
    },
    async addListener() {
      let validateStatus1 = await this.$refs["listenerFormRef"].validate();
      if (!validateStatus1) return;
      if (this.listenerForm.listenerType === "scriptListener") {
        let validateStatus2 = await this.$refs["listenerScriptFormRef"].validate();
        if (!validateStatus2) return;
      }
      const element = this.elementRegistry.get(this.elementId);
      let scriptModdle;
      if (this.listenerForm.listenerType === "scriptListener") {
        scriptModdle = this.moddle.create("camunda:Script", { ...this.listenerScriptForm });
      }
      const newListener = this.moddle.create("camunda:ExecutionListener", {
        ...this.listenerForm,
        script: scriptModdle
      });
      // 当前元素已有的扩展监听器
      const elExtensions = element.businessObject.extensionElements;
      // 不存在则新建
      if (!elExtensions || !elExtensions.values || !elExtensions.values.length) {
        const extension = this.moddle.create("bpmn:ExtensionElements", {
          values: [newListener]
        });
        this.modeling.updateProperties(element, { extensionElements: extension });
      } else {
        // 存在则在末尾添加
        elExtensions.values.push(newListener);
        this.modeling.updateProperties(element, { extensionElements: elExtensions });
      }

      if (this.listenerForm.listenerType === "scriptListener") {
        this.listenersSelf.push(JSON.parse(JSON.stringify({ ...this.listenerForm, script: this.listenerScriptForm })));
      } else {
        this.listenersSelf.push(JSON.parse(JSON.stringify(this.listenerForm)));
      }
      this.showListenerForm = false;
      this.listenerForm = {};
    },
    clickoutsideEvent() {
      this.showListenerForm = false;
    }
  }
};
</script>
