import request from "../utils/request";
const api_name = "/eduservice/edu-course-front";

export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "post",
      data: searchObj
    })
  },
  getAllSubject() {
    return request({
      url: '/eduservice/edu-subject/getAllSubject',
      method: 'get'
    })
  },
  getCourseById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  }

}
