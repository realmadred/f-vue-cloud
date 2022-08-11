<template>
  <div>
    <el-button-group>
      <el-tooltip class="item" effect="dark" content="保存并发布" placement="bottom">
        <el-button type="primary" size="small" @click="deploy"><i class="fa fa-save"> 保存并发布</i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="保存草稿" placement="bottom">
        <el-button type="primary" size="small" @click="save"><i class="fa fa-save"> 保存草稿</i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="打开流程文件" placement="bottom">
        <el-button type="primary" size="small"><i class="fa fa-folder-open"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="创建新流程图" placement="bottom">
        <el-button type="primary" size="small" @click="reset"><i class="fa fa-plus-circle"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="下载流程图" placement="bottom">
        <el-button type="primary" size="small" @click="downloadSvg"><i class="fa fa-picture-o"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="下载流程文件" placement="bottom">
        <el-button type="primary" size="small" @click="downloadBpmn"><i class="fa fa-download"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="撤销" placement="bottom">
        <el-button size="small"><i class="fa fa-rotate-left" @click="undo"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="恢复" placement="bottom">
        <el-button size="small"><i class="fa fa-rotate-right" :class="!canRedo ? 'default-undo' : ''" @click="redo"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
        <el-button size="small" @click="zoom(0.05)"><i class="fa fa-search-plus"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩小" placement="bottom">
        <el-button size="small" @click="zoom(-0.05)"><i class="fa fa-search-minus"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="重置" placement="bottom">
        <el-button size="small" @click="zoom(0)"><i class="fa fa-arrows"></i></el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>

<script setup >
import { toRefs, reactive, defineProps, defineEmits } from 'vue';

const props = defineProps({
  processData: {
    type: Object
  },
  modeler: {
    type: Object
  }
})

const emit = defineEmits(['processSave', 'restart', 'handleExportSvg', 'handleExportBpmn'])

const state = reactive({
  scale: 1.0,
  canRedo: false
});

const { scale, canRedo } = toRefs(state)

const deploy = () => {
  let _xml;
  let _svg;
  props.modeler.saveXML((err, xml) => {
    if (err) {
      console.error(err)
    }
    _xml = xml;
  })
  props.modeler.saveSVG((err, svg) => {
    if (err) {
      console.error(err)
    }
    _svg = svg;
  })
  // post
  console.log('xml', _xml, _svg)

};
const save = () => {
  let _xml;
  let _svg;
  props.modeler.saveXML((err, xml) => {
    if (err) {
      console.error(err)
    }
    _xml = xml;
  })
  props.modeler.saveSVG((err, svg) => {
    if (err) {
      console.error(err)
    }
    _svg = svg;
  })
  emit("processSave", { "xmlStr": _xml, "svgStr": _svg });
};
const reset = () => {
  emit('restart')
};
const downloadSvg = () => {
  emit("handleExportSvg")
};
const downloadBpmn = () => {
  emit("handleExportBpmn");
};
const undo = () => {
  props.modeler.get('commandStack').undo();
  state.canRedo = props.modeler.get('commandStack').canRedo();
};
const redo = () => {
  if (!state.canRedo) {
    return;
  }
  props.modeler.get('commandStack').redo()
  state.canRedo = props.modeler.get('commandStack').canRedo();
};
const zoom = (val) => {
  let newScale = !val ? 1.0 : ((state.scale + val) <= 0.2) ? 0.2 : (state.scale + val);
  props.modeler.get('canvas').zoom(newScale);
  state.scale = newScale;
}

</script>

<style scoped>
</style>
