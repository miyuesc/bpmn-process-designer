<template>
  <div>
    <div class="element-property input-property">
      <div class="element-property__label">回路特性：</div>
      <div class="element-property__value">
        <el-select v-model="loopCharacteristics" size="mini" @change="updateLoopCharacteristics">
          <!--bpmn:MultiInstanceLoopCharacteristics-->
          <el-option label="并行多重事件" value="ParallelMultiInstance" />
          <el-option label="时序多重事件" value="SequentialMultiInstance" />
          <!--bpmn:StandardLoopCharacteristics-->
          <el-option label="循环事件" value="StandardLoop" />
          <el-option label="无" value="Null" />
        </el-select>
      </div>
    </div>
    <template v-if="loopCharacteristics === 'ParallelMultiInstance' || loopCharacteristics === 'SequentialMultiInstance'">
      <el-divider><i class="el-icon-coin"></i> 多实例配置</el-divider>
      <el-form :model="loopInstanceForm" size="mini" label-width="100px" ref="loopInstanceFormRef" @submit.native.prevent>
        <el-form-item label="循环基数" prop="loopCardinality">
          <el-input v-model="loopInstanceForm.loopCardinality" clearable />
        </el-form-item>
        <el-form-item label="集合" prop="collection">
          <el-input v-model="loopInstanceForm.collection" clearable />
        </el-form-item>
        <el-form-item label="元素变量" prop="elementVariable">
          <el-input v-model="loopInstanceForm.elementVariable" clearable />
        </el-form-item>
        <el-form-item label="完成条件" prop="completionCondition">
          <el-input v-model="loopInstanceForm.completionCondition" clearable />
        </el-form-item>
        <el-form-item label="异步状态">
          <el-checkbox v-model="loopInstanceForm.asyncBefore" label="异步前" />
          <el-checkbox v-model="loopInstanceForm.asyncAfter" label="异步后" />
          <el-checkbox v-model="loopInstanceForm.exclusive" v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore" label="排除" />
        </el-form-item>
        <el-form-item label="重试周期" prop="failedJobRetryTimeCycle" v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore">
          <el-input v-model="loopInstanceForm.failedJobRetryTimeCycle" clearable />
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
/**
 * 任务类节点多实例配置
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年1月21日09:36:25
 */
import { debounce } from "@/utils";

export default {
  name: "TaskLoopCharacteristics",
  props: {
    bpmnModeler: Object,
    elementId: String,
    elementBusinessObject: Object
  },
  inject: {
    prefix: "prefix"
  },
  data() {
    return {
      loopCharacteristics: null,
      loopInstanceForm: {}
    };
  },
  watch: {
    // elementId: {
    //   immediate: true,
    //   handler: function(newVal) {
    //     this.initElementBusinessObject(newVal);
    //   }
    // },
    elementBusinessObject: {
      immediate: true,
      deep: true,
      handler: function(newVal, oldVal) {
        if (!oldVal?.loopCharacteristics || newVal.loopCharacteristics !== oldVal.loopCharacteristics) {
          this.initElementBusinessObject(newVal.id);
        }
      }
    },
    loopInstanceForm: {
      deep: true,
      handler: function() {
        this.updateLoopCharacteristicsObject();
      }
    }
  },
  created() {
    this.updateLoopCharacteristicsObject = debounce(this.updateLoopCharacteristicsObject, 200);
  },
  methods: {
    initElementBusinessObject(elementId) {
      !this.modeling && (this.modeling = this.bpmnModeler.get("modeling"));
      !this.moddle && (this.moddle = this.bpmnModeler.get("moddle"));
      !this.elementRegistry && (this.elementRegistry = this.bpmnModeler.get("elementRegistry"));
      if (elementId) {
        this.element = this.elementRegistry.get(elementId);
        this.loopCharacteristicsObject = this.element.businessObject?.get("loopCharacteristics") ?? null;
        this.initLoopCharacteristics();
      }
    },
    // 初始化多实例类型
    initLoopCharacteristics() {
      if (this.loopCharacteristicsObject) {
        let loopType = this.loopCharacteristicsObject.$type;
        if (loopType === "bpmn:MultiInstanceLoopCharacteristics") {
          this.loopCharacteristics = this.loopCharacteristicsObject.isSequential ? "SequentialMultiInstance" : "ParallelMultiInstance";
        }
        if (loopType === "bpmn:StandardLoopCharacteristics") {
          this.loopCharacteristics = "StandardLoop";
        }
        this.$set(this.loopInstanceForm, "collection", this.loopCharacteristicsObject.collection);
        this.$set(this.loopInstanceForm, "elementVariable", this.loopCharacteristicsObject.elementVariable);
        this.$set(this.loopInstanceForm, "isSequential", this.loopCharacteristicsObject.isSequential);
        this.$set(this.loopInstanceForm, "asyncBefore", this.loopCharacteristicsObject.asyncBefore);
        this.$set(this.loopInstanceForm, "asyncAfter", this.loopCharacteristicsObject.asyncAfter);
        this.$set(this.loopInstanceForm, "exclusive", this.loopCharacteristicsObject.exclusive);
        this.$set(this.loopInstanceForm, "loopCardinality", this.loopCharacteristicsObject.loopCardinality?.body);
        this.$set(this.loopInstanceForm, "completionCondition", this.loopCharacteristicsObject.completionCondition?.body);
        this.$set(this.loopInstanceForm, "failedJobRetryTimeCycle", this.loopCharacteristicsObject?.extensionElements?.values[0]?.body);
      } else {
        this.loopCharacteristics = "Null";
      }
    },
    // 更新多实例类型，创建 多实例对象
    updateLoopCharacteristics(type) {
      this.loopInstanceForm = {};
      if (type === "Null" || !type) {
        this.loopCharacteristicsObject = {};
        this.modeling.updateProperties(this.element, {
          loopCharacteristics: null
        });
        delete this.element.businessObject.loopCharacteristics;
        return;
      }
      if (type === "StandardLoop") {
        this.loopCharacteristicsObject = this.moddle.create("bpmn:StandardLoopCharacteristics");
        this.modeling.updateProperties(this.element, {
          loopCharacteristics: this.loopCharacteristicsObject
        });
        return;
      }
      this.loopCharacteristicsObject = this.moddle.create("bpmn:MultiInstanceLoopCharacteristics", {
        isSequential: type === "SequentialMultiInstance"
      });
      this.modeling.updateProperties(this.element, {
        loopCharacteristics: this.loopCharacteristicsObject
      });
    },
    // 根据表单值更新多实例对象
    updateLoopCharacteristicsObject() {
      // 根据配置更新
      if (!Object.keys(this.loopInstanceForm).length) return;
      // 没有多实例对象时先创建
      if (!this.loopCharacteristicsObject) {
        this.updateLoopCharacteristics(this.loopCharacteristics);
      }
      // loopCardinality
      if (this.loopInstanceForm.loopCardinality) {
        this.loopCharacteristicsObject.loopCardinality = this.moddle.create("bpmn:FormalExpression", {
          body: this.loopInstanceForm.loopCardinality
        });
      } else {
        this.loopCharacteristicsObject.loopCardinality && delete this.loopCharacteristicsObject.loopCardinality;
      }
      // collection
      if (this.loopInstanceForm.collection) {
        this.loopCharacteristicsObject.collection = this.loopInstanceForm.collection;
      } else {
        this.loopCharacteristicsObject.collection && delete this.loopCharacteristicsObject.collection;
      }
      // elementVariable
      if (this.loopInstanceForm.elementVariable) {
        this.loopCharacteristicsObject.elementVariable = this.loopInstanceForm.elementVariable;
      } else {
        this.loopCharacteristicsObject.elementVariable && delete this.loopCharacteristicsObject.elementVariable;
      }
      // completionCondition
      if (this.loopInstanceForm.completionCondition) {
        this.loopCharacteristicsObject.completionCondition = this.moddle.create("bpmn:FormalExpression", {
          body: this.loopInstanceForm.completionCondition
        });
      } else {
        this.loopCharacteristicsObject.completionCondition && delete this.loopCharacteristicsObject.completionCondition;
      }
      this.loopCharacteristicsObject.asyncBefore = this.loopInstanceForm.asyncBefore;
      this.loopCharacteristicsObject.asyncAfter = this.loopInstanceForm.asyncAfter;
      this.loopCharacteristicsObject.exclusive = this.loopInstanceForm.exclusive;
      // 没有异步时清空 failedJobRetryTimeCycle
      if (!this.loopInstanceForm?.asyncBefore && !this.loopInstanceForm?.asyncAfter) {
        this.$set(this.loopInstanceForm, "failedJobRetryTimeCycle", "");
        this.loopCharacteristicsObject.extensionElements && delete this.loopCharacteristicsObject.extensionElements;
      }
      // failedJobRetryTimeCycle
      if (this.loopInstanceForm.failedJobRetryTimeCycle) {
        this.loopCharacteristicsObject.extensionElements = this.moddle.create("bpmn:ExtensionElements", {
          values: [
            this.moddle.create(`${this.prefix}:FailedJobRetryTimeCycle`, {
              body: this.loopInstanceForm.failedJobRetryTimeCycle
            })
          ]
        });
      } else {
        this.loopCharacteristicsObject.extensionElements && delete this.loopCharacteristicsObject.extensionElements;
      }
      // 更新到元素上
      this.updateElementProperties(this.loopCharacteristicsObject);
    },
    // 更新 多实例配置 到元素
    updateElementProperties(loopCharacteristicsModdle) {
      // 复制原有属性，避免更新丢失
      let business = { ...this.element.businessObject };
      // 移除多余属性，更新内部属性
      if (business["$type"]) delete business["$type"];
      if (business["di"]) delete business["di"];
      if (business["id"]) delete business["id"];
      if (business["$parent"]) delete business["$parent"];
      if (business["loopCharacteristics"]) delete business["loopCharacteristics"];
      // 更新到节点元素上
      this.modeling.updateProperties(this.element, { ...business, loopCharacteristics: loopCharacteristicsModdle });
    }
  }
};
</script>

<style scoped lang="scss"></style>
