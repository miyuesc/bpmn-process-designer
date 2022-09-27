<template>
  <el-collapse-item name="element-execution-listeners">
    <template #title>
      <collapse-title title="执行监听">
        <lucide-icon name="Radio" />
      </collapse-title>
      <number-tag :value="listeners.length" margin-left="12px" />
    </template>
    <div class="element-extension-listeners">
      <el-table border :data="listeners" style="width: 100%" height="200px">
        <el-table-column label="No" type="index" width="50" />
        <el-table-column label="EventType" prop="event" show-overflow-tooltip />
        <el-table-column label="ListenerType" prop="type" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="{ row, $index }">
            <el-button type="text" @click="openListenerModel($index, row)">编辑</el-button>
            <el-button type="text" @click="removeListener($index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" class="inline-large-button" icon="el-icon-plus" @click="openListenerModel(-1)">
        添加执行监听
      </el-button>
    </div>

    <el-dialog :visible.sync="modelVisible" title="添加执行监听器" width="640px" append-to-body destroy-on-close>
      <el-form ref="formRef" :model="newListener" :rules="formRules" class="need-filled" aria-modal="true">
        <el-form-item path="event" label="事件类型( Event Type )">
          <el-select v-model="newListener.event">
            <el-option
              v-for="{ label, value } in listenerEventTypeOptions"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item path="type" label="监听器类型( Listener Type )">
          <el-select v-model="newListener.type" @change="updateListenerType">
            <el-option v-for="{ label, value } in listenerTypeOptions" :label="label" :value="value" :key="value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formItemVisible.listenerType === 'class'" path="class" label="Java类( Java Class )">
          <el-input v-model="newListener.class" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'expression'"
          path="expression"
          label="条件表达式( Expression )"
        >
          <el-input v-model="newListener.expression" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item
          v-if="formItemVisible.listenerType === 'delegateExpression'"
          path="delegateExpression"
          label="代理条件表达式( Delegate Expression )"
        >
          <el-input v-model="newListener.delegateExpression" @keydown.enter.prevent />
        </el-form-item>
        <template v-if="formItemVisible.listenerType === 'script' && newListener.script">
          <el-form-item key="scriptFormat" path="script.scriptFormat" label="脚本格式( Script Format )">
            <el-input v-model="newListener.script.scriptFormat" @keydown.enter.prevent />
          </el-form-item>
          <el-form-item key="scriptType" path="script.scriptType" label="脚本类型( Script Type )">
            <el-select v-model="newListener.script.scriptType" @change="updateScriptType">
              <el-option v-for="{ label, value } in scriptTypeOptions" :label="label" :value="value" :key="value" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formItemVisible.scriptType === 'inline'"
            key="scriptContent"
            path="script.value"
            label="脚本内容( Script Content )"
          >
            <el-input v-model="newListener.script.value" type="textarea" @keydown.enter.prevent />
          </el-form-item>
          <el-form-item
            v-if="formItemVisible.scriptType === 'external'"
            key="scriptResource"
            path="script.resource"
            label="外链脚本地址( Script Resource )"
          >
            <el-input v-model="newListener.script.resource" @keydown.enter.prevent />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="modelVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveExecutionListener">确 认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script>
import { listenerTypeOptions, scriptTypeOptions } from "@packages/preset-configuration/enumsOption";
import {
  addExecutionListener,
  getDefaultEvent,
  getExecutionListeners,
  getExecutionListenerType,
  getExecutionListenerTypes,
  removeExecutionListener,
  updateExecutionListener
} from "@packages/bo-utils/executionListenersUtil";
import { getScriptType } from "@packages/bo-utils/scriptUtil";
import EventEmitter from "@utils/EventEmitter";
import { getActive } from "@packages/bpmn-utils/BpmnDesignerUtils";

export default {
  name: "ElementExecutionListeners",
  data() {
    return {
      modelVisible: false,
      listeners: [],
      newListener: {},
      formRules: {
        event: { required: true, trigger: ["blur", "change"], message: "事件类型不能为空" },
        type: { required: true, trigger: ["blur", "change"], message: "监听器类型不能为空" }
      },
      formItemVisible: {
        listenerType: "class",
        scriptType: "none"
      },
      listenerEventTypeOptions: [],
      listenerTypeOptions: listenerTypeOptions,
      scriptTypeOptions: scriptTypeOptions
    };
  },

  mounted() {
    this.reloadExtensionListeners();
    EventEmitter.on("element-update", this.reloadExtensionListeners);
  },
  methods: {
    reloadExtensionListeners() {
      this.modelVisible = false;
      this.updateListenerType("class");
      this.newListener = { event: getDefaultEvent(getActive()), type: "class" };
      this.listenerEventTypeOptions = getExecutionListenerTypes(getActive());
      this._listenersRaw = getExecutionListeners(getActive());
      const list = this._listenersRaw.map((item) => ({
        ...item,
        ...(item.script
          ? {
              script: { ...item.script, scriptType: getScriptType(item.script) }
            }
          : {}),
        type: getExecutionListenerType(item)
      }));
      this.listeners = JSON.parse(JSON.stringify(list));
    },

    updateListenerType(value) {
      this.formItemVisible.listenerType = value;
      this.newListener = {
        ...this.newListener,
        type: value,
        ...(value === "script" ? { script: this.newListener.script || {} } : {})
      };
    },
    updateScriptType(value) {
      this.formItemVisible.scriptType = value;
      this.newListener.script = {
        scriptFormat: this.newListener.script?.scriptFormat,
        scriptType: value
      };
    },
    removeListener(index) {
      const listener = this._listenersRaw[index];
      removeExecutionListener(getActive(), listener);
      this.reloadExtensionListeners();
    },
    async saveExecutionListener(index) {
      await this.$refs.formRef.validate();
      this.activeIndex === -1
        ? addExecutionListener(getActive(), this.newListener)
        : updateExecutionListener(getActive(), this.newListener, this._listenersRaw[this.activeIndex]);
      this.reloadExtensionListeners();
    },

    async openListenerModel(index, listenerData) {
      this.activeIndex = index;
      listenerData && (this.newListener = JSON.parse(JSON.stringify(listenerData)));
      this.updateListenerType(listenerData?.type || "class");
      this.modelVisible = true;
      await this.$nextTick();
      this.$refs.formRef && this.$refs.formRef.clearValidate();
    }
  }
};
</script>
