import request from "../utils/request";
const api_name = "/eduservice/edu-index-front";
export default {
  getList() {
    return request({
      url: `${api_name}/index`,
      method: "get"
    });
  }

}
