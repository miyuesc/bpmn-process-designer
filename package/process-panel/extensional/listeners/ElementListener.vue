<template>
  <div class="panel-tab__content">
    <div class="element-property list-property">
      <el-table :data="listenersSelf" size="mini" border fit>
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="事件类型" min-width="100px" prop="event" />
        <el-table-column
          label="监听器类型"
          min-width="100px"
          show-overflow-tooltip
          :formatter="row => listenerTypeObject[row.listenerType]"
        />
        <el-table-column label="操作" width="100px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openListenerForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="$alert(scope.row.event)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="element-listener-add__button">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="openListenerForm(null)">添加监听器</el-button>
    </div>

    <el-drawer :visible.sync="showListenerForm" title="事件监听器" size="480px" append-to-body>
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
          v-if="listenerForm.listenerType === 'classListener'"
          key="listener-class"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.class" clearable />
        </el-form-item>
        <el-form-item
          label="表达式"
          prop="expression"
          v-if="listenerForm.listenerType === 'expressionListener'"
          key="listener-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.expression" clearable />
        </el-form-item>
        <el-form-item
          label="代理表达式"
          prop="delegateExpression"
          v-if="listenerForm.listenerType === 'delegateExpressionListener'"
          key="listener-delegate"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.delegateExpression" clearable />
        </el-form-item>
        <template v-if="listenerForm.listenerType === 'scriptListener'">
          <el-form-item
            label="脚本格式"
            prop="scriptFormat"
            key="listener-script-format"
            :rules="{ required: true, trigger: ['blur', 'change'] }"
          >
            <el-input v-model="listenerForm.script.scriptFormat" clearable />
          </el-form-item>
          <el-form-item
            label="脚本类型"
            prop="script.scriptType"
            key="listener-script-type"
            :rules="{ required: true, trigger: ['blur', 'change'] }"
          >
            <el-select v-model="listenerForm.script.scriptType">
              <el-option label="内联脚本" value="inlineScript" />
              <el-option label="外部脚本" value="externalScript" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="脚本内容"
            prop="script.value"
            v-if="listenerForm.script.scriptType === 'inlineScript'"
            key="listener-script"
            :rules="{ required: true, trigger: ['blur', 'change'] }"
          >
            <el-input v-model="listenerForm.script.value" clearable />
          </el-form-item>
          <el-form-item
            label="资源地址"
            prop="script.resource"
            v-if="listenerForm.script.scriptType === 'externalScript'"
            key="listener-resource"
            :rules="{ required: true, trigger: ['blur', 'change'] }"
          >
            <el-input v-model="listenerForm.script.resource" clearable />
          </el-form-item>
        </template>
      </el-form>

      <el-divider />
      <p class="listener-filed__title">
        <span><i class="el-icon-menu"></i>注入字段：</span>
        <el-button size="mini" type="primary" @click="openListenerFieldForm(null)">添加字段</el-button>
      </p>
      <el-table :data="fieldsOfListener" size="mini" border fit style="flex: none">
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="字段名称" min-width="100px" prop="name" />
        <el-table-column
          label="字段类型"
          min-width="80px"
          show-overflow-tooltip
          :formatter="row => fieldTypeObject[row.fieldType]"
        />
        <el-table-column
          label="字段值/表达式"
          min-width="100px"
          show-overflow-tooltip
          :formatter="row => row.string || row.expression"
        />
        <el-table-column label="操作" width="100px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openListenerFieldForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="$alert(scope.row.event)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="listener-form-slider" style="flex: 1"></div>
      <div class="element-listener-add__button">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button size="small" type="primary" @click="addListener">添加</el-button>
      </div>
    </el-drawer>

    <el-dialog title="字段配置" :visible.sync="showListenerFieldForm" width="600px" append-to-body destroy-on-close>
      <el-form :model="listenerFieldForm" size="small" label-width="96px" ref="listenerFieldFormRef">
        <el-form-item label="字段名称：" prop="name" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="listenerFieldForm.name" clearable />
        </el-form-item>
        <el-form-item label="字段类型：" prop="fieldType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerFieldForm.fieldType">
            <el-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :label="fieldTypeObject[i]" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'string'"
          label="字段值："
          prop="string"
          key="field-string"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.string" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerFieldForm.fieldType === 'expression'"
          label="表达式："
          prop="expression"
          key="field-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerFieldForm.expression" clearable />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="mini" @click="showListenerFieldForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveListenerFiled">确 定</el-button>
      </template>
    </el-dialog>
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
      listenersSelf: [],
      listenerForm: {},
      listenerFieldForm: {},
      fieldsOfListener: [],
      showListenerForm: false,
      listenerIndex: 0,
      showListenerFieldForm: false,
      listenerFiledIndex: 0,
      listenerTypeObject: {
        classListener: "Java 类",
        expressionListener: "表达式",
        delegateExpressionListener: "代理表达式",
        scriptListener: "脚本"
      },
      fieldTypeObject: {
        string: "字符串",
        expression: "表达式"
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
  created() {
    this.initModel();
  },
  mounted() {
    // console.log(this);
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
    openListenerForm(listener, index) {
      if (listener) {
        let listenerFormS = JSON.parse(JSON.stringify(listener));
        if (listener.script) {
          Object.assign(listenerFormS.script, {
            ...listener.script,
            scriptType: listener.script.resource ? "externalScript" : "inlineScript"
          });
        }
        for (let key in listenerFormS) {
          this.$set(this.listenerForm, key, listenerFormS[key]);
        }
        this.listenerIndex = index;
        this.fieldsOfListener = listener.fields ? [...listener.fields] : [];
      } else {
        this.listenerForm = {};
        this.listenerIndex = -1;
      }
      this.showListenerForm = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFormRef"]) this.$refs["listenerFormRef"].clearValidate();
      });
    },
    handleCancel() {
      this.showListenerForm = false;
      this.listenerForm = {};
      this.listenerScriptForm = {};
    },
    async addListener() {
      let validateStatus = await this.$refs["listenerFormRef"].validate();
      if (!validateStatus) return;
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
    openListenerFieldForm(filed, index) {
      this.listenerFieldForm = filed ? JSON.parse(JSON.stringify(filed)) : {};
      this.listenerFiledIndex = filed ? index : -1;
      this.showListenerFieldForm = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFieldFormRef"]) this.$refs["listenerFieldFormRef"].clearValidate();
      });
    },
    async saveListenerFiled() {
      let validateStatus = await this.$refs["listenerFieldFormRef"].validate();
      if (validateStatus) {
        const field = this.moddle.create("camunda:Field", {
          name: this.listenerFieldForm.name,
          string: this.listenerFieldForm.string,
          expression: this.listenerFieldForm.expression
        });
        if (this.listenerFiledIndex === -1) {
          if (this.listenerForm.fields) {
            this.listenerFieldForm.fields.push(field);
          } else {
            this.$set(this.listenerForm, "fields", [field]);
          }
        } else {
          this.listenerForm.fields.splice(this.listenerFiledIndex, 1, [field]);
        }
        this.fieldsOfListener = [...this.listenerForm.fields];
        this.showListenerFieldForm = false;
      }
    }
  }
};
</script>
