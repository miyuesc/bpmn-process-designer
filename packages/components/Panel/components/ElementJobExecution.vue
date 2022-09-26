<template>
  <el-collapse-item name="element-external-task">
    <template #title>
      <collapse-title title="执行作业">
        <lucide-icon name="CalendarClock" />
      </collapse-title>
    </template>
    <div class="element-external-task">
      <edit-item v-if="tpVisible" label="任务优先级" :label-width="100">
        <el-input v-model="taskPriority" maxlength="32" @change="setExternalTaskPriority" />
      </edit-item>
      <edit-item v-if="rtVisible" label="重试周期" :label-width="100">
        <el-input v-model="retryTimeCycle" maxlength="32" @change="setRetryTimeCycle" />
      </edit-item>
    </div>
  </el-collapse-item>
</template>

<script>
import { mapGetters } from "vuex";
import EventEmitter from "@utils/EventEmitter";
import {
  getExternalTaskValue,
  getRetryTimeCycleValue,
  retryTimeCycleVisible,
  setExternalTaskValue,
  setRetryTimeCycleValue,
  taskPriorityVisible
} from "@packages/bo-utils/jobExecutionUtil";

export default {
  name: "ElementJobExecution",
  data() {
    return {
      retryTimeCycle: undefined,
      rtVisible: false,
      taskPriority: undefined,
      tpVisible: false
    };
  },
  computed: {
    ...mapGetters(["getActive", "getActiveId"])
  },
  watch: {
    getActiveId: {
      immediate: true,
      handler() {
        this.getRetryTimeCycle();
        this.getExternalTaskPriority();
      }
    }
  },
  mounted() {
    this.getRetryTimeCycle();
    this.getExternalTaskPriority();

    EventEmitter.on("element-update", () => {
      this.getRetryTimeCycle();
      this.getExternalTaskPriority();
    });
  },
  methods: {
    getRetryTimeCycle() {
      this.rtVisible = retryTimeCycleVisible(this.getActive);
      this.retryTimeCycle = getRetryTimeCycleValue(this.getActive) || "";
    },
    getExternalTaskPriority() {
      this.tpVisible = taskPriorityVisible(this.getActive);
      this.taskPriority = getExternalTaskValue(this.getActive) || "";
    },
    setRetryTimeCycle(value) {
      setRetryTimeCycleValue(this.getActive, value);
    },
    setExternalTaskPriority(value) {
      setExternalTaskValue(this.getActive, value);
    }
  }
};
</script>
