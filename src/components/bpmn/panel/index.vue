<template>
  <div class="bpmn-panel">
    <el-tabs v-model="activeName">
      <el-tab-pane label="节点属性" name="node">
        <node-property-panel :modeler="modeler" :nodeElement="nodeElement" :formData="formData"
          @modifyFormData="modifyFormData"></node-property-panel>
      </el-tab-pane>
      <el-tab-pane label="流程属性" name="process">
        <process-property-panel :modeler="modeler" :process-data="process" :element="element"></process-property-panel>
      </el-tab-pane>
    </el-tabs>
    <!-- 流程属性 -->
    <!-- <el-collapse v-if="panelIndex == 1" accordion>
      <el-collapse-item name="1">
        <template slot="title">
          基本设置<i class="header-icon el-icon-info"></i>
        </template>
        <div>
          <el-form label-position="right" label-width="70px">
            <el-form-item label="ID">
              <el-input v-model="formData.id"></el-input>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="描述信息">
              <el-input type="textarea" v-model="formData.document" @input="nameChange"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          执行监听器<i class="header-icon el-icon-info"></i>
        </template>
        <div>
          <div style="margin-bottom: 4px;">
            <el-button type="primary" size="small">添加</el-button>
            <el-button type="primary" size="small">选择</el-button>
          </div>
          <el-table border style="width: 100%">
            <el-table-column label="事件">
            </el-table-column>
            <el-table-column label="类型">
            </el-table-column>
            <el-table-column label="实现">
            </el-table-column>
            <el-table-column label="操作">
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          权限设置<i class="header-icon el-icon-info"></i>
        </template>
        <div>
          <el-form label-position="right" label-width="70px">
            <el-form-item label="允许启动">
              <el-radio v-model="radio" label="1">所有成员</el-radio>
              <el-radio v-model="radio" label="2">指导成员</el-radio>
            </el-form-item>
            <el-form-item label="添加用户">
              <el-input placeholder="请选择" v-model="input3" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="添加角色">
              <el-input placeholder="请选择" v-model="input3" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse> -->

    <!-- 开始节点 -->
    <!-- <el-collapse v-if="panelIndex == 1" accordion>
      <el-collapse-item name="1">
        <template slot="title">
          基本设置<i class="header-icon el-icon-info"></i>
        </template>
        <div>
          <el-form label-position="right" label-width="70px">
            <el-form-item label="ID">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="名称">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="描述信息">
              <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="发起人">
              <el-input></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          执行监听器<i class="header-icon el-icon-info"></i>
        </template>
        <div>
          <div class="collapse-item-header">
            <el-button type="primary" size="small" icon="el-icon-plus">添加</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit-outline">修改</el-button>
            <el-button type="primary" size="small" icon="el-icon-delete">删除</el-button>
          </div>
          <el-table border style="width: 100%">
            <el-table-column label="" width="40px">
            </el-table-column>
            <el-table-column label="表单名称">
            </el-table-column>
            <el-table-column label="版本">
            </el-table-column>
            <el-table-column label="表单key">
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          监听器<i class="header-icon el-icon-info"></i>
        </template>
        <div>
          <div style="margin-bottom: 4px;">
            <el-button type="primary" size="small">添加</el-button>
            <el-button type="primary" size="small">选择</el-button>
          </div>
          <el-table border style="width: 100%">
            <el-table-column label="事件">
            </el-table-column>
            <el-table-column label="类型">
            </el-table-column>
            <el-table-column label="实现">
            </el-table-column>
            <el-table-column label="操作">
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse> -->
  </div>
</template>

<script setup>
import { toRefs, reactive, defineProps, defineEmits, onMounted, ref } from 'vue';
import NodePropertyPanel from "./NodePropertyPanel.vue";
import ProcessPropertyPanel from "./ProcessPropertyPanel.vue";

const activeName = ref('node')

const state = reactive({
  panelIndex: 8,
  element: {},
  nodeElement: {},
  formData: {}
})

const { panelIndex, element, nodeElement, formData } = toRefs(state)

const props = defineProps({
  modeler: {
    type: Object,
    required: true
  },
  process: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updateXml'])

const handleModeler = () => {
  props.modeler.on("root.added", e => {
    const element = e.element;
    if (isImplicitRoot(element)) {
      return;
    }
    state.element = element;
  });
  props.modeler.on("commandStack.changed", () => {
    props.modeler.saveXML({ format: true }, function (err, xml) {
      emit('updateXml', xml)
    });
  })
  props.modeler.on("selection.changed", e => {
    const element = e.newSelection[0];
    if (!element) {
      return;
    }
    handleFormData(element);
  })
  props.modeler.on("element.changed", e => {
    const { element } = e;
    if (!element) {
      return;
    }
    handleFormData(element);
  });
  props.modeler.on("element.click", e => {
    const { element } = e;
    if (element.type == props.modeler._definitions.rootElements[0].$type) {
    } else {
      if (element.type == "bpmn:UserTask") {
        let _businessObject = element.businessObject;
        if (_businessObject.assignee) {
          state.formData.userType = "assignee";
          state.formData.assignee = _businessObject.assignee;
        }
      }
    }
  })
}
const isImplicitRoot = (element) => {
  return element.id === '__implicitroot';
}

const handleFormData = (element) => {
  if (!element.id) {
    return;
  }
  let businessObject = element.businessObject;
  state.formData = {
    type: element.type,
    id: businessObject.id,
    name: businessObject.name,
    userType: businessObject.$attrs.userType,
    assignee: businessObject.$attrs.assignee,
    candidateGroups: businessObject.$attrs.candidateGroups,
    candidateUsers: businessObject.$attrs.candidateUsers ? businessObject.$attrs.candidateUsers.split(",") : [],
    sequenceFlow: businessObject.conditionExpression ? businessObject.conditionExpression.body : ''
  }
  state.nodeElement = element;
}
const modifyFormData = (data) => {
  state.formData.assignee = data.assignee;
  state.formData.userType = data.userType;
}

onMounted(() => {
  handleModeler();
})
</script>

<style scoped>
.bpmn-panel {
  width: 350px;
  border: 1px solid #eeeeee;
  padding: 0 5px;
}

.el-header {
  border-bottom: solid 2px #e4e7ed;
  padding: 0;
}

.config-tab {
  height: 43px;
  line-height: 43px;
  display: inline-block;
  width: 50%;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
}

.config-tab.active {
  border-bottom: solid 2px #409EFF;
}
</style>
