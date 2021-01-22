<template>
  <div class="panel-tab__content">
    <el-form size="small" label-width="90px" label-suffix="：">
      <el-form-item label="表单key">
        <el-input v-model="formKey" size="small" clearable @change="$emit('change-form-key', formKey)" @keyup.native="$emit('change-form-key', formKey)" />
      </el-form-item>
    </el-form>
    <el-divider><i class="el-icon-coin"></i> 表单字段</el-divider>
    <el-table :data="formFieldsList" size="mini">
      <el-table-column label="序号" type="index" width="50px" />
      <el-table-column label="字段名称" prop="label" min-width="80px" show-overflow-tooltip />
      <el-table-column label="字段类型" prop="type" min-width="80px" show-overflow-tooltip />
      <el-table-column label="默认值" prop="defaultValue" min-width="80px" show-overflow-tooltip />
      <el-table-column>
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="openFieldForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeField(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
      formFieldsList: []
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    openFieldForm() {},
    removeField() {}
  }
};
</script>
