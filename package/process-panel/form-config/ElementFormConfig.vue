<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" label-suffix="：">
      <el-form-item label="表单key">
        <el-input v-model="formKey" size="mini" clearable @change="$emit('change-form-key', formKey)" @keyup.native="$emit('change-form-key', formKey)" />
      </el-form-item>
    </el-form>
    <div class="element-property list-property">
      <el-divider><i class="el-icon-coin"></i> 表单字段</el-divider>
      <el-table :data="formFieldsList" size="mini" border fit>
        <el-table-column label="序号" type="index" width="50px" />
        <el-table-column label="字段名称" prop="label" min-width="80px" show-overflow-tooltip />
        <el-table-column label="字段类型" prop="type" min-width="80px" show-overflow-tooltip />
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
    <div class="element-listener-add__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openFieldForm(null, -1)">添加字段</el-button>
    </div>

    <el-drawer :visible.sync="fieldModelVisible" :title="drawerTitle" :size="`${this.width}px`" append-to-body destroy-on-close>
      <el-form :model="formFieldForm" label-width="90px" label-suffix="：" size="mini">
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
          <el-button size="mini" type="primary">添加枚举值</el-button>
        </p>
        <el-table :data="fieldEnumValues" size="mini" key="enum-table" border fit>
          <el-table-column label="序号" width="50px" type="index" />
          <el-table-column label="枚举值编号" min-width="100px" show-overflow-tooltip />
          <el-table-column label="枚举值名称" min-width="100px" show-overflow-tooltip />
          <el-table-column label="操作" width="90px">
            <template slot-scope="{ row, $index }">
              <el-button size="mini" type="text" @click="openFieldEnumForm(row, $index)">编辑</el-button>
              <el-divider direction="vertical" />
              <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeFieldEnum(row, $index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 校验规则 -->
      <el-divider key="validation-divider" />
      <p class="listener-filed__title" key="validation-title">
        <span><i class="el-icon-menu"></i>约束条件列表：</span>
        <el-button size="mini" type="primary">添加约束</el-button>
      </p>
      <el-table :data="fieldConstraintsList" size="mini" key="validation-table" border fit>
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="约束名称" min-width="100px" show-overflow-tooltip />
        <el-table-column label="约束配置" min-width="100px" show-overflow-tooltip />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openFieldEnumForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeFieldEnum(row, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 表单属性 -->
      <el-divider key="property-divider" />
      <p class="listener-filed__title" key="property-title">
        <span><i class="el-icon-menu"></i>字段属性列表：</span>
        <el-button size="mini" type="primary">添加属性</el-button>
      </p>
      <el-table :data="fieldPropertiesList" size="mini" key="property-table" border fit>
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="属性编号" min-width="100px" show-overflow-tooltip />
        <el-table-column label="属性值" min-width="100px" show-overflow-tooltip />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openFieldEnumForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeFieldEnum(row, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部按钮 -->
      <div class="listener-form-slider" style="flex: 1"></div>
      <div class="element-listener-add__button">
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveField">保 存</el-button>
      </div>
    </el-drawer>
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
      fieldModelVisible: false,
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
      console.log(this.formData);
    },
    /* 打开字段编辑侧边栏 */
    openFieldForm(field, index) {
      this.formFieldIndex = index;
      this.formFieldForm = field ? JSON.parse(JSON.stringify(field)) : {};
      if (field) {
        this.formFieldForm.typeType = field.type;
        field && !this.fieldType[field.type] && (this.formFieldForm.typeType = "custom");
      }
      this.fieldModelVisible = true;
    },
    /* 根据类型调整字段type */
    changeFieldTypeType(type) {
      this.$set(this.formFieldForm, "type", type === "custom" ? "" : type);
    },
    openFieldEnumForm() {},
    removeFieldEnum() {},
    removeField() {},
    /* 保存字段配置 */
    saveField() {
      const fieldForm = JSON.parse(JSON.stringify(this.formFieldForm));
      delete fieldForm.typeType;
      const fields = this.moddle.create(`${this.prefix}:FormField`, fieldForm);
      if (this.formFieldIndex === -1) {
        this.formData.fields.push(fields);
      } else {
        this.formData.fields.splice(this.formFieldIndex, 1, fields);
      }

      // 更新回扩展元素
      const newElExtensionElements = this.moddle.create(`bpmn:ExtensionElements`, {
        values: this.elementOtherExtensions.concat(this.formData)
      });

      this.modeling.updateProperties(this.element, {
        extensionElements: newElExtensionElements
      });

      console.log(this.element);
      this.fieldModelVisible = false;
    }
  }
};
</script>
