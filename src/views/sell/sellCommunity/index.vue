<template>
  <div class="SellCommunity-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input v-model="name" @keydown.enter="initTableData" size="small" placeholder="请输入关键字"
          style="max-width: 180px"></el-input>
        <el-button size="small" type="primary" class="ml10" @click="initTableData">
          <el-icon>
            <elementSearch />
          </el-icon>查询
        </el-button>
        <el-button size="small" type="success" class="ml10" @click="onOpenAdd">
          <el-icon>
            <elementPlus />
          </el-icon>新增
        </el-button>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="小区名称" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="houseNumber" label="户数" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="onOpenEdit(scope.row)">修改</el-button>
            <el-button size="small" type="primary" link @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" class="mt15"
        :pager-count="5" :page-sizes="[10, 20, 50]" v-model:current-page="tableData.param.pageNum" background
        v-model:page-size="tableData.param.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"></el-pagination>
    </el-card>
    <AddSellCommunity ref="addRef" />
    <EditSellCommunity ref="editRef" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import AddSellCommunity from '/@/views/sell/sellCommunity/component/add.vue';
import EditSellCommunity from '/@/views/sell/sellCommunity/component/edit.vue';
import { selectPage, deleteById } from '/@/api/sell/sellCommunity';
export default {
  name: 'SellCommunity',
  components: { AddSellCommunity, EditSellCommunity },
  setup() {
    const addRef = ref();
    const editRef = ref();
    const state: any = reactive({
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
        },
      },
      name: '',
    });
    // 初始化表格数据
    const initTableData = async () => {
      // 请求接口获取数据
      let data = null;
      if (state.name && state.name.trim()) {
        data = { name: state.name.trim() }
      }

      let json = await selectPage({
        page: state.tableData.param.pageNum,
        size: state.tableData.param.pageSize,
        entity: data,
        orders: [{ column: "id", asc: false }]
      });
      state.tableData.data = json.data.records;
      state.tableData.total = json.data.total;
    };
    // 打开新增字典弹窗
    const onOpenAdd = () => {
      addRef.value.openDialog(initTableData);
    };
    // 打开修改字典弹窗
    const onOpenEdit = (row: Object) => {
      editRef.value.openDialog(row);
    };
    // 删除字典
    const onRowDel = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除数据，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteById(row.id).then(() => {
            ElMessage.success('删除成功');
            initTableData()
          })
        })
        .catch(() => { });
    };

    // 分页改变
    const onHandleSizeChange = (val: number) => {
      state.tableData.param.pageSize = val;
      initTableData()
    };

    // 分页改变
    const onHandleCurrentChange = (val: number) => {
      state.tableData.param.pageNum = val;
      initTableData()
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      addRef,
      editRef,
      onOpenAdd,
      onOpenEdit,
      onRowDel,
      onHandleSizeChange,
      onHandleCurrentChange,
      initTableData,
      ...toRefs(state),
    };
  },
};
</script>
