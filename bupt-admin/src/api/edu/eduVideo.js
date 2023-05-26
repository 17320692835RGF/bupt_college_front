import request from "@/utils/request";
const api_name = "/eduservice/edu-video";

export default {
  saveVideoVo(videoVo) {
    return request({
      url: `${api_name}`,
      method: "post",
      data: videoVo
    })
  },
  getVideoVoById(id) {
      return request({
        url: `${api_name}/${id}`,
        method: "get"
      })
  },
  updateVideoVoById(videoVo) {
    return request({
      url: `${api_name}`,
      method: "put",
      data: videoVo
    })
  },
  removeVideoVoById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: "delete"
    })
  }

}
