<template>
  <el-collapse-item name="element-async-continuations">
    <template #title>
      <collapse-title title="异步属性">
        <lucide-icon name="Shuffle" />
      </collapse-title>
    </template>
    <edit-item label="Before" :label-width="120">
      <el-switch v-model="acBefore" @change="updateElementACBefore" />
    </edit-item>
    <edit-item label="After" :label-width="120">
      <el-switch v-model="acAfter" @change="updateElementACAfter" />
    </edit-item>
    <edit-item v-if="showExclusive" label="Exclusive" :label-width="120">
      <el-switch v-model="acExclusive" @change="updateElementACExclusive" />
    </edit-item>
  </el-collapse-item>
</template>

<script>
import {
  getACAfter,
  getACBefore,
  getACExclusive,
  setACAfter,
  setACBefore,
  setACExclusive
} from "@packages/bo-utils/asynchronousContinuationsUtil";
import EventEmitter from "@utils/EventEmitter";
import { mapGetters } from "vuex";

export default {
  name: "ElementAsyncContinuations",
  data() {
    return {
      acBefore: false,
      acAfter: false,
      acExclusive: false
    };
  },
  computed: {
    ...mapGetters(["getActive", "getActiveId"]),
    showExclusive() {
      return this.acBefore || this.acAfter;
    }
  },
  mounted() {
    this.reloadACStatus();
    EventEmitter.on("element-update", this.reloadACStatus);
  },
  methods: {
    reloadACStatus() {
      this.acBefore = getACBefore(this.getActive);
      this.acAfter = getACAfter(this.getActive);
      this.acExclusive = getACExclusive(this.getActive);
    },
    updateElementACBefore(value) {
      setACBefore(this.getActive, value);
      this.reloadACStatus();
    },
    updateElementACAfter(value) {
      setACAfter(this.getActive, value);
      this.reloadACStatus();
    },
    updateElementACExclusive(value) {
      setACExclusive(this.getActive, value);
      this.reloadACStatus();
    }
  }
};
</script>
