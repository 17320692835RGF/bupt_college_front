import request from "../utils/request";
const api_name = "/cmsservice/cms-banner-front";
export default {
  getBannerList(){
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  }
}
