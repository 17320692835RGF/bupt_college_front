<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="marginbottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controlsposition="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controlsposition="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :before-upload="beforeVideoUpload"
            :file-list="fileList"
            :action="BASE_API+'/vodservice/vod'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary"
                   @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <el-form label-width="120px">
      <el-button type="text" @click="dialogChapterFormVisible = true">添加章节</el-button>
      <!-- 章节 -->
      <ul class="chanpterList">
        <li
          v-for="chapter in chapterNestedList"
          :key="chapter.id">
          <p >
            {{ chapter.title }}
            <span class="acts" >
              <el-button type="text" @click="dialogVideoFormVisible = true; chapterId = chapter.id">添加课时</el-button>
              <el-button  type="text" v-on:click.native="editChapter(chapter.id)" >编辑</el-button>
              <el-button  type="text" v-on:click.native="removeChapter(chapter.id)">删除</el-button>
              </span>
          </p>
          <!-- 视频 -->
          <ul class="chanpterList videoList">
            <li
              v-for="video in chapter.children"
              :key="video.id">
              <p>{{ video.title }}
                <span class="acts">
                 <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                 <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
               </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下
          一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import eduChapter from "@/api/edu/eduChapter";
import eduVideo from "@/api/edu/eduVideo";
import vodVideo from "@/api/edu/vodVideo";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      video: {// 课时对象
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: '',
        videoOriginalName: ''
      },
      chapterId: '', // 课时所在的章节id
      courseId: '', // 所属课程
      chapterNestedList: [], //
      dialogChapterFormVisible: false,
      chapter: {
        title: '',
        sort: 0
      },
      BASE_API: process.env.VUE_APP_BASE_API,
      fileList: []
    }
  },
  created() {
    console.log('chapter created')
    this.init()
  },
  methods: {
    beforeVideoUpload(file) {
      const isLt1G = file.size / 1024 / 1024 / 1024 < 1;
      if (!isLt1G) {
        this.$message.error('上传视频大小不能超过 1G!');
      }
      this.saveVideoBtnDisabled = true
      return isLt1G;
    },
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleVodRemove(file, fileList) {
      console.log(file, fileList);
      vodVideo.removeById(this.video.videoSourceId).then(response => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        this.fileList = []
        console.log("############")
        this.$message.success('删除成功')
      })
    },
    handleVodUploadSuccess(response, file, fileList) {
      console.log(response)
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
      this.saveVideoBtnDisabled = false
    },
    handleUploadExceed(files, fileList) {
      this.$message.warning('要想重新上传视频，请删除已上传的视频')
    },
    removeVideo(videoId){
      this.$confirm('是否删除课时?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        eduVideo.removeVideoVoById(videoId).then(response => {
          this.$message.success('删除成功')
          this.fetchChapterNestedListByCourseId()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    editVideo(videoId){
      this.dialogVideoFormVisible = true
      eduVideo.getVideoVoById(videoId).then(response => {
        this.video = response.data.item
        if(this.video.videoOriginalName){
          this.fileList = [{'name': this.video.videoOriginalName}]
        }
        else{
          this.fileList = []
        }
      })
    },
    saveOrUpdateVideo(){
      this.saveVideoBtnDisabled = true
      if(!this.video.id){
        this.saveDataVideo()
      }else{
        this.updateDataVideo()
      }
    },
    saveDataVideo(video) {
      this.video.chapterId = this.chapterId
      this.video.courseId = this.courseId
      eduVideo.saveVideoVo(this.video).then(response => {
        this.$message.success('保存成功')
        this.helpSaveVideo()
      })
    },
    updateDataVideo(){
      eduVideo.updateVideoVoById(this.video).then(response => {
        this.$message.success('更新成功')
        this.helpSaveVideo()
      })

    },
    helpSaveVideo(){
      this.saveVideoBtnDisabled = false
      this.dialogVideoFormVisible = false
      this.fetchChapterNestedListByCourseId()
      this.video.title = ''
      this.video.videoSourceId = ''
    },
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除章节，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return eduChapter.removeById(chapterId)
      }).then(() => {
        this.fetchChapterNestedListByCourseId()
        this.$message.success('删除成功')
      }).catch(response => {
        if (response == 'cancel') {
          this.$message.info('已取消删除')
        } else {
          this.$message.error(response.message)
        }
      })
    },
    editChapter(chapterId) {
      console.log('editChapter')
      this.dialogChapterFormVisible = true
      eduChapter.getById(chapterId).then(response => {
        this.chapter = response.data.item
      })
    },
    saveOrUpdate() {
      console.log('saveOrUpdate')
      this.saveBtnDisabled = true
      if (!this.chapter.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    saveData() {
      this.chapter.courseId = this.courseId
      eduChapter.save(this.chapter).then(response => {
        this.$message.success('添加成功')
        this.helpSave()
      })
    },
    updateData() {
      eduChapter.updateById(this.chapter).then(response => {
        this.$message.success('更新成功')
        this.helpSave()
      }).catch(error => {
        this.$message.error('更新失败')
      })
    },
    helpSave() {
      this.dialogChapterFormVisible = false
      this.fetchChapterNestedListByCourseId()
      this.chapter.title = ''
      this.chapter.sort = 0
      this.saveBtnDisabled = false
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 根据id获取课程基本信息
        this.fetchChapterNestedListByCourseId()
      }
    },
    fetchChapterNestedListByCourseId() {
      eduChapter.getNestedTreeList(this.courseId).then(response => {
        this.chapterNestedList = response.data.items
        console.log(this.chapterNestedList)
      })
    },
    previous() {
      console.log('previous')
      this.$router.push({path: '/edu/course/info/' + this.$route.params.id})
    },
    next() {
      console.log('next')
      this.$router.push({path: '/edu/course/publish/' + this.$route.params.id})
    }
  }
}
</script>

<style scoped>
.chanpterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
  position: relative;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
