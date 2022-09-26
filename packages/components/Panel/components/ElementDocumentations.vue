<template>
  <el-collapse-item name="element-documentations">
    <template #title>
      <collapse-title title="附加文档">
        <lucide-icon name="FileText" />
      </collapse-title>
    </template>
    <edit-item label="Documentation" :label-width="120">
      <el-input v-model="elementDoc" type="textarea" @change="updateElementDoc" />
    </edit-item>
  </el-collapse-item>
</template>

<script>
import { getDocumentValue, setDocumentValue } from "@packages/bo-utils/documentationUtil";
import EventEmitter from "@utils/EventEmitter";
import { mapGetters } from "vuex";

export default {
  name: "ElementDocumentations",
  data() {
    return {
      elementDoc: ""
    };
  },
  computed: {
    ...mapGetters(["getActive", "getActiveId"])
  },
  watch: {
    getActiveId: {
      immediate: true,
      handler() {
        this.elementDoc = getDocumentValue(this.getActive) || "";
      }
    }
  },
  mounted() {
    this.elementDoc = getDocumentValue(this.getActive) || "";
    EventEmitter.on("element-update", () => {
      this.elementDoc = getDocumentValue(this.getActive) || "";
    });
  },
  methods: {
    updateElementDoc(value) {
      setDocumentValue(this.getActive, value);
    }
  }
};
</script>
