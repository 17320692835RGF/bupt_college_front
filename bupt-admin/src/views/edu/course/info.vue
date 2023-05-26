<template>

  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="marginbottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px" style="margin: 40px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视"/>
      </el-form-item>
      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          @change="subjectLevelOneChanged"
          v-model="courseInfo.subjectParentId"
          placeholder="请选择">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select ref="myselect" v-model="courseInfo.subjectId" clearable placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

      </el-form-item>
      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right"/>
      </el-form-item>
      <!-- 课程简介 TODO -->
      <TinymceEditor
        v-model="courseInfo.description"
      />
      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/ossservice/oss/upload'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="请填写课程的价格"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
import eduCourse from '@/api/edu/eduCourse'
import eduSubject from "@/api/edu/eduSubject";
import eduTeacher from "@/api/edu/eduTeacher";
// import tinymce from '@/components/Tinymce'
import TinymceEditor from '@tinymce/tinymce-vue'

const defaultForm = {
  title: '',
  subjectId: '',
  subjectParentId: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: process.env.VUE_APP_OSS_PATH + '/2023/05/18/0fe75f9b-f831-4a3a-983d-e47a3106a0ad.png',
  price: 0,

}
export default {
  components: {
    TinymceEditor
  },
  data() {
    return {
      courseInfo: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectNestedList: [],//一级分类列表
      subSubjectList: [],//二级分类列表
      teacherList: [],//讲师列表

      BASE_API: process.env.VUE_APP_BASE_API
    }
  },
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    console.log('info created')
    this.init()
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(URL.createObjectURL(file.raw)) //base64编码
      this.courseInfo.cover = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M

    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        console.log(id)
        this.fetchCourseInfoById(id)
      } else {
        this.courseInfo = {...defaultForm}
        this.initSubjectList()
        this.initTeacherList()
      }

    },
    fetchCourseInfoById(id) {
      eduCourse.getCourseById(id).then(response => {
        this.courseInfo = response.data.item
        eduSubject.getNestedTreeList().then(response => {
          this.subjectNestedList = response.data.items
          for (let i = 0; i < this.subjectNestedList.length; i++) {
            if (this.subjectNestedList[i].id === this.courseInfo.subjectParentId) {
              this.subSubjectList = this.subjectNestedList[i].children
              break
            }
          }
        }).catch(response =>{
          this.$message.error(response.message)
        })
        this.initTeacherList()
      }).catch(response => {
        this.$message({
          type: "error",
          message: response.message
        })
      })
    },
    initSubjectList() {
      eduSubject.getNestedTreeList().then(response => {
        this.subjectNestedList = response.data.items
      })
    },
    initTeacherList() {
      eduTeacher.getList().then(response => {
        this.teacherList = response.data.items
      })
    },
    subjectLevelOneChanged(value) {
      console.log(value)
      this.courseInfo.subjectId = ""
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children
          break
        }
      }
    },
    next() {
      console.log('next')
      this.saveBtnDisabled = true
      if (!this.courseInfo.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 保存
    saveData() {
      console.log(this.courseInfo)
      eduCourse.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({
          path: '/edu/course/chapter/' + response.data.courseId
        })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    updateData() {
      this.saveBtnDisabled = true
      eduCourse.updateCourseInfoById(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({
          path: '/edu/course/chapter/' + this.$route.params.id
        })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    }
  }
}
</script>
