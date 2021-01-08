import request from '@/utils/request'
/**
 * 获取角色菜单
 */
export function getMenus() {
  return request({
    url: '/menu/getMenus',
    method: 'get'
  })
}

export function list() {
  return request({
    url: '/menu/getAllMenus',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/menu/edit',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/menu/del/${id}`,
    method: 'post'
  })
}
