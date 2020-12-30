<template>
  <div class="panel-tab__content">
    <div class="element-property list-property">
      <el-table :data="ownerAttributes" size="mini" border fit>
        <el-table-column label="序号" width="50px" type="index" />
        <el-table-column label="属性名" prop="name" min-width="100px" show-overflow-tooltip />
        <el-table-column label="属性值" prop="value" min-width="100px" show-overflow-tooltip />
        <el-table-column label="操作" width="100px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="openAttributesForm(row, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeAttributes(row, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="element-listener-add__button">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="openAttributesForm(null, -1)">添加属性</el-button>
    </div>

    <el-dialog :visible.sync="showAttributeForm" title="属性配置" width="600px" append-to-body destroy-on-close>
      <el-form :model="attributeForm" label-width="80px" size="small" ref="attributeFormRef">
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
    prefix: "propertiesPrefix",
    width: "drawerWidth"
  },
  data() {
    return {
      ownerAttributes: [],
      attributeForm: {},
      attribute: 0,
      showAttributeForm: false
    };
  },
  computed: {},
  created() {},
  methods: {
    openAttributesForm(attr, index) {
      this.attributeForm = index === -1 ? {} : JSON.parse(JSON.stringify(attr));
      this.showAttributeForm = true;
      this.$nextTick(() => {
        if (this.$refs["attributeFormRef"]) this.$refs["attributeFormRef"].clearValidate();
      });
    },
    removeAttributes(attr, index) {
      console.log(attr, index);
    },
    saveAttribute() {}
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
