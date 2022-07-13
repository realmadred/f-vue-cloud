<template>
  <div>
    <el-form :inline="false" :model="localProcessData" label-width="100px" size="small" label-position="left">
      <el-form-item label="流程ID">
        <el-input v-model="localProcessData.key" @input="updateId"></el-input>
      </el-form-item>
      <el-form-item label="流程名称">
        <el-input v-model="localProcessData.name" @input="updateName"></el-input>
      </el-form-item>
      <el-form-item label="流程描述">
        <el-input v-model="localProcessData.description" @input="updateDesc"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { toRefs, reactive, defineProps } from 'vue';

const props = defineProps({
  processData: {
    type: Object,
    required: true
  },
  modeler: {
    type: Object,
    required: true
  },
  element: {
    type: Object,
    required: true
  }
})
const state = reactive({
  localProcessData: props.processData
})
const { localProcessData } = toRefs(state)

const updateId = (name) => {
  props.modeler.get("modeling").updateProperties(props.element, { id: name });
}
const updateName = (name) => {
  props.modeler.get("modeling").updateProperties(props.element, { name: name });
}
const updateDesc = (name) => {
  let doc = props.modeler.get("bpmnFactory").create("bpmn:Documentation", { text: name });
  props.modeler.get("modeling").updateProperties(props.element, { documentation: [doc] });
}
</script>

<style scoped>
</style>
