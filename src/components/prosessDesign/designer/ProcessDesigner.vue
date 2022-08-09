<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <slot name="control-header"></slot>
      <template v-if="!$slots['control-header']">

        <el-button-group key="file-control">
          <el-button :size="headerButtonSize" :type="headerButtonType" @click="$refs.refFile.click()">
            <el-icon>
              <elementUpload />
            </el-icon>导入
          </el-button>
          <el-dropdown :size="headerButtonSize">
            <el-button type="primary" :size="headerButtonSize">
              <el-icon>
                <elementDownload />
              </el-icon>下载
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="downloadProcessAsXml">下载为XML文件</el-dropdown-item>
                <el-dropdown-item @click="downloadProcessAsSvg">下载为SVG文件</el-dropdown-item>
                <el-dropdown-item @click="downloadProcessAsBpmn">下载为BPMN文件</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown :size="headerButtonSize">
            <el-button style="margin-left: -1px;" type="primary" :size="headerButtonSize">
              <el-icon>
                <elementView />
              </el-icon>预览
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="previewProcessXML">预览XML</el-dropdown-item>
                <el-dropdown-item @click="previewProcessJson">预览JSON</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button @click="save" type="primary" :size="headerButtonSize">
            <el-icon>
              <elementCollection />
            </el-icon>保存
          </el-button>
        </el-button-group>

        <el-button-group key="align-control">
          <el-tooltip effect="light" content="向左对齐">
            <el-button :size="headerButtonSize" class="fa fa-align-left" @click="elementsAlign('left')" />
          </el-tooltip>
          <el-tooltip effect="light" content="向右对齐">
            <el-button :size="headerButtonSize" class="fa fa-align-right" @click="elementsAlign('right')" />
          </el-tooltip>
          <el-tooltip effect="light" content="向上对齐">
            <el-button :size="headerButtonSize" class="fa" @click="elementsAlign('top')">
              <el-icon>
                <elementUpload />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" class="iconfont" content="向下对齐">
            <el-button class="fa" :size="headerButtonSize" @click="elementsAlign('bottom')">
              <el-icon>
                <elementDownload />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="水平居中">
            <el-button :size="headerButtonSize" class="fa iconfont icon--chaifenhang"
              @click="elementsAlign('center')" />
          </el-tooltip>
          <el-tooltip effect="light" content="垂直居中">
            <el-button :size="headerButtonSize" class="fa iconfont icon--chaifenlie" @click="elementsAlign('middle')" />
          </el-tooltip>
        </el-button-group>
        <el-button-group key="scale-control">
          <el-tooltip effect="light" content="缩小视图">
            <el-button class="fa" :size="headerButtonSize" :disabled="defaultZoom < 0.2" @click="processZoomOut()">
              <el-icon>
                <elementZoomOut />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-button :size="headerButtonSize">{{ Math.floor(this.defaultZoom * 10 * 10) + "%"
          }}</el-button>
          <el-tooltip effect="light" content="放大视图">
            <el-button class="fa" :size="headerButtonSize" :disabled="defaultZoom > 4" @click="processZoomIn()">
              <el-icon>
                <elementZoomIn />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="重置视图并居中">
            <el-button class="fa" :size="headerButtonSize" @click="processReZoom()">
              <el-icon>
                <elementGrid />
              </el-icon>
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group key="stack-control">
          <el-tooltip effect="light" content="撤销">
            <el-button class="fa" :size="headerButtonSize" :disabled="!revocable" @click="processUndo()">
              <el-icon>
                <elementRefreshLeft />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="恢复">
            <el-button class="fa" :size="headerButtonSize" :disabled="!recoverable" @click="processRedo()">
              <el-icon>
                <elementRefreshRight />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="重新绘制">
            <el-button class="fa" :size="headerButtonSize" @click="processRestart">
              <el-icon>
                <elementRefresh />
              </el-icon>
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group v-if="simulation">
          <el-switch :size="headerButtonSize" v-model="simulationStatus" @change="processSimulation" active-text="模拟" />
        </el-button-group>
      </template>
      <!-- 用于打开本地文件-->
      <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn"
        @change="importLocalFile" />
    </div>
    <div class="my-process-designer__container">
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
    </div>
    <el-dialog title="预览" width="60%" v-model="previewModelVisible" append-to-body destroy-on-close>
      <highlightjs :language="previewType" :code="previewResult" />
    </el-dialog>
  </div>
</template>

<script>
import "highlight.js/styles/atom-one-dark-reasonable.css";
import BpmnModeler from "bpmn-js/lib/Modeler";
import DefaultEmptyXML from "./plugins/defaultEmpty";
// 翻译方法
import customTranslate from "./plugins/translate/customTranslate";
import translationsCN from "./plugins/translate/zh";
// 模拟流转流程
import tokenSimulation from "bpmn-js-token-simulation";
// 标签解析构建器
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// 标签解析 Moddle
import flowableModdleDescriptor from "./plugins/descriptor/flowableDescriptor.json";
// 标签解析 Extension
import flowableModdleExtension from "./plugins/extension-moddle/flowable";
// 引入json转换与高亮
import X2JS from "x2js";

export default {
  name: "MyProcessDesigner",
  components: {},
  componentName: "MyProcessDesigner",
  props: {
    value: String, // xml 字符串
    processId: String,
    processName: String,
    translations: Object, // 自定义的翻译文件
    options: {
      type: Object,
      default: () => ({})
    }, // 自定义的翻译文件
    additionalModel: [Object, Array], // 自定义model
    moddleExtension: Object, // 自定义moddle
    onlyCustomizeAddi: {
      type: Boolean,
      default: false
    },
    onlyCustomizeModdle: {
      type: Boolean,
      default: false
    },
    simulation: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    prefix: {
      type: String,
      default: "flowable"
    },
    events: {
      type: Array,
      default: () => ["element.click"]
    },
    headerButtonSize: {
      type: String,
      default: "small",
      validator: value => ["default", "medium", "small", "large"].indexOf(value) !== -1
    },
    headerButtonType: {
      type: String,
      default: "primary",
      validator: value => ["default", "primary", "success", "warning", "danger", "info"].indexOf(value) !== -1
    }
  },
  data() {
    return {
      defaultZoom: 1,
      previewModelVisible: false,
      simulationStatus: false,
      previewResult: "",
      previewType: "xml",
      recoverable: false,
      revocable: false
    };
  },
  computed: {
    additionalModules() {
      console.log('additionalModules')
      const Modules = [];
      // 仅保留用户自定义扩展模块
      if (this.onlyCustomizeAddi) {
        if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
          return this.additionalModel || [];
        }
        return [this.additionalModel];
      }

      // 插入用户自定义扩展模块
      if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
        Modules.push(...this.additionalModel);
      } else {
        this.additionalModel && Modules.push(this.additionalModel);
      }

      // 翻译模块
      const TranslateModule = {
        translate: ["value", customTranslate(this.translations || translationsCN)]
      };
      Modules.push(TranslateModule);

      // 模拟流转模块
      if (this.simulation) {
        Modules.push(tokenSimulation);
      }

      if (this.prefix === "flowable") {
        // Modules.push(flowableModdleExtension);
      }

      return Modules;
    },
    moddleExtensions() {
      const Extensions = {};
      // 仅使用用户自定义模块
      if (this.onlyCustomizeModdle) {
        return this.moddleExtension || null;
      }

      // 插入用户自定义模块
      if (this.moddleExtension) {
        for (let key in this.moddleExtension) {
          Extensions[key] = this.moddleExtension[key];
        }
      }

      if (this.prefix === "flowable") {
        Extensions.flowable = flowableModdleDescriptor;
      }

      return Extensions;
    }
  },
  mounted() {
    this.initBpmnModeler();
    this.createNewDiagram(this.value);
    // this.$once("hook:beforeDestroy", () => {
    //   if (this.bpmnModeler) this.bpmnModeler.destroy();
    //   this.$emit("destroy", this.bpmnModeler);
    //   this.bpmnModeler = null;
    // });
  },
  beforeUnmount() {
    if (this.bpmnModeler) this.bpmnModeler.destroy();
    this.$emit("destroy", this.bpmnModeler);
    this.bpmnModeler = null;
  },
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return;
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs["bpmn-canvas"],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions,
        ...this.options
      });
      this.$emit("init-finished", this.bpmnModeler);
      this.initModelListeners();
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach(event => {
        EventBus.on(event, function (eventObj) {
          let eventName = event.replace(/\./g, "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async event => {
        try {
          this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
          this.revocable = this.bpmnModeler.get("commandStack").canUndo();
          let { xml } = await this.bpmnModeler.saveXML({ format: true });
          this.$emit("commandStack-changed", event);
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e.message || e}`);
        }
      });
      // 监听视图缩放变化
      this.bpmnModeler.on("canvas.viewbox.changed", ({ viewbox }) => {
        this.$emit("canvas-viewbox-changed", { viewbox });
        const { scale } = viewbox;
        this.defaultZoom = Math.floor(scale * 100) / 100;
      });
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      let newId = this.processId || `Process_${new Date().getTime()}`;
      let newName = this.processName || `业务流程_${new Date().getTime()}`;
      let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix);
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString);
        if (warnings && warnings.length) {
          warnings.forEach(warn => console.warn(warn));
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e?.message || e}`);
      }
    },

    // 下载流程图到本地
    /**
     * @param {string} type
     * @param {*} name
     */
    async downloadProcess(type, name) {
      try {
        const _this = this;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const { err, xml } = await this.bpmnModeler.saveXML();
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`);
          }
          let { href, filename } = _this.setEncoded(type.toUpperCase(), name, xml);
          downloadFunc(href, filename);
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          let { href, filename } = _this.setEncoded("SVG", name, svg);
          downloadFunc(href, filename);
        }
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    },

    // 保存流程图到服务器
    async save() {
      try {
        // xml
        const { err, xml } = await this.bpmnModeler.saveXML();
        // 读取异常时抛出异常
        if (err) {
          console.error(`[Process Designer Warn ]: ${err.message || err}`);
        }
        console.log('xml', xml)
        // svg
        const { errSvg, svg } = await this.bpmnModeler.saveSVG();
        // 读取异常时抛出异常
        if (errSvg) {
          return console.error(errSvg);
        }
        console.log('svg', svg)
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
    },

    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = "diagram", data) {
      const encodedData = encodeURIComponent(data);
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
        data: data
      };
    },

    // 加载本地文件
    importLocalFile() {
      const that = this;
      const file = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        let xmlStr = this.result;
        that.createNewDiagram(xmlStr);
      };
    },
    /* ------------------------------------------------ refs methods ------------------------------------------------------ */
    downloadProcessAsXml() {
      this.downloadProcess("xml");
    },
    downloadProcessAsBpmn() {
      this.downloadProcess("bpmn");
    },
    downloadProcessAsSvg() {
      this.downloadProcess("svg");
    },
    processSimulation() {
      this.simulation && this.bpmnModeler.get("toggleMode").toggleMode();
    },
    processRedo() {
      this.bpmnModeler.get("commandStack").redo();
    },
    processUndo() {
      this.bpmnModeler.get("commandStack").undo();
    },
    processZoomIn(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
      if (newZoom > 4) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomOut(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
      if (newZoom < 0.2) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomTo(newZoom = 1) {
      if (newZoom < 0.2) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
      }
      if (newZoom > 4) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(newZoom);
    },
    processReZoom() {
      this.defaultZoom = 1;
      this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
    },
    processRestart() {
      this.recoverable = false;
      this.revocable = false;
      this.createNewDiagram(null);
    },
    elementsAlign(align) {
      const Align = this.bpmnModeler.get("alignElements");
      const Selection = this.bpmnModeler.get("selection");
      const SelectedElements = Selection.get();
      if (!SelectedElements || SelectedElements.length <= 1) {
        this.$message.warning("请按住 Ctrl 键选择多个元素对齐");
        return;
      }
      this.$confirm("自动对齐可能造成图形变形，是否继续？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => Align.trigger(SelectedElements, align));
    },
    /*-----------------------------    方法结束     ---------------------------------*/
    previewProcessXML() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = xml;
        this.previewType = "xml";
        this.previewModelVisible = true;
      });
    },
    previewProcessJson() {
      const newConvert = new X2JS();
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        const { definitions } = newConvert.xml2js(xml);
        if (definitions) {
          this.previewResult = JSON.stringify(definitions, null, 4);
        } else {
          this.previewResult = "";
        }

        this.previewType = "json";
        this.previewModelVisible = true;
      });
    }
  }
};
</script>

<style scope lang="scss">
.el-button-group {
  .el-button {
    border-radius: 0;
  }
}

.my-process-designer__header {
  border-top: 1px solid #eee;
  padding-top: 5px;
}
</style>
