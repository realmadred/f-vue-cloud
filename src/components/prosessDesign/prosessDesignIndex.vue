<template>
  <div class="process-design">
    <my-process-palette />
    <my-process-designer :key="`designer-${reloadIndex}`" :options="{
      taskResizingEnabled: true,
      eventResizingEnabled: true,
      minimap: {
        open: true
      }
    }" v-model="xmlString" v-bind="controlForm" keyboard ref="processDesigner" @element-click="elementClick"
      @element-contextmenu="elementContextmenu" @init-finished="initModeler" @bpmn-save="save">
    </my-process-designer>
    <my-properties-panel :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :prefix="controlForm.prefix"
      class="process-panel" :idEditDisabled="!controlForm.id"/>
    <el-button @click="controlDrawerVisible = true" type="primary" style="position:absolute;bottom: 20px;right: 20px;"
      circle>
      <el-icon>
        <elementSetting />
      </el-icon>
    </el-button>
    <el-drawer v-model="controlDrawerVisible" size="410px" title="设置">
      <el-form :model="controlForm" style="margin-top: 15px;margin-right: 15px;" label-width="100px"
        class="control-form" @submit.native.prevent>
        <el-form-item label="流转模拟">
          <el-switch v-model="controlForm.simulation" inactive-text="停用" active-text="启用"
            @change="reloadProcessDesigner()" />
        </el-form-item>
        <el-form-item label="禁用双击">
          <el-switch v-model="controlForm.labelEditing" inactive-text="停用" active-text="启用"
            @change="changeLabelEditingStatus" />
        </el-form-item>
        <el-form-item label="自定义渲染">
          <el-switch v-model="controlForm.labelVisible" inactive-text="停用" active-text="启用"
            @change="changeLabelVisibleStatus" />
        </el-form-item>
        <!-- <el-form-item label="流程引擎">
          <el-radio-group v-model="controlForm.prefix" @change="reloadProcessDesigner()">
            <el-radio label="camunda">camunda</el-radio>
            <el-radio label="flowable">flowable</el-radio>
            <el-radio label="activiti">activiti</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="工具栏">
          <el-radio-group v-model="controlForm.headerButtonSize">
            <el-radio-button label="small">small</el-radio-button>
            <el-radio-button label="default">default</el-radio-button>
            <el-radio-button label="large">large</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主题">
          <el-switch v-model="pageMode" active-text="dark" inactive-text="light" @change="changePageMode"></el-switch>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import './theme/process-designer.scss';
import translations from "./translations";
// 自定义渲染（隐藏了 label 标签）
import CustomRenderer from "./custom-renderer";
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from "./designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from "./designer/plugins/palette";
import Log from "./Log";
// 任务resize
// import resizeTask from "bpmn-js-task-resize/lib";
// bpmn theme plugin
// import sketchyRendererModule from "bpmn-js-sketchy";
// 小地图
import minimapModule from "diagram-js-minimap";

import UserSql from "./extension/user.json";

// clickoutside
import { ClickOutside } from 'element-plus'
import RewriteAutoPlace from "./auto-place/rewriteAutoPlace";

import MyProcessDesigner from "./designer";
import MyProcessPalette from "./palette";
import MyPropertiesPanel from "./panel";

export default {
  name: "ProsessDesign",
  components: { MyProcessDesigner, MyProcessPalette, MyPropertiesPanel },
  directives: {
    clickoutside: ClickOutside
  },
  props: {
    // 行数据
    row: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      xmlString: "",
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      infoTipVisible: false,
      pageMode: false,
      translationsSelf: translations,
      controlForm: {
        id: 0,
        xml: "",
        processId: "",
        processName: "",
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: "flowable",
        headerButtonSize: "small",
        events: ["element.click", "element.contextmenu"],
        // additionalModel: []
        moddleExtension: { user: UserSql },
        additionalModel: [
          CustomContentPadProvider,
          CustomPaletteProvider,
          minimapModule,
          {
            __init__: ["autoPlaceSelectionBehavior"],
            autoPlace: ["type", RewriteAutoPlace]
          }
        ]
      },
      addis: {
        CustomContentPadProvider,
        CustomPaletteProvider
      }
    };
  },
  created() {
    if (this.row) {
      console.log('row', this.row)

      this.xmlString = this.row.xml
      this.controlForm.xml = this.row.xml
      this.controlForm.processId = this.row.flowId
      this.controlForm.processName = this.row.name
    }
  },
  methods: {
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler;
        const canvas = modeler.get("canvas");

        const rootElement = canvas.getRootElement();
        Log.prettyPrimary("Process Id:", rootElement.id);
        Log.prettyPrimary("Process Name:", rootElement.businessObject);
      }, 10);
    },
    reloadProcessDesigner(notDeep) {
      this.controlForm.additionalModel = [];
      for (let key in this.addis) {
        if (this.addis[key]) {
          this.controlForm.additionalModel.push(this.addis[key]);
        }
      }
      !notDeep && (this.xmlString = undefined);
      this.reloadIndex += 1;
      this.modeler = null; // 避免 panel 异常
    },
    changeLabelEditingStatus(status) {
      this.addis.labelEditing = status ? { labelEditingProvider: ["value", ""] } : false;
      this.reloadProcessDesigner();
    },
    changeLabelVisibleStatus(status) {
      this.addis.customRenderer = status ? CustomRenderer : false;
      this.reloadProcessDesigner();
    },
    elementClick(element) {
      console.log(element);
      this.element = element;
    },
    elementContextmenu(element) {
      console.log("elementContextmenu:", element);
    },
    changePageMode(mode) {
      const theme = mode
        ? {
          // dark
          stroke: "#ffffff",
          fill: "#333333"
        }
        : {
          // light
          stroke: "#000000",
          fill: "#ffffff"
        };
      const elements = this.modeler.get("elementRegistry").getAll();
      this.modeler.get("modeling").setColor(elements, theme);
    },
    toggle() {
      console.log(this.modeler);
      console.log(this.modeler.get("toggleMode"));
      this.modeler.get("toggleMode").toggleMode();
    },
    save(data) {
      this.$emit('bpmn-save', data)
    }
  }
};
</script>

<style lang="scss">
body {
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
}

.process-design {
  width: 100%;
  height: 600px;
  grid-template-columns: 100px auto max-content;
  display: flex;
  flex-direction: row;
}

.zoom-in-right-enter-active,
.zoom-in-right-leave-active {
  opacity: 1;
  transform: scaleY(1) translateY(-48px);
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: right center;
}

.zoom-in-right-enter,
.zoom-in-right-leave-active {
  opacity: 0;
  transform: scaleX(0) translateY(-48px);
}

.info-tip {
  position: absolute;
  width: 480px;
  top: 0;
  right: 64px;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 16px;
  color: #333333;
  background: #f2f6fc;
  transform: translateY(-48px);
  border: 1px solid #ebeef5;
  border-radius: 4px;

  &::before,
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    position: absolute;
    right: -15px;
    top: 50%;
  }

  &::before {
    border-color: transparent transparent transparent #f2f6fc;
    z-index: 10;
  }

  &::after {
    right: -16px;
    border-color: transparent transparent transparent #ebeef5;
    z-index: 1;
  }
}

.control-form {
  .el-radio {
    width: 100%;
    line-height: 32px;
  }
}

.element-overlays {
  box-sizing: border-box;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fafafa;
}

body,
body * {

  /* 滚动条 */
  &::-webkit-scrollbar-track-piece {
    background-color: #fff;
    /*滚动条的背景颜色*/
    -webkit-border-radius: 0;
    /*滚动条的圆角宽度*/
  }

  &::-webkit-scrollbar {
    width: 10px;
    /*滚动条的宽度*/
    height: 8px;
    /*滚动条的高度*/
  }

  &::-webkit-scrollbar-thumb:vertical {
    /*垂直滚动条的样式*/
    height: 50px;
    background-color: rgba(153, 153, 153, 0.5);
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.3);
    -webkit-border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.5);
    -webkit-border-radius: 4px;
  }
}
</style>
