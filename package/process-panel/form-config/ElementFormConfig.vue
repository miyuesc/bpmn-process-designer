<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="表单key">
        <el-input v-model="formKey" size="mini" clearable @change="$emit('change-form-key', formKey)" @keyup.native="$emit('change-form-key', formKey)" />
      </el-form-item>
    </el-form>
    <div class="element-property list-property">
      <el-divider><i class="el-icon-coin"></i> 表单字段</el-divider>
      <el-table :data="formFieldsList" size="mini" max-height="240" border fit>
        <el-table-column label="序号" type="index" width="50px" />
        <el-table-column label="字段名称" prop="label" min-width="80px" show-overflow-tooltip />
        <el-table-column label="字段类型" prop="type" min-width="80px" :formatter="row => fieldType[row.type] || row.type" show-overflow-tooltip />
        <el-table-column label="默认值" prop="defaultValue" min-width="80px" show-overflow-tooltip />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openFieldForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeField(row, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openFieldForm(null, -1)">添加字段</el-button>
    </div>

    <el-drawer :visible.sync="fieldModelVisible" :title="drawerTitle" :size="`${this.width}px`" append-to-body destroy-on-close>
      <el-form :model="formFieldForm" label-width="90px" size="mini" @submit.native.prevent>
        <el-form-item label="字段ID">
          <el-input v-model="formFieldForm.id" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formFieldForm.typeType" placeholder="请选择字段类型" clearable @change="changeFieldTypeType">
            <el-option v-for="(value, key) of fieldType" :label="value" :value="key" :key="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型名称" v-if="formFieldForm.typeType === 'custom'">
          <el-input v-model="formFieldForm.type" clearable />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formFieldForm.label" clearable />
        </el-form-item>
        <el-form-item label="默认值">
          <el-input v-model="formFieldForm.defaultValue" clearable />
        </el-form-item>
      </el-form>
      <!-- 枚举值设置 -->
      <template v-if="formFieldForm.type === 'enum'">
        <el-divider key="enum-divider" />
        <p class="listener-filed__title" key="enum-title">
          <span><i class="el-icon-menu"></i>枚举值列表：</span>
          <el-button size="mini" type="primary" @click="openFieldOptionForm(null, -1, 'enum')">添加枚举值</el-button>
        </p>
        <el-table :data="fieldEnumValues" size="mini" key="enum-table" max-height="240" border fit>
          <el-table-column label="序号" width="50px" type="index" />
          <el-table-column label="枚举值编号" prop="id" min-width="100px" show-overflow-tooltip />
          <el-table-column label="枚举值名称" prop="name" min-width="100px" show-overflow-tooltip />
          <el-table-column label="操作" width="90px">
            <template slot-scope="{ row, $index }">
              <el-button size="mini" type="text" @click="openFieldOptionForm(row, $index, 'enum')">编辑</el-button>
              <el-divider direction="vertical" />
              <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeFieldOptionItem(row, $index, 'enum')">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 校验规则 -->
      <el-divider key="validation-divider" />
      <p class="listener-filed__title" key="validation-title">
        <span><i class="el-icon-menu"></i>约束条件列表：</span>
        <el-button size="mini" type="primary" @click="openFieldOptionForm(null, -1, 'constraint')">添加约束</el-button>
      </p>
      <el-table :data="fieldConstraintsList" size="mini" key="validation-table" max-height="240" border fit>
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="约束名称" prop="name" min-width="100px" show-overflow-tooltip />
        <el-table-column label="约束配置" prop="config" min-width="100px" show-overflow-tooltip />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openFieldOptionForm(row, $index, 'constraint')">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeFieldOptionItem(row, $index, 'constraint')">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 表单属性 -->
      <el-divider key="property-divider" />
      <p class="listener-filed__title" key="property-title">
        <span><i class="el-icon-menu"></i>字段属性列表：</span>
        <el-button size="mini" type="primary" @click="openFieldOptionForm(null, -1, 'property')">添加属性</el-button>
      </p>
      <el-table :data="fieldPropertiesList" size="mini" key="property-table" max-height="240" border fit>
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="属性编号" prop="id" min-width="100px" show-overflow-tooltip />
        <el-table-column label="属性值" prop="value" min-width="100px" show-overflow-tooltip />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openFieldOptionForm(row, $index, 'property')">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeFieldOptionItem(row, $index, 'property')">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部按钮 -->
      <div class="element-drawer__button">
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveField">保 存</el-button>
      </div>
    </el-drawer>

    <el-dialog :visible.sync="fieldOptionModelVisible" :title="optionModelTitle" width="600px" append-to-body destroy-on-close>
      <el-form :model="fieldOptionForm" size="mini" label-width="96px" @submit.native.prevent>
        <el-form-item label="编号/ID" v-if="fieldOptionType !== 'constraint'" key="option-id">
          <el-input v-model="fieldOptionForm.id" clearable />
        </el-form-item>
        <el-form-item label="名称" v-if="fieldOptionType !== 'property'" key="option-name">
          <el-input v-model="fieldOptionForm.name" clearable />
        </el-form-item>
        <el-form-item label="配置" v-if="fieldOptionType === 'constraint'" key="option-config">
          <el-input v-model="fieldOptionForm.config" clearable />
        </el-form-item>
        <el-form-item label="值" v-if="fieldOptionType === 'property'" key="option-value">
          <el-input v-model="fieldOptionForm.value" clearable />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="mini" @click="fieldOptionModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveFieldOption">确 定</el-button>
      </template>
    </el-dialog>
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
    return {
      formKey: "",
      formFieldsList: [],
      formFieldForm: {},
      formFieldIndex: -1,
      formFieldOptionIndex: -1,
      fieldModelVisible: false,
      fieldOptionModelVisible: false,
      fieldOptionForm: {},
      fieldOptionType: "",
      fieldType: {
        long: "长整型",
        string: "字符串",
        boolean: "布尔类",
        date: "日期类",
        enum: "枚举类",
        custom: "自定义类型"
      },
      fieldEnumValues: [],
      fieldConstraintsList: [],
      fieldPropertiesList: []
    };
  },
  computed: {
    drawerTitle() {
      return this.formFieldIndex === -1 ? "添加字段" : "编辑字段";
    },
    optionModelTitle() {
      return "配置";
    }
  },
  watch: {
    elementBusinessObject: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!this.moddle || !this.elementRegistry) {
          this.initModel();
        }
        val && val.id && this.initFromData();
      }
    }
  },
  created() {
    // this.initModel();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    /* 初始化 */
    initModel() {
      if (!this.bpmnModeler) {
        this.timer = setTimeout(() => this.initModel(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      this.moddle = this.bpmnModeler.get("moddle");
      this.elementRegistry = this.bpmnModeler.get("elementRegistry");
      this.modeling = this.bpmnModeler.get("modeling");
    },
    /* 初始化表单数据 */
    initFromData() {
      // 获取当前元素
      this.element = this.elementRegistry.get(this.elementId) || null;
      if (!this.element) return;
      // 获取元素扩展属性 或者 创建扩展属性
      this.elExtensionElements = this.element.businessObject.get("extensionElements") || this.moddle.create("bpmn:ExtensionElements", { values: [] });
      // 获取元素表单配置 或者 创建新的表单配置
      this.formData =
        this.elExtensionElements.values.filter(ex => ex.$type === `${this.prefix}:FormData`)?.[0] ||
        this.moddle.create(`${this.prefix}:FormData`, { fields: [] });
      // 保留剩余扩展元素，便于后面更新该元素对应属性
      this.elementOtherExtensions = this.elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:FormData`);
      // 填充表格
      this.formFieldsList = this.formData.fields || [];
    },
    /* 打开字段编辑侧边栏 */
    openFieldForm(field, index) {
      this.formFieldIndex = index;
      this.formFieldForm = field ? JSON.parse(JSON.stringify(field)) : {};
      if (field) {
        this.editingField = field;
        this.formFieldForm.typeType = field.type;
        field && !this.fieldType[field.type] && (this.formFieldForm.typeType = "custom");
      } else {
        this.editingField = null;
      }
      this.createFormField(field || {});
      // 初始化枚举值列表
      if (field && field.type === "enum") {
        this.fieldEnumValues = field?.values || [];
      } else {
        this.fieldEnumValues = [];
      }
      // 初始化约束条件列表
      this.fieldConstraintsList = field?.validation?.constraints || [];
      // 初始化自定义属性列表
      this.fieldPropertiesList = field?.properties?.values || [];
      this.fieldModelVisible = true;
    },
    /* 根据类型调整字段type */
    changeFieldTypeType(type) {
      this.$set(this.formFieldForm, "type", type === "custom" ? "" : type);
    },
    // 单例模式，编辑当前选中的字段配置
    createFormField(options) {
      if (!this.editingField) {
        this.editingField = this.moddle.create(`${this.prefix}:FormField`);
      }
      const safeOptions = { ...this.editingField };
      delete safeOptions.$type;
      delete safeOptions.$attrs;
      delete safeOptions.$parent;
      this.modeling.updateModdleProperties(this.element, this.editingField, { ...safeOptions, ...options });
      return this.editingField;
    },
    /* 打开弹窗 */
    openFieldOptionForm(option, index, type) {
      this.fieldOptionModelVisible = true;
      this.fieldOptionType = type;
      this.formFieldOptionIndex = index;
      if (type === "property") {
        this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {};
        return;
      }
      if (type === "enum") {
        this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {};
        return;
      }
      this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {};
    },
    /* 移除字段的某项配置 */
    removeFieldOptionItem(option, index, type) {
      if (type === "property") {
        this.editingField.properties.values.splice(index, 1);
        return;
      }
      if (type === "enum") {
        this.editingField.values.splice(index, 1);
        return;
      }
      this.editingField.validation.constraints.splice(index, 1);
    },
    /* 保存字段的某项配置 */
    saveFieldOption() {
      let option;
      let parent;
      if (this.fieldOptionType === "property") {
        option = this.moddle.create(`${this.prefix}:Property`, { id: this.fieldOptionForm.id, value: this.fieldOptionForm.value });
        parent = this.editingField.properties || this.moddle.create(`${this.prefix}:Properties`, { values: [] });
      } else if (this.fieldOptionType === "enum") {
        option = this.moddle.create(`${this.prefix}:Value`, { id: this.fieldOptionForm.id, name: this.fieldOptionForm.name });
        // parent = this.editingField.values || [];
      } else {
        option = this.moddle.create(`${this.prefix}:Constraint`, { name: this.fieldOptionForm.name, config: this.fieldOptionForm.config });
        parent = this.editingField.validation || this.moddle.create(`${this.prefix}:Validation`, { constraints: [] });
      }
      if (this.formFieldOptionIndex === -1) {
        if (this.fieldOptionType === "property") {
          parent.values.push(option);
          this.formFieldIndex === -1 && this.fieldPropertiesList.push(option);
        }
        if (this.fieldOptionType === "constraint") {
          parent.constraints.push(option);
          this.formFieldIndex === -1 && this.fieldConstraintsList.push(option);
        }
        if (this.fieldOptionType === "enum") {
          this.editingField.values && this.editingField.values.push(option);
          !this.editingField.values && (this.editingField.values = [option]);
          this.formFieldIndex === -1 && this.fieldEnumValues.push(option);
        }
      } else {
        this.fieldOptionType === "property" && parent.values.splice(this.formFieldOptionIndex, 1, option);
        this.fieldOptionType === "constraint" && parent.constraints.splice(this.formFieldOptionIndex, 1, option);
        this.fieldOptionType === "enum" && this.editingField.values.splice(this.formFieldOptionIndex, 1, option);
      }
      let fieldOption = this.fieldOptionType === "property" ? { properties: parent } : { validation: parent };

      // this.modeling.updateModdleProperties(this.element, this.editingField, fieldOption);
      this.createFormField(fieldOption);
      this.fieldOptionModelVisible = false;
    },
    /* 移除某个字段 */
    removeField(field, index) {
      this.formData.fields.splice(index, 1);
      this.updateElementExtensions();
    },
    /* 保存字段配置 */
    saveField() {
      // 复制基础信息来更新
      const fieldForm = {
        id: this.formFieldForm.id,
        type: this.formFieldForm.type,
        label: this.formFieldForm.label,
        defaultValue: this.formFieldForm.defaultValue
      };
      const fields = this.createFormField(fieldForm);
      if (this.formFieldIndex === -1) {
        this.formData.fields.push(fields);
      } else {
        this.formData.fields.splice(this.formFieldIndex, 1, fields);
      }
      this.updateElementExtensions();
      this.fieldModelVisible = false;
    },
    updateElementExtensions() {
      // 更新回扩展元素
      const newElExtensionElements = this.moddle.create(`bpmn:ExtensionElements`, {
        values: this.elementOtherExtensions.concat(this.formData)
      });
      // 更新到元素上
      this.modeling.updateProperties(this.element, {
        extensionElements: newElExtensionElements
      });
    }
  }
};
</script>
