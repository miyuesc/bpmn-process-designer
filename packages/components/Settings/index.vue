<template>
  <div class="bpmn-settings" @click.stop>
    <div class="toggle-button" @click="changeModelVisible">
      <lucide-icon name="Settings" :size="40" color="#ffffff" />
    </div>
    <el-drawer :visible.sync="modelVisible" :size="600" title="偏好设置" append-to-body>
      <div class="settings-form">
        <el-form :model="editorSettings" size="mini" label-width="128px" label-suffix="：">
          <el-form-item label="流程名称">
            <el-input v-model="editorSettings.processName" clearable />
          </el-form-item>
          <el-form-item label="流程ID">
            <el-input v-model="editorSettings.processId" clearable />
          </el-form-item>
          <el-form-item label="工具栏">
            <el-switch v-model="editorSettings.toolbar" />
          </el-form-item>
          <el-form-item label="小地图">
            <el-switch v-model="editorSettings.useMinimap" />
          </el-form-item>
          <el-form-item label="流程校验">
            <el-switch v-model="editorSettings.useLint" />
          </el-form-item>
          <el-form-item label="流程模拟">
            <el-switch v-model="editorSettings.useMock" />
          </el-form-item>
          <el-form-item label="模板选项扩展">
            <el-switch v-model="editorSettings.templateChooser" />
          </el-form-item>
          <el-form-item label="右键增强">
            <el-switch v-model="editorSettings.contextmenu" />
          </el-form-item>
          <el-form-item label="自定义右键菜单">
            <el-switch v-model="editorSettings.customContextmenu" />
          </el-form-item>
          <el-form-item label="流程引擎">
            <el-radio-group v-model="editorSettings.processEngine">
              <el-radio label="camunda">Camunda</el-radio>
              <el-radio label="activiti">Activiti</el-radio>
              <el-radio label="flowable">Flowable</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="背景设置">
            <el-radio-group v-model="editorSettings.bg">
              <el-radio label="grid">网格背景</el-radio>
              <el-radio label="image">图片</el-radio>
              <el-radio label="none">空</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Penal模式">
            <el-radio-group v-model="editorSettings.penalMode">
              <el-radio label="default">默认</el-radio>
              <el-radio label="rewrite" disabled>重写版</el-radio>
              <el-radio label="custom">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Palette模式">
            <el-radio-group v-model="editorSettings.paletteMode">
              <el-radio label="default">默认</el-radio>
              <el-radio label="rewrite">重写版</el-radio>
              <el-radio label="enhancement">扩展版</el-radio>
              <el-radio label="custom">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="ContextPad模式">
            <el-radio-group v-model="editorSettings.contextPadMode">
              <el-radio label="default">默认</el-radio>
              <el-radio label="rewrite">重写版</el-radio>
              <el-radio label="enhancement">扩展版</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Renderer模式">
            <el-radio-group v-model="editorSettings.rendererMode">
              <el-radio label="default">默认</el-radio>
              <el-radio label="rewrite">重写版</el-radio>
              <el-radio label="enhancement">扩展版</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="其他示例扩展">
            <el-switch v-model="editorSettings.otherModule" />
          </el-form-item>
          <el-form-item label="自定义主题" class="theme-list" v-if="editorSettings.rendererMode === 'rewrite'">
            <div class="theme-item">
              <div class="theme-item_label">
                <el-tooltip content="该功能只修改了显示部分，路径调整依然沿用折线计算方式，慎用！！！">
                  <span slot="">路径曲线 <i class="el-icon-question" />：</span>
                </el-tooltip>
              </div>
              <div>
                <el-switch v-model="editorSettings.useCurve" />
              </div>
            </div>
            <div class="theme-item" v-for="keyItem in themeColorKeys" :key="keyItem">
              <div class="theme-item_label">{{ keyItem }}：</div>
              <el-color-picker color-format="hex" v-model="editorSettings.customTheme[keyItem]" />
            </div>
            <div class="theme-item" v-for="keyItem in themeOpacityKeys" :key="keyItem">
              <div class="theme-item_label">{{ keyItem }}：</div>
              <el-input-number v-model="editorSettings.customTheme[keyItem]" :step="0.1" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="tips-message">
        <div class="grip-tips">
          <p>注：</p>
          <p>1. 仅自定义模式可使用 activiti 或者 flowable 引擎</p>
          <p>2. 扩展模式下只能扩展工具按钮，不能删除原有工具</p>
          <p>3. 自定义的MySql节点只能使用非默认渲染方式</p>
          <p>4. 🚀🚀🚀付费咨询请添加微信或者关注微信公众号</p>
        </div>
        <p style="font-weight: bold">友情赞助</p>
        <div class="sponsorship-image wechat"></div>
        <div class="sponsorship-image alipay"></div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defaultSettings } from "../../preset-configuration/editor.config";
import { debounce } from "min-dash";

export default {
  name: "BpmnSettings",
  props: {
    settings: {
      type: Object,
      default: () => defaultSettings
    }
  },
  data() {
    return {
      modelVisible: false,
      themeColorKeys: [
        "defaultFillColor",
        "defaultStartEventColor",
        "defaultEndEventColor",
        "defaultIntermediateEventColor",
        "defaultIntermediateThrowEventColor",
        "defaultIntermediateCatchEventColor",
        "defaultTaskColor",
        "defaultLabelColor",
        "defaultGatewayColor",
        "defaultSequenceColor"
      ],
      themeOpacityKeys: [
        "defaultStartEventOpacity",
        "defaultEndEventOpacity",
        "defaultIntermediateThrowEventOpacity",
        "defaultIntermediateCatchEventOpacity",
        "defaultTaskOpacity",
        "defaultLabelOpacity",
        "defaultGatewayOpacity",
        "defaultSequenceOpacity"
      ],
      editorSettings: this.settings
    };
  },
  computed: {
    ...mapGetters(["getEditor"])
  },
  watch: {
    editorSettings: {
      deep: true,
      handler() {
        if (this.editorSettings.penalMode !== "custom") {
          this.editorSettings.processEngine = "camunda";
        }
        this.updateEditorState();
      }
    }
  },
  methods: {
    changeModelVisible(event) {
      event.stopPropagation();
      this.modelVisible = !this.modelVisible;
    },
    updateEditorState: debounce(function () {
      this.editorSettings && this.$store.commit("setConfiguration", { ...this.editorSettings });
    }, 100)
  }
};
</script>
