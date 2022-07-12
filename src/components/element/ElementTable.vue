<template>
  <div>
    <el-table :data="data.list">
      <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.key" :label="item.title"
        :formatter="item.formatter">
        <template #default="scope">
          <div v-if="item.operator">
            <template v-for="(o, key) in item.operator">
              <el-button :type="o.type" :key="key" @click="o.click(scope.row)" size="small"
                v-if="!o.hidden || !o.hidden(scope.row)">{{ o.name }}
              </el-button>
            </template>
          </div>
          <div v-else>
            <span v-if="!item.formatter">
              <template v-if="item.type">
                {{ item.type == 'date' ? dateFormat(scope.row[item.key], "YYYY-MM-DD") : dateFormat(scope.row[item.key])
                }}
              </template>
              <template v-else>
                {{ scope.row[item.key] }}
              </template>
            </span>
            <span v-else v-html="item.formatter(scope.row, item.key, scope.row[item.key], index)"></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="background-color: #ffffff;text-align: right;padding: 8px 0;">
      <el-pagination layout="prev, pager, next" :total="data.total" :page-size="pageSize" :current-page="page"
        @prev-click="reload" @next-click="reload" @current-change="reload">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, onMounted } from 'vue';
export default {
  name: "ElementTable",
  props: {
    url: String,
    pageSize: Number,
    columns: Array
  },

  setup(props) {
    const state = reactive({
      data: {
        total: 0
      },
      page: 1
    });


    const reload = (page) => {
      if (!props.url) {
        return;
      }
      state.page = page;
      state.get(props.url, { page: state.page, pageSize: props.pageSize }, res => {
        state.data = res.data;
      })
    };
    const deploy = (row) => {
      console.log(row)
    };
    const open = () => {
      console.log("d")
    }

    // 页面加载时
    onMounted(() => {
      reload(state.page)
    });

    return {
      open,
      reload,
      deploy,
      ...toRefs(state),
    };
  },

}
</script>

<style scoped>
</style>
