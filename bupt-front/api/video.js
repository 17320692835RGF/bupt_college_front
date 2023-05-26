import request from '@/utils/request'
const api_name = '/vodservice/vod'
export default {
  getPlayAuth(vid) {
    return request({
      url: `${api_name}/getVideoPlayAuth/${vid}`,
      method: 'get'
    })
  }
}
