import request from '@/utils/request'
const api_name = '/ucenterservice/ucenter-member'

export default {
  getCodeByMobile(mobile) {
    return request({
      url: `/msmservice/msm/send/${mobile}`,
      method: 'get'
    })
  },
  registerMember(registerVo) {
    return request({
      url: `${api_name}/register`,
      method: 'post',
      data: registerVo
    })
  }
}
