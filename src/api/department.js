import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/department/list',
    method: 'get',
    params: query
  })
}

export function add(data) {
  return request({
    url: '/department/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/department/edit',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/department/del/${id}`,
    method: 'post'
  })
}
