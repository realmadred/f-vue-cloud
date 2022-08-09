<template>
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <el-collapse v-model="activeTab" accordion style="border: none;">
      <el-collapse-item name="base">
        <template #title>
          <el-icon>
            <elementInfoFilled />
          </el-icon> 常规
        </template>
        <element-base-info :id-edit-disabled="idEditDisabled" :business-object="elementBusinessObject"
          :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="elementType === 'Process'" key="message">
       <template #title>
          <el-icon>
            <elementComment />
          </el-icon> 消息与信号
        </template>
        <signal-and-massage />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="conditionFormVisible" key="condition">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>流转条件</div>
        <flow-condition :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="formVisible" key="form">
        <template #title>
          <el-icon>
            <elementList />
          </el-icon> 表单
        </template>
        <element-form :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="task" v-if="elementType.indexOf('Task') !== -1" key="task">
        <template #title>
          <el-icon>
            <elementPlatform />
          </el-icon> 任务
        </template>
        <element-task :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="multiInstance" v-if="elementType.indexOf('Task') !== -1" key="multiInstance">
        <template #title>
          <el-icon>
            <elementCirclePlusFilled />
          </el-icon> 多实例
        </template>
        <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="listeners" key="listeners">
          <template #title>
          <el-icon>
            <elementBellFilled />
          </el-icon> 执行监听器
        </template>
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="taskListeners" v-if="elementType === 'UserTask'" key="taskListeners">
        <template #title>
          <el-icon>
            <elementOpportunity />
          </el-icon> 任务监听器
        </template>
        <user-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="extensions" key="extensions">
        <template #title>
          <el-icon>
            <elementCirclePlusFilled />
          </el-icon> 扩展属性
        </template>
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="other" key="other">
        <template #title>
          <el-icon>
            <elementMoreFilled />
          </el-icon> 其他
        </template>
        <element-other-config :id="elementId" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import ElementBaseInfo from "./base/ElementBaseInfo.vue";
import ElementOtherConfig from "./other/ElementOtherConfig.vue";
import ElementTask from "./task/ElementTask.vue";
import ElementMultiInstance from "./multi-instance/ElementMultiInstance.vue";
import FlowCondition from "./flow-condition/FlowCondition.vue";
import SignalAndMassage from "./signal-message/SignalAndMessage.vue";
import ElementListeners from "./listeners/ElementListeners.vue";
import ElementProperties from "./properties/ElementProperties.vue";
import ElementForm from "./form/ElementForm.vue";
import UserTaskListeners from "./listeners/UserTaskListeners.vue";
import Log from "../Log";
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
  name: "MyPropertiesPanel",
  components: {
    UserTaskListeners,
    ElementForm,
    ElementProperties,
    ElementListeners,
    SignalAndMassage,
    FlowCondition,
    ElementMultiInstance,
    ElementTask,
    ElementOtherConfig,
    ElementBaseInfo
  },
  componentName: "MyPropertiesPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "camunda"
    },
    width: {
      type: Number,
      default: 600
    },
    idEditDisabled: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    };
  },
  data() {
    return {
      activeTab: "base",
      elementId: "",
      elementType: "",
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false // 表单配置
    };
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = "base";
      }
    }
  },
  created() {
    this.initModels();
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get("modeling"),
        moddle: this.bpmnModeler.get("moddle"),
        eventBus: this.bpmnModeler.get("eventBus"),
        bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
        elementFactory: this.bpmnModeler.get("elementFactory"),
        elementRegistry: this.bpmnModeler.get("elementRegistry"),
        replace: this.bpmnModeler.get("replace"),
        selection: this.bpmnModeler.get("selection")
      };
      this.getActiveElement();
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null);
      this.bpmnModeler.on("import.done", e => {
        this.initFormOnChanged(null);
      });
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        this.initFormOnChanged(newSelection[0] || null);
      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element);
        }
      });
    },
    // 初始化数据
    initFormOnChanged(element) {
      let activatedElement = element;
      if (!activatedElement) {
        activatedElement =
          window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process") ??
          window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Collaboration");
      }
      if (!activatedElement) return;
      Log.printBack(`select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`);
      Log.prettyInfo("businessObject", activatedElement.businessObject);
      window.bpmnInstances.bpmnElement = activatedElement;
      this.bpmnElement = activatedElement;
      this.elementId = activatedElement.id;
      this.elementType = activatedElement.type.split(":")[1] || "";
      this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject));
      this.conditionFormVisible = !!(
        this.elementType === "SequenceFlow" &&
        activatedElement.source &&
        activatedElement.source.type.indexOf("StartEvent") === -1
      );
      this.formVisible = this.elementType === "UserTask" || this.elementType === "StartEvent";
    },
    beforeDestroy() {
      window.bpmnInstances = null;
    }
  }
};
</script>

<style scoped lang="scss">
.process-panel__container {
  margin-bottom: 2px;
  padding: 0 8px;
  border: 1px solid #eeeeee;
  max-height: 100%;
}

.panel-tab__title {
  font-weight: 600;
  padding: 0 8px;
  font-size: 1.1em;
  line-height: 1.2em;

  i {
    margin-right: 8px;
    font-size: 1.2em;
  }
}

.panel-tab__content {
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid #eeeeee;
  padding: 8px 16px;

  .panel-tab__content--title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 8px;

    span {
      flex: 1;
      text-align: left;
    }
  }
}

.element-property {
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin: 8px 0;

  .element-property__label {
    display: block;
    width: 90px;
    text-align: right;
    overflow: hidden;
    padding-right: 12px;
    line-height: 32px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .element-property__value {
    flex: 1;
    line-height: 32px;
  }

  .el-form-item {
    width: 100%;
    margin-bottom: 0;
    padding-bottom: 18px;
  }
}

.list-property {
  flex-direction: column;

  .element-listener-item {
    width: 100%;
    display: inline-grid;
    grid-template-columns: 16px auto 32px 32px;
    grid-column-gap: 8px;
  }

  .element-listener-item+.element-listener-item {
    margin-top: 8px;
  }
}

.listener-filed__title {
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;

  span {
    width: 200px;
    text-align: left;
    font-size: 14px;
  }

  i {
    margin-right: 8px;
  }
}

.element-drawer__button {
  margin-top: 8px;
  width: 100%;
  display: inline-flex;
  justify-content: space-around;
}

.element-drawer__button>.el-button {
  width: 100%;
}

.el-collapse-item__content {
  padding-bottom: 0;
}

.el-input.is-disabled .el-input__inner {
  color: #999999;
}

.el-form-item.el-form-item--mini {
  margin-bottom: 0;

  &+.el-form-item {
    margin-top: 16px;
  }
}
</style>
