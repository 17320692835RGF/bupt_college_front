import request from '@/utils/request'
const api_name = '/eduservice/edu-comment-front'
export default {
  //根据课程id获取评论列表
  getCommentList(courseId,page,limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: {courseId}
    })
  },
  //添加评论
  addComment(comment) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: comment
    })
  }
}
