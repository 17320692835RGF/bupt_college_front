import request from "../utils/request";
const api_name = "/ucenterservice/ucenter-member";

export default {
  login(loginVo) {
    return request({
      url: `${api_name}/login`,
      method: "post",
      data: loginVo
    })
  },
  getLoginInfoByToken() {
    return request({
      url: `${api_name}/getLoginInfoByToken`,
      method: "get"
    })
  }
}
