<template>
  <div>
    <!-- 阿里云视频播放器样式 -->
    <link rel="stylesheet"
          href="https://g.alicdn.com/de/prismplayer/2.8.1/skins/default/aliplayer-min.css">
    <!-- 阿里云视频播放器脚本 -->
    <script charset="utf-8" type="text/javascript"
            src="https://g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js"/>
    <!-- 定义播放器dom -->
    <div id="J_prismPlayer" class="prism-player"/>
  </div>
</template>
<script>
import video from "../../api/video";
import axios from "axios";

export default {
  layout: "video",
  asyncData({params, error}) {
    console.log('######', params.id)
    return video.getPlayAuth(params.id).then(response => {
      console.log(response.data)
      return {
        vid : params.id,
        playAuth : response.data.playAuth
      }
    }).catch(error => {
    })
  },
  mounted() {
    console.log("####", this.vid)
    console.log("####", this.playAuth)
    new Aliplayer({
      id: "J_prismPlayer",
      width: "100%",
      height: "500px",
      autoplay: true,
      vid: this.vid,
      playauth: this.playAuth,
      encryptType: '1', // 如果播放加密视频，则需设置encryptType=1，非加密视频无需设置
    }), function (player) {
      console.log("播放器创建好了。");
    };
  }
}
</script>
