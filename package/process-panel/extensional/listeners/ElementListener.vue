<template>
  <div class="panel-tab__content">
    <div class="element-property list-property">
      <el-table :data="ownerListenersList" size="mini" max-height="240" border fit>
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="事件类型" min-width="100px" prop="event" />
        <el-table-column label="监听器类型" min-width="100px" show-overflow-tooltip :formatter="row => listenerTypeObject[row.listenerType]" />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openListenerForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListener(row, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openListenerForm(null)">添加监听器</el-button>
    </div>

    <el-drawer :visible.sync="showListenerForm" title="事件监听器" :size="`${this.width}px`" append-to-body destroy-on-close>
      <el-form size="mini" :model="listenerForm" label-width="96px" ref="listenerFormRef" @submit.native.prevent>
        <el-form-item label="事件类型" prop="event" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.event">
            <el-option label="start" value="start" />
            <el-option label="end" value="end" />
          </el-select>
        </el-form-item>
        <el-form-item label="监听器类型" prop="listenerType" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.listenerType" @change="changeListenerType">
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
            prop="script.scriptFormat"
            key="listener-script-format"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本格式' }"
          >
            <el-input v-model="listenerForm.script.scriptFormat" clearable />
          </el-form-item>
          <el-form-item
            label="脚本类型"
            prop="script.scriptType"
            key="listener-script-type"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请选择脚本类型' }"
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
      <el-table :data="fieldsOfListener" size="mini" max-height="240" border fit style="flex: none">
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="字段名称" min-width="100px" prop="name" />
        <el-table-column label="字段类型" min-width="80px" show-overflow-tooltip :formatter="row => fieldTypeObject[row.fieldType]" />
        <el-table-column label="字段值/表达式" min-width="100px" show-overflow-tooltip :formatter="row => row.string || row.expression" />
        <el-table-column label="操作" width="100px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openListenerFieldForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListenerField(row, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="element-drawer__button">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveListenerConfig">保 存</el-button>
      </div>
    </el-drawer>

    <el-dialog title="字段配置" :visible.sync="showListenerFieldForm" width="600px" append-to-body destroy-on-close>
      <el-form :model="listenerFieldForm" size="mini" label-width="96px" ref="listenerFieldFormRef" @submit.native.prevent>
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
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {
      ownerListenersList: [],
      ownerListenersObjectList: [],
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
          this.initListenersTable(newVal);
        } else {
          this.ownerListenersObjectList = [];
          this.ownerListenersList = [];
        }
      }
    }
  },
  created() {
    this.initModel();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    // 初始化依赖
    initModel() {
      if (!this.bpmnModeler) {
        this.timer = setTimeout(() => this.initModel(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      this.moddle = this.bpmnModeler.get("moddle");
    },
    // 初始化监听器实例列表
    initListenersTable(listeners) {
      this.ownerListenersObjectList = listeners;
      this.ownerListenersList = listeners.map(li => {
        let listenerType;
        if (li.class) listenerType = "classListener";
        if (li.expression) listenerType = "expressionListener";
        if (li.delegateExpression) listenerType = "delegateExpressionListener";
        if (li.script) listenerType = "scriptListener";
        return {
          ...JSON.parse(JSON.stringify(li)),
          listenerType: listenerType
        };
      });
    },
    // 打开事件监听器侧边栏
    openListenerForm(listener, index) {
      if (listener) {
        if (listener.script) {
          this.listenerForm = {
            ...listener,
            ...listener.script,
            scriptType: listener.script.resource ? "externalScript" : "inlineScript"
          };
        } else {
          this.listenerForm = { ...listener };
        }
        this.listenerIndex = index;
      } else {
        this.listenerForm = {};
        this.listenerIndex = -1; // 标记为新增
      }
      this.initListenerFields(listener?.fields);
      this.showListenerForm = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFormRef"]) this.$refs["listenerFormRef"].clearValidate();
      });
    },
    // 对 监听器注入的 字段表格 进行赋值
    initListenerFields(fields) {
      if (fields && fields.length) {
        this.fieldsOfListener = fields.map(field => ({ ...field, fieldType: field.string ? "string" : "expression" }));
        return;
      }
      this.fieldsOfListener = [];
    },
    // 取消编辑
    handleCancel() {
      this.showListenerForm = false;
      this.listenerForm = {};
      this.listenerScriptForm = {};
    },
    // 保存事件监听器配置
    async saveListenerConfig() {
      let validateStatus = await this.$refs["listenerFormRef"].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      // 1. 创建事件监听器实例
      const listenerObj = this.initListenerObject(this.listenerForm);
      const listenerModel = this.moddle.create(`${this.prefix}:ExecutionListener`, listenerObj);
      // 2. 判断内部监听器类型是否为脚本格式，脚本需要单独创建实例
      if (this.listenerForm.listenerType === "scriptListener") {
        const scriptObj = this.moddle.create(`${this.prefix}:Script`, this.listenerForm.script);
        listenerModel.script = scriptObj;
      }
      this.$emit("listener-save", listenerModel);
      // 3. 更新到事件监听器列表
      if (this.listenerIndex === -1) {
        this.ownerListenersObjectList.push(listenerModel);
        this.ownerListenersList.push(this.listenerForm);
      } else {
        this.ownerListenersObjectList.splice(this.listenerIndex, 1, listenerModel);
        this.ownerListenersList.splice(this.listenerIndex, 1, this.listenerForm);
      }
      // 3. 更新事件监听器列表到父组件
      this.$emit("change", this.ownerListenersObjectList);
      // 4. 隐藏侧边栏
      this.showListenerForm = false;
      this.listenerForm = {};
    },
    initListenerObject(options) {
      const listenerObj = {};
      listenerObj.event = options.event;
      switch (options.listenerType) {
        case "scriptListener":
          listenerObj.script = this.moddle.create(`${this.prefix}:Script`, { ...this.listenerScriptForm });
          break;
        case "expressionListener":
          listenerObj.expression = options.expression;
          break;
        case "delegateExpressionListener":
          listenerObj.delegateExpression = options.delegateExpression;
          break;
        default:
          listenerObj.class = options.class;
      }
      if (options.fields) {
        listenerObj.fields = options.fields.map(field => {
          return this.moddle.create(`${this.prefix}:Field`, field);
        });
      }
      return listenerObj;
    },
    changeListenerType(type) {
      if (type === "scriptListener") {
        this.$set(this.listenerForm, "script", {});
      } else {
        this.listenerForm.script && delete this.listenerForm.script;
      }
    },
    // 打开事件监听器字段编辑弹窗
    openListenerFieldForm(filed, index) {
      this.listenerFieldForm = filed ? JSON.parse(JSON.stringify(filed)) : {};
      this.listenerFiledIndex = filed ? index : -1;
      this.showListenerFieldForm = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFieldFormRef"]) this.$refs["listenerFieldFormRef"].clearValidate();
      });
    },
    // 保存监听器字段编辑
    async saveListenerFiled() {
      let validateStatus = await this.$refs["listenerFieldFormRef"].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      const filed = { ...this.listenerForm };
      if (this.listenerFiledIndex === -1) {
        if (this.listenerForm.fields) {
          this.listenerForm.fields.push(filed);
        } else {
          this.$set(this.listenerForm, "fields", [filed]);
        }
      } else {
        this.listenerForm.fields.splice(this.listenerFiledIndex, 1, filed);
      }
      this.initListenerFields(this.listenerForm.fields);
      this.showListenerFieldForm = false;
    },
    removeListener(listener, index) {
      const removedListener = this.ownerListenersList.splice(index, 1);
      this.$emit("remove-listener", removedListener);
      this.$emit("change", this.ownerListenersList);
    },
    removeListenerField(field, index) {
      this.listenerForm.fields.splice(index, 1);
      const removedField = this.fieldsOfListener.splice(index, 1);
      this.$emit("remove-field", removedField);
      this.$emit("change", this.ownerListenersList);
    }
  }
};
</script>
