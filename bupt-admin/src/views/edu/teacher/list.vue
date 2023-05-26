<template>
  <div class="app-container">
    <!-- 查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="text-align: center">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师名"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查 询
      </el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      :data="list"
      style="width: 100%">
      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="讲师姓名"
        prop="name">
      </el-table-column>
      <el-table-column
        label="讲师介绍"
        prop="intro">
      </el-table-column>
      <el-table-column label="讲师等级">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="gmtCreate">
      </el-table-column>
      <el-table-column
        label="操作">

        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">Edit
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDel(scope.row.id)">Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      style="text-align: center; padding: 30px 0;"
      layout="prev, pager, next"
      @current-change="fetchData"
    >
    </el-pagination>

  </div>
</template>
<script>
import eduTeacher from "@/api/edu/eduTeacher"
export default {
  data() {
    return {
      listLoading: true,
      list: null,
      total: 0,
      page: 1,
      limit: 3,
      searchObj: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(page = 1) {
      console.log("加载列表")
      this.page = page
      this.listLoading = true
      eduTeacher.getPageList(this.page, this.limit, this.searchObj).then(response => {
        if (response.success) {
          this.list = response.data.rows
          this.total = response.data.total
          this.listLoading = false
        }

      })
    },
    resetData(){
      this.searchObj = {}
      this.fetchData()
    },
    handleDel(eduTeacherId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        eduTeacher.removeById(eduTeacherId).then(response => {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fetchData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      }).catch((error) => {
        console.log(error)
      })
    },
    handleEdit(eduTeacher){
      this.$router.push({
        path: '/edu/teacher/edit',
        query: {
          id: eduTeacher.id
        }
      })
    }

  }



}

</script>
