import request from "../utils/request";

const api_name = "/eduservice/edu-teacher-front";

export default {
  // 分页查询讲师的方法
  getTeacherListPage(page, limit) {

    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get'
    })
  },
  getTeacherById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  }
}
