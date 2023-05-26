<template>
  <div class="app-container">
    课程列表

    <!--查询表单-->
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseQuery.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseQuery.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>
      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程标题"/>
      </el-form-item>
      <!-- 讲师 -->
      <el-form-item>
        <el-select v-model="courseQuery.teacherId"
                   placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查
        询
      </el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column  prop="title" label="课程名称" width="300"/>

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 'Normal' ? '已发布' : '未发布' }}
        </template>
      </el-table-column>

      <el-table-column  prop="lessonNum" label="课时数"/>

      <el-table-column   label="讲师名字">
        <template slot-scope="scope">
          {{ formattedTeacherName(scope.row)}}
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="300"/>

      <el-table-column prop="viewCount" label="浏览数量" width="60"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/edu/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />

  </div>
</template>
<script>
//引入调用teacher.js文件
import eduCourse from '@/api/edu/eduCourse'
import eduSubject from "@/api/edu/eduSubject";
import eduTeacher from "@/api/edu/eduTeacher";

export default {
  //写核心代码位置
  // data:{
  // },
  data() { //定义变量和初始值
    return {
      list: null,//查询之后接口返回集合
      page: 1,//当前页
      limit: 4,//每页记录数
      total: 0,//总记录数
      courseQuery: {
        subjectParentId: '',
        subjectId: '',
        title: '',
        teacherId: '',
      }, //条件封装对象
      teacherList: [],//讲师列表
      subjectNestedList: [],//课程分类列表
      subSubjectList: [],//二级分类列表

    }
  },
  created() { //页面渲染之前执行，一般调用methods定义的方法
    //调用
    this.fetchData()
    this.initSubjectList()
    this.initTeacherList()
  },
  computed: {
    formattedTeacherName() {
      return function(row) {
        for(let i = 0; i < this.teacherList.length; i++) {
          if(row.teacherId === this.teacherList[i].id) {
            return this.teacherList[i].name
          }
        }
      }
    }
  },
  methods: {  //创建具体的方法，调用teacher.js定义的方法
    //讲师列表的方法
    fetchData(page = 1) {
      this.page = page
      eduCourse.getCourseList(this.page, this.limit, this.courseQuery)
        .then(response => {//请求成功
          //response接口返回的数据
          this.list = response.data.rows
          this.total = response.data.total
        })
    },
    initSubjectList() {
      eduSubject.getNestedTreeList()
        .then(response => {
          this.subjectNestedList = response.data.items
        })
    },
    initTeacherList() {
      eduTeacher.getList()
        .then(response => {
          console.log(this.teacherList)
          this.teacherList = response.data.items
        })
    },
    subjectLevelOneChanged(value) {
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children
          this.courseQuery.subjectId = null
          break
        }
      }
    },
    resetData() {//清空的方法
      //表单输入项数据清空
      this.courseQuery = {}
      //查询所有讲师数据
      this.initTeacherList()
    },
    removeDataById(courseId){
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {//点击确定按钮
        //调用接口
        eduCourse.removeCourseById(courseId)
          .then(response => {
            //删除成功
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //刷新列表
            this.fetchData()
          })
      }).catch(response => {//点击取消按钮
        if(response === 'cancel'){
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        }
      })
    }

  }
}
</script>
