import request from '@/utils/request'

const api_name = '/eduservice/edu-teacher'

export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  removeById(eduTeacherId){
    return request({
      url: `${api_name}/${eduTeacherId}`,
      method: 'delete'
    })
  },
  save(eduTeacher) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: eduTeacher
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  updateById(eduTeacher) {
    return request({
      url: `${api_name}/${eduTeacher.id}`,
      method: 'put',
      data: eduTeacher
    })
  },
  getList(){
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  }
}

