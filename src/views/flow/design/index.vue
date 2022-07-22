<template>
  <div>
    <div class="toolbar">
      <el-button type="primary" @click="openNewDialog">添加流程</el-button>
    </div>
    <element-table :url="url" :page-size="10" :columns="columns" ref="elementTable"></element-table>

    <el-dialog title="流程图" v-model="dialogVisible" :fullscreen="true">
      <!-- <ProsessDesign>
      </ProsessDesign> -->
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted } from 'vue';
import ElementTable from "/@/components/element/ElementTable.vue";
// import ProsessDesign from "/@/components/prosessDesign/prosessDesign.vue";

export default {
  name: "design",
  components: { ElementTable },
  setup() {
    const state = reactive({
      dialogVisible: false,
      url: '',
      columns: [{
        key: 'procId',
        title: '流程定义ID'
      }, {
        key: 'name',
        title: '流程名称'
      }, {
        key: 'status',
        title: '状态',
        formatter: (row: any, key: string) => {
          if (row[key] == 0) {
            return "未发布";
          }
          return "已发布"
        }
      }, {
        key: 'ora',
        title: '操作',
        operator: [{
          name: "发布",
          type: "text",
          click: (row: any) => {
            console.log('row', row)
          },
          hidden: () => {
          }
        }, {
          name: "删除",
          type: "text",
          click: (row: any) => {
            console.log('row', row)
          }
        }]
      }]
    });


    const openNewDialog = () => {
      state.dialogVisible = true;
    };

    const processSave = (data: any) => {
      console.log('save', data)
    };

    const deploy = () => {
      console.log('deploy')
    }

    // 页面加载时
    onMounted(() => {
      console.log(123);
    });

    return {
      openNewDialog,
      processSave,
      deploy,
      ...toRefs(state),
    };
  },
}
</script>

<style scoped>
</style>
