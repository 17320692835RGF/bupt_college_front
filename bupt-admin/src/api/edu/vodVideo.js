import request from "@/utils/request";
const api_mame = "/vodservice/vod";

export default {
  removeById(id) {
    return request({
      url: `${api_mame}/${id}`,
      method: "delete"
    })
  }
}
