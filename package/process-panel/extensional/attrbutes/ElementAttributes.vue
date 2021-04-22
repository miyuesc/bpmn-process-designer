<template>
  <div class="panel-tab__content">
    <div class="element-property list-property">
      <el-table :data="ownerAttributes" size="mini" max-height="240" border fit>
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="属性名" prop="name" min-width="100px" show-overflow-tooltip />
        <el-table-column label="属性值" prop="value" min-width="100px" show-overflow-tooltip />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openAttributesForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeAttributes(row, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openAttributesForm(null, -1)">添加属性</el-button>
    </div>

    <el-dialog :visible.sync="showAttributeForm" title="属性配置" width="600px" append-to-body destroy-on-close>
      <el-form :model="attributeForm" label-width="80px" size="mini" ref="attributeFormRef" @submit.native.prevent>
        <el-form-item label="属性名：" prop="name" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="attributeForm.name" clearable />
        </el-form-item>
        <el-form-item label="属性值：" prop="value" :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="attributeForm.value" clearable />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="mini" @click="showAttributeForm = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveAttribute">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ElementAttributes",
  props: {
    attributes: {
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
      ownerAttributes: [],
      attributeForm: {},
      attributeIndex: -1,
      showAttributeForm: false
    };
  },
  computed: {},
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
    openAttributesForm(attr, index) {
      this.attributeIndex = index;
      this.attributeForm = index === -1 ? {} : JSON.parse(JSON.stringify(attr));
      this.showAttributeForm = true;
      this.$nextTick(() => {
        if (this.$refs["attributeFormRef"]) this.$refs["attributeFormRef"].clearValidate();
      });
    },
    removeAttributes(attr, index) {
      const removedAttr = this.ownerAttributes.splice(index, 1);
      this.$emit("removed", removedAttr);
      this.$emit("change", this.ownerAttributes);
    },
    async saveAttribute() {
      let validateStatus = await this.$refs["attributeFormRef"].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      if (this.attributeIndex === -1) {
        this.ownerAttributes.push(this.attributeForm);
      } else {
        this.ownerAttributes.splice(this.attributeIndex, 1, this.attributeForm);
      }
      this.$emit("saved", this.attributeForm);
      this.$emit("change", this.ownerAttributes);
      this.showAttributeForm = false;
    }
  },
  watch: {
    attributes: {
      deep: true,
      immediate: true,
      handler: function(newVal) {
        if (newVal) {
          this.ownerAttributes = JSON.parse(JSON.stringify(this.attributes[0]?.values || []));
        }
      }
    }
  }
};
</script>
