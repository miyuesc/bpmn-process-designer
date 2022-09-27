<template>
  <el-collapse-item name="element-extension-properties">
    <template #title>
      <collapse-title title="扩展属性">
        <lucide-icon name="FileCog" />
      </collapse-title>
      <number-tag :value="extensions.length" margin-left="12px" />
    </template>
    <div class="element-extension-properties">
      <el-table border :data="extensions" style="width: 100%" height="200px">
        <el-table-column label="No" type="index" width="50" />
        <el-table-column label="Name" prop="name" show-overflow-tooltip />
        <el-table-column label="Value" prop="value" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="{ $index }">
            <el-button type="text" @click="removeProperty($index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" class="inline-large-button" icon="el-icon-plus" @click="openPropertyModel(-1)">
        添加扩展属性
      </el-button>
    </div>

    <el-dialog :visible.sync="modelVisible" title="添加扩展属性" width="640px" append-to-body destroy-on-close>
      <el-form ref="formRef" :model="newProperty" :rules="rules" aria-modal="true">
        <el-form-item path="name" label="属性名称( Name )">
          <el-input v-model="newProperty.name" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item path="value" label="属性值( Value )">
          <el-input v-model="newProperty.value" @keydown.enter.prevent />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProperty">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import {
  addExtensionProperty,
  getExtensionProperties,
  removeExtensionProperty
} from "@packages/bo-utils/extensionPropertiesUtil";
import EventEmitter from "@utils/EventEmitter";
import { getActive } from "@packages/bpmn-utils/BpmnDesignerUtils";

export default {
  name: "ElementExtensionProperties",
  data() {
    return {
      extensions: [],
      newProperty: { name: "", value: "" },
      rules: {
        name: { required: true, message: "属性名称不能为空", trigger: ["blur", "change"] },
        value: { required: true, message: "属性值不能为空", trigger: ["blur", "change"] }
      },
      modelVisible: false
    };
  },
  mounted() {
    this.reloadExtensionProperties();
    EventEmitter.on("element-update", this.reloadExtensionProperties);
  },
  methods: {
    async reloadExtensionProperties() {
      this.modelVisible = false;
      await this.$nextTick();
      this.newProperty = { name: "", value: "" };
      this._extensionsRaw = getExtensionProperties(getActive());
      this.extensions = JSON.parse(JSON.stringify(this._extensionsRaw));
    },
    removeProperty(propIndex) {
      removeExtensionProperty(getActive(), this._extensionsRaw[propIndex]);
      this.reloadExtensionProperties();
    },
    async addProperty() {
      await this.$refs.formRef.validate();
      addExtensionProperty(getActive(), this.newProperty);
      await this.reloadExtensionProperties();
    },
    async openPropertyModel() {
      this.modelVisible = true;
      await this.$nextTick();
      this.$refs.formRef.clearValidate();
    }
  }
};
</script>
