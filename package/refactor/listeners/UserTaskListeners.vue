<template>
  <div class="panel-tab__content">
    <el-table :data="elementListenersList" size="mini" border>
      <el-table-column label="序号" width="50px" type="index" />
      <el-table-column label="事件类型" min-width="80px" show-overflow-tooltip :formatter="row => listenerEventTypeObject[row.event]" />
      <el-table-column label="事件id" min-width="80px" prop="id" show-overflow-tooltip />
      <el-table-column label="监听器类型" min-width="80px" show-overflow-tooltip :formatter="row => listenerTypeObject[row.listenerType]" />
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="openListenerForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListener(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openListenerForm(null)">添加监听器</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "UserTaskListeners",
  props: {
    id: String,
    type: String
  },
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {
      elementListenersList: [],
      listenerEventTypeObject: {
        create: "创建",
        assignment: "指派",
        complete: "完成",
        delete: "删除",
        update: "更新",
        timeout: "超时"
      },
      listenerTypeObject: {
        classListener: "Java 类",
        expressionListener: "表达式",
        delegateExpressionListener: "代理表达式",
        scriptListener: "脚本"
      }
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        // val && val.length && this.$nextTick(() => this.resetListenersList());
      }
    }
  },
  methods: {
    openListenerForm(listener, index) {},
    removeListener(listener, index) {}
  }
};
</script>
