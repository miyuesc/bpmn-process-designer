<template>
  <el-collapse-item name="base-info">
    <template #title>
      <collapse-title title="常规信息">
        <lucide-icon name="Info" />
      </collapse-title>
    </template>

    <edit-item label="ID">
      <el-input v-model="elementId" maxlength="32" @change="updateElementId" />
    </edit-item>

    <edit-item label="Name">
      <el-input v-model="elementName" maxlength="20" @change="updateElementName" />
    </edit-item>

    <template v-if="isProcess">
      <edit-item key="version" label="Version">
        <el-input v-model="elementVersion" maxlength="20" @change="updateElementVersion" />
      </edit-item>

      <edit-item key="executable" label="Executable">
        <el-switch v-model="elementExecutable" @change="updateElementExecutable" />
      </edit-item>
    </template>
  </el-collapse-item>
</template>

<script>
import { mapGetters } from "vuex";
import { catchError } from "@utils/printCatch";
import { getNameValue, setNameValue } from "@packages/bo-utils/nameUtil.ts";
import {
  getProcessExecutable,
  getProcessVersionTag,
  setProcessExecutable,
  setProcessVersionTag
} from "@packages/bo-utils/processUtil.ts";
import { setIdValue } from "@packages/bo-utils/idUtil.ts";
import EventEmitter from "@utils/EventEmitter";

export default {
  name: "ElementGenerations",
  data() {
    return {
      elementId: "",
      elementName: "",
      elementVersion: "",
      elementExecutable: true,
      isProcess: false
    };
  },
  computed: {
    ...mapGetters(["getActive", "getActiveId"])
  },
  mounted() {
    this.reloadGenerationData();
    EventEmitter.on("element-update", this.reloadGenerationData);
  },
  methods: {
    reloadGenerationData() {
      this.isProcess = !!this.getActive && this.getActive.type === "bpmn:Process";
      this.elementId = this.getActiveId;
      this.elementName = getNameValue(this.getActive) || "";
      if (this.isProcess) {
        this.elementExecutable = getProcessExecutable(this.getActive);
        this.elementVersion = getProcessVersionTag(this.getActive) || "";
      }
    },
    updateElementName(value) {
      setNameValue(this.getActive, value);
    },
    updateElementId(value) {
      setIdValue(this.getActive, value);
    },
    updateElementVersion(value) {
      const reg = /((\d|([1-9](\d*))).){2}(\d|([1-9](\d*)))/;
      if (reg.test(value)) {
        setProcessVersionTag(this.getActive, value);
      } else {
        catchError("版本号必须符合语义化版本2.0.0 要点");
      }
    },
    updateElementExecutable(value) {
      setProcessExecutable(this.getActive, value);
    }
  }
};
</script>
