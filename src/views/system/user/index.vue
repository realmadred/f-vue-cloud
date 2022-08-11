<template>
  <div class="system-user-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input
          size="small"
          v-model="keyword"
          placeholder="请输入用户名称"
          style="max-width: 180px"
          @keydown.enter="search"
        ></el-input>
        <el-button size="small" type="primary" class="ml10" @click="search">
          <el-icon>
            <elementSearch />
          </el-icon>查询
        </el-button>
        <el-button v-auth="'/sysUser/post'" size="small" type="success" class="ml10" @click="onOpenAddUser">
          <el-icon>
            <elementPlus />
          </el-icon>新增用户
        </el-button>
      </div>
      <el-table stripe highlight-current-row :data="tableData.data" style="width: 100%">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="手机" />
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
        <el-table-column prop="headImage" label="头像">
          <template #default="scope">
            <el-avatar :src="getSrc(scope.row.headImage)" :lazy="true"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.sex == 1">男</el-tag>
            <el-tag type="danger" v-else-if="scope.row.sex == 0">女</el-tag>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="账号状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="passwordErrorNum" label="密码错误次数" />
        <el-table-column prop="isAdmin" label="是否管理员">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.isAdmin">是</el-tag>
            <el-tag type="info" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button v-auth="'/sysUser/put'"
              :disabled="scope.row.isAdmin === 1"
              size="small"
              type="primary" link
              @click="onOpenEditUser(scope.row)"
            >修改</el-button>
            <el-button v-auth="'/sysUser/put'"
              :disabled="scope.row.isAdmin === 1"
              size="small"
              type="primary" link
              @click="onOpenUserRole(scope.row)"
            >角色</el-button>
            <el-button v-auth="'/sysUser/delete'"
              :disabled="scope.row.isAdmin === 1"
              size="small"
              type="primary" link
              @click="onRowDel(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
        class="mt15"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        v-model:current-page="tableData.param.pageNum"
        background
        v-model:page-size="tableData.param.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </el-card>
    <AddUer ref="addUserRef" />
    <EditUser ref="editUserRef" />
    <UserRole ref="userRoleRef" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, getCurrentInstance, onUnmounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { selectPage, deleteById, SysUser } from "/@/api/system/user/index";
import AddUer from "/@/views/system/user/component/addUser.vue";
import EditUser from "/@/views/system/user/component/editUser.vue";
import UserRole from "/@/views/system/user/component/userRole.vue";
import { getSrc } from '/@/utils/common';
export default {
  name: "systemUser",
  components: { AddUer, EditUser, UserRole },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const addUserRef = ref();
    const userRoleRef = ref();
    const editUserRef = ref();
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
      keyword: "",
    });
    // 初始化表格数据
    const initTableData = async () => {
      // 请求接口获取数据
      let json = await selectPage({
        page: state.tableData.param.pageNum,
        size: state.tableData.param.pageSize,
        entity: { name: state.keyword },
      });
      state.tableData.data = json.data.records;
      state.tableData.total = json.data.total;
    };

    const search = () => {
      initTableData();
    };

    // 打开新增用户弹窗
    const onOpenAddUser = () => {
      addUserRef.value.openDialog();
    };
    // 打开修改用户弹窗
    const onOpenEditUser = (row: SysUser) => {
      editUserRef.value.openDialog(row);
    };

    // 打开修改用户弹窗
    const onOpenUserRole = (row: SysUser) => {
      userRoleRef.value.openDialog(row);
    };

    // 删除用户
    const onRowDel = (row: SysUser) => {
      ElMessageBox.confirm(
        `此操作将永久删除账户名称：“${(row as any).name}”，是否继续?`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          deleteById(row.id).then(() => {
            ElMessage.success("删除成功");
            initTableData()
          })
        })
        .catch(() => { });
    };
    // 分页改变
    const onHandleSizeChange = (val: number) => {
      state.tableData.param.pageSize = val;
      initTableData();
    };
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
      state.tableData.param.pageNum = val;
      initTableData();
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
      proxy.mittBus.on("search", () => {
        search();
      });
    });
    // 页面加载时
    onUnmounted(() => {
      proxy.mittBus.off("search", () => { });
    });
    return {
      addUserRef,
      editUserRef,
      userRoleRef,
      search,
      onOpenAddUser,
      onOpenEditUser,
      onOpenUserRole,
      onRowDel,
      onHandleSizeChange,
      onHandleCurrentChange,
      getSrc,
      ...toRefs(state),
    };
  },
};
</script>

<style scoped lang="scss">
.system-user-container {
}
</style>
