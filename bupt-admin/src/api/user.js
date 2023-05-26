import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/eduservice/edu-teacher/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/eduservice/edu-teacher/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/eduservice/edu-teacher/user/logout',
    method: 'post'
  })
}
