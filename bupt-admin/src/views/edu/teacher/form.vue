<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
          数据类型一定要和取出的json中的一致，否则没法回填
          因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload"
                   @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_URL+'/ossservice/oss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary"
                   @click="saveOrUpdate">保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import eduTeacher from "@/api/edu/eduTeacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  components: {ImageCropper, PanThumb},
  data() {
    return {
      teacher: {
        id: null,
        name: '',
        level: 1,
        intro: '',
        career: '',
        sort: 0,
        avatar:  process.env.OSS_PATH+'/avatar/default.jpg'
      },
      saveBtnDisabled: false,
      BASE_URL: process.env.VUE_APP_BASE_API,
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    saveData() {
      eduTeacher.save(this.teacher).then(response => {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        this.$router.push({path: '/edu/teacher/list'})
      }).catch(error => {
        this.$message({
          message: '保存失败',
          type: 'error'
        });
      })
    },
    fetchDataById(id) {
      eduTeacher.getById(id).then(response => {
        this.teacher = response.data.item
      }).catch(error => {
        this.$message({
          message: '获取数据失败',
          type: 'error'
        });
      })
    },
    updateData() {
      this.saveBtnDisabled = true
      eduTeacher.updateById(this.teacher).then(response => {
        return this.$message({
          message: '更新成功',
          type: 'success'
        });
      }).then(response => {
        this.$router.push({path: '/edu/teacher/list'})
      }).catch(response => {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      })
    },
    cropSuccess(data){
      console.log(data)
      this.imagecropperShow = false
      this.teacher.avatar = data.url
      //重新打开上传组件时初始化组件，否则显示上一次的结果
      this.imagecropperKey = this.imagecropperKey + 1
    },
    close(){
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    }

  },
  created() {
    console.log('页面渲染前')
    if (this.$route.query && this.$route.query.id) {
      console.log(this.$route.query.id)
      const id = this.$route.query.id
      this.fetchDataById(id)
    }
  }
}
</script>
