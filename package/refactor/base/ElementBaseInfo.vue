<template>
  <el-form size="mini" label-width="90px" label-suffix="：">
    <el-form-item label="ID">
      <el-input v-model="elementBaseInfo.id" :disabled="idEditDisabled || elementBaseInfo.$type === 'bpmn:Process'" clearable @change="updateBaseInfo('id')" />
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
    </el-form-item>
    <!--流程的基础属性-->
    <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
      <el-form-item label="版本标签">
        <el-input v-model="elementBaseInfo.versionTag" clearable @change="updateBaseInfo('versionTag')" />
      </el-form-item>
      <el-form-item label="可执行">
        <el-switch v-model="elementBaseInfo.isExecutable" active-text="是" inactive-text="否" @change="updateBaseInfo('isExecutable')" />
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
export default {
  name: "ElementBaseInfo",
  props: {
    baseInfo: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: String,
      default: ""
    },
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      elementBaseInfo: {}
    };
  },
  watch: {
    baseInfo: {
      immediate: true,
      handler: function(newVal) {
        this.elementBaseInfo = JSON.parse(JSON.stringify(newVal));
      }
    }
  },
  methods: {
    updateBaseInfo(key) {
      !this.bpmnElement && (this.element = window.bpmnInstances.elementRegistry.get(this.id));
      const attrObj = Object.create(null);
      attrObj[key] = this.elementBaseInfo[key];
      if (key === "id") {
        this.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: this.elementBaseInfo[key] }
        });
      } else {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
      }
    }
  }
};
</script>
