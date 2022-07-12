<template>
  <div class="container">
    <div class="bpmn-viewer">
      <vue-header class="bpmn-viewer-header" :processData="initData" :modeler="bpmnModeler" @restart="restart"
        @handleExportSvg="handleExportSvg" @handleExportBpmn="handleExportBpmn" @processSave="processSave"></vue-header>
      <div class="bpmn-viewer-container">
        <div class="bpmn-viewer-content" ref="bpmnViewer"></div>
      </div>
    </div>
    <bpmn-panel v-if="bpmnModeler" :modeler="bpmnModeler" :process="initData"></bpmn-panel>
  </div>
</template>

<script>
import { toRefs, reactive, onMounted, ref } from 'vue';
import templateXml from "./data/template";
import BpmnModeler from 'jeeplus-bpmn/lib/Modeler'
import customTranslate from "./data/translate/customTranslate.js";
import VueHeader from "./Header.vue";
import BpmnPanel from "./panel/index.vue";
import activitiModele from './data/activiti.json'
import flowableModdle from './data/flowable.json'
import './assets/css/vue-bmpn.css'
import './assets/css/font-awesome.min.css'

export default {
  name: "VueBpmn",
  props: {
    product: String
  },
  components: {
    VueHeader, BpmnPanel
  },
  setup(props) {

    const bpmnViewer = ref();

    const state = reactive({
      bpmnModeler: null,
      initTemplate: "",
      initData: {}
    });

    const init = () => {
      // 支持activiti和flowable
      // 创建Bpmn对象
      state.bpmnModeler = new BpmnModeler({
        container: bpmnViewer.value,
        additionalModules: [
          {
            translate: ['value', customTranslate]
          }
        ],
        moddleExtensions: getModdleExtensions
      });

      /*let _tag = document.getElementsByClassName("djs-overlay-container")[0];
      if (_tag) {
        _tag.style.width = "100%";
        _tag.style.height = "100%";
      }*/

      // 初始化建模器内容
      initDiagram(state.initTemplate);
    };
    const initDiagram = (xml) => {
      state.bpmnModeler.importXML(xml, err => {
        if (err) {
          // this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        }
        let _tag = document.getElementsByTagName("svg")[0];
        if (_tag) {
          _tag.style.width = "100%";
          _tag.style.height = "700px";
        }
      });
    };
    const handleExportBpmn = () => {
      state.bpmnModeler.saveXML(function (err, xml) {
        if (err) {
          console.error(err)
        }
        let { filename, href } = setEncoded('BPMN', xml);
        if (href && filename) {
          let a = document.createElement('a');
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      });
    };
    const handleExportSvg = () => {
      state.bpmnModeler.saveSVG(function (err, svg) {
        if (err) {
          console.error(err)
        }
        let { filename, href } = setEncoded('SVG', svg);
        if (href && filename) {
          let a = document.createElement('a');
          a.download = filename;
          a.href = href;
          a.click();
          URL.revokeObjectURL(a.href);
        }
      });
    };
    const setEncoded = (type, data) => {
      const encodedData = encodeURIComponent(data);
      if (data) {
        if (type === 'XML') {
          return {
            filename: 'diagram.bpmn20.xml',
            href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
            data: data
          }
        }
        if (type === 'BPMN') {
          return {
            filename: 'diagram.bpmn',
            href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
            data: data
          }
        }
        if (type === 'SVG') {
          state.initData.svg = data;
          return {
            filename: 'diagram.svg',
            href: "data:application/text/xml;charset=UTF-8," + encodedData,
            data: data
          }
        }
      }
    };
    const processSave = (data) => {
      data.procId = state.initData.key;
      data.name = state.initData.name;
      this.$emit("processSave", data);
    };

    const restart = () => {
      let processId = new Date().getTime();
      state.initTemplate = templateXml.initTemplate(processId)
      state.initData = { key: "process" + processId, name: "流程" + processId, xml: state.initTemplate }
      initDiagram(state.initTemplate)
    };
    const getModdleExtensions = () => {
      let moddleExtensions = {};
      if (props.product == "flowable") {
        moddleExtensions = {
          flowable: flowableModdle
        }
      }
      if (props.product == "activiti") {
        moddleExtensions = {
          activiti: activitiModele
        }
      }
      return moddleExtensions;
    }

    // 页面加载时
    onMounted(() => {
      let processId = new Date().getTime();
      state.initTemplate = templateXml.initTemplate(processId)
      state.initData = { key: "process" + processId, name: "流程" + processId, xml: state.initTemplate }
      init();
    });

    return {
      handleExportBpmn,
      processSave,
      restart,
      handleExportSvg,
      ...toRefs(state),
    };
  },
}
</script>

<style scoped>
</style>
