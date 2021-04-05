<template>
  <div class="panel-tab__content">
    <el-table :data="elementListenersList" size="mini" border>
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
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openListenerForm(null)">添加监听器</el-button>
    </div>

    <!-- 监听器 编辑/创建 部分 -->
    <el-drawer :visible.sync="listenerFormModelVisible" title="事件监听器" :size="`${this.width}px`" append-to-body destroy-on-close>
      <el-form size="mini" :model="listenerForm" label-width="96px" ref="listenerFormRef">
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
          v-if="listenerForm.listenerType === 'classListener'"
          label="Java类"
          prop="class"
          key="listener-class"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.class" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'expressionListener'"
          label="表达式"
          prop="expression"
          key="listener-expression"
          :rules="{ required: true, trigger: ['blur', 'change'] }"
        >
          <el-input v-model="listenerForm.expression" clearable />
        </el-form-item>
        <el-form-item
          v-if="listenerForm.listenerType === 'delegateExpressionListener'"
          label="代理表达式"
          prop="delegateExpression"
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
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本格式' }"
          >
            <el-input v-model="listenerForm.scriptFormat" clearable />
          </el-form-item>
          <el-form-item
            label="脚本类型"
            prop="scriptType"
            key="listener-script-type"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请选择脚本类型' }"
          >
            <el-select v-model="listenerForm.scriptType">
              <el-option label="内联脚本" value="inlineScript" />
              <el-option label="外部脚本" value="externalScript" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="listenerForm.scriptType === 'inlineScript'"
            label="脚本内容"
            prop="value"
            key="listener-script"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本内容' }"
          >
            <el-input v-model="listenerForm.value" clearable />
          </el-form-item>
          <el-form-item
            v-if="listenerForm.scriptType === 'externalScript'"
            label="资源地址"
            prop="resource"
            key="listener-resource"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写资源地址' }"
          >
            <el-input v-model="listenerForm.resource" clearable />
          </el-form-item>
        </template>
      </el-form>
      <el-divider />
      <p class="listener-filed__title">
        <span><i class="el-icon-menu"></i>注入字段：</span>
        <el-button size="mini" type="primary" @click="openListenerFieldForm(null)">添加字段</el-button>
      </p>
      <el-table :data="fieldsListOfListener" size="mini" max-height="240" border fit style="flex: none">
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
        <el-button size="mini" @click="listenerFormModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveListenerConfig">保 存</el-button>
      </div>
    </el-drawer>

    <!-- 注入西段 编辑/创建 部分 -->
    <el-dialog title="字段配置" :visible.sync="listenerFieldFormModelVisible" width="600px" append-to-body destroy-on-close>
      <el-form :model="listenerFieldForm" size="mini" label-width="96px" ref="listenerFieldFormRef">
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
        <el-button size="mini" @click="listenerFieldFormModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveListenerFiled">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "ElementListeners",
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
      elementListenersList: [], // 监听器列表
      listenerForm: {}, // 监听器详情表单
      listenerFormModelVisible: false, // 监听器 编辑 侧边栏显示状态
      fieldsListOfListener: [],
      listenerFieldForm: {}, // 监听器 注入字段 详情表单
      listenerFieldFormModelVisible: false, // 监听器 注入字段表单弹窗 显示状态
      editingListenerIndex: -1, // 监听器所在下标，-1 为新增
      editingListenerFieldIndex: -1, // 字段所在下标，-1 为新增
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
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetListenersList());
      }
    }
  },
  methods: {
    resetListenersList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensionList = [];
      this.bpmnElementListeners =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => {
          if (ex.$type !== `${this.prefix}:ExecutionListener`) {
            this.otherExtensionList.push(ex);
          }
          return ex.$type === `${this.prefix}:ExecutionListener`;
        }) ?? [];
      this.elementListenersList = this.bpmnElementListeners.map(listener => {
        let listenerType;
        if (listener.class) listenerType = "classListener";
        if (listener.expression) listenerType = "expressionListener";
        if (listener.delegateExpression) listenerType = "delegateExpressionListener";
        if (listener.script) listenerType = "scriptListener";
        return {
          ...JSON.parse(JSON.stringify(listener)),
          ...(listener.script ?? {}),
          listenerType: listenerType
        };
      });
    },
    // 打开 监听器详情 侧边栏
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
        this.editingListenerIndex = index;
      } else {
        this.listenerForm = {};
        this.editingListenerIndex = -1; // 标记为新增
      }
      if (listener && listener.fields) {
        this.fieldsListOfListener = listener.fields.map(field => ({ ...field, fieldType: field.string ? "string" : "expression" }));
      } else {
        this.fieldsListOfListener = [];
        this.$set(this.listenerForm, "fields", []);
      }
      // 打开侧边栏并清楚验证状态
      this.listenerFormModelVisible = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFormRef"]) this.$refs["listenerFormRef"].clearValidate();
      });
    },
    // 打开监听器字段编辑弹窗
    openListenerFieldForm(field, index) {
      this.listenerFieldForm = field ? JSON.parse(JSON.stringify(field)) : {};
      this.editingListenerFieldIndex = field ? index : -1;
      this.listenerFieldFormModelVisible = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFieldFormRef"]) this.$refs["listenerFieldFormRef"].clearValidate();
      });
    },
    // 保存监听器注入字段
    async saveListenerFiled() {
      let validateStatus = await this.$refs["listenerFieldFormRef"].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      if (this.editingListenerFieldIndex === -1) {
        this.fieldsListOfListener.push(this.listenerFieldForm);
        this.listenerForm.fields.push(this.listenerFieldForm);
      } else {
        this.fieldsListOfListener.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm);
        this.listenerForm.fields.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm);
      }
      this.listenerFieldFormModelVisible = false;
      this.$nextTick(() => (this.listenerFieldForm = {}));
    },
    // 移除监听器字段
    removeListenerField(field, index) {
      this.$confirm("确认移除该字段吗？", "提示", {
        confirmButtonText: "确 认",
        cancelButtonText: "取 消"
      })
        .then(() => {
          this.fieldsListOfListener.splice(index, 1);
          this.listenerForm.fields.splice(index, 1);
        })
        .catch(() => console.info("操作取消"));
    },
    // 移除监听器
    removeListener(listener, index) {
      this.$confirm("确认移除该监听器吗？", "提示", {
        confirmButtonText: "确 认",
        cancelButtonText: "取 消"
      })
        .then(() => {
          this.bpmnElementListeners.splice(index, 1);
          this.elementListenersList.splice(index, 1);
          this.updateElementExtensions();
        })
        .catch(() => console.info("操作取消"));
    },
    // 保存监听器配置
    async saveListenerConfig() {
      let validateStatus = await this.$refs["listenerFormRef"].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      const listenerObject = window.bpmnInstances.moddle.create(`${this.prefix}:ExecutionListener`, this.initListenerObject(this.listenerForm));
      if (this.editingListenerIndex === -1) {
        this.bpmnElementListeners.push(listenerObject);
        this.elementListenersList.push(this.listenerForm);
      } else {
        this.bpmnElementListeners.splice(this.editingListenerIndex, 1, listenerObject);
        this.elementListenersList.splice(this.editingListenerIndex, 1, this.listenerForm);
      }
      this.updateElementExtensions();
      // 4. 隐藏侧边栏
      this.listenerFormModelVisible = false;
      this.listenerForm = {};
    },
    // 创建监听器实例
    initListenerObject(options) {
      const listenerObj = Object.create(null);
      listenerObj.event = options.event;
      switch (options.listenerType) {
        case "scriptListener":
          listenerObj.script = this.initScriptObject();
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
          return this.initFieldObject(field);
        });
      }
      return listenerObj;
    },
    // 创建 脚本 实例
    initScriptObject() {
      const { scriptType, scriptFormat, value, resource } = this.listenerForm;
      const scriptConfig = scriptType === "inlineScript" ? { scriptFormat, value } : { scriptFormat, resource };
      return window.bpmnInstances.moddle.create(`${this.prefix}:Script`, scriptConfig);
    },
    // 创建 字段 实例
    initFieldObject(option) {
      const { name, fieldType, string, expression } = option;
      const fieldConfig = fieldType === "string" ? { name, string } : { name, expression };
      return window.bpmnInstances.moddle.create(`${this.prefix}:Field`, fieldConfig);
    },
    // 更新元素扩展属性
    updateElementExtensions() {
      const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
        values: this.otherExtensionList.concat(this.bpmnElementListeners)
      });
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        extensionElements: extensions
      });
    }
  }
};
</script>
