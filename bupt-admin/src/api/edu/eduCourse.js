import request from '@/utils/request'
const api_name = '/eduservice/edu-course'
export default {
  saveCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/saveCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  getCourseList(page, limit, courseQuery) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },
  getCourseById(id){
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  updateCourseInfoById(courseInfo) {
    return request({
      url: `${api_name}`,
      method: 'put',
      data: courseInfo
    })
  },
  getCoursePublishVoById(id) {
    return request({
      url: `${api_name}/getCoursePublishVoById/${id}`,
      method: 'get'
    })
  },
  publishCourseById(id) {
    return request({
      url: `${api_name}/publishCourseById/${id}`,
      method: 'put'
    })
  },
  removeCourseById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }

}

