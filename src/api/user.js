import request from '@/utils/request'

/**
 * 登录
 * @param {Object} data 用户名、密码
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout(data) {
  return null
}

/**
 * 获取用户信息
 * @param {Number} id 用户ID
 */
export function getInfo(id) {
  return request({
    url: `/user/getInfo/${id}`,
    method: 'get'
  })
}

/**
 * 增加用户角色关联
 * @param {Object} data
 */
export function addUserRole(data) {
  return request({
    url: '/user/addUserRole',
    method: 'post',
    data
  })
}

/**
 * 获取所有用户
 * @param {Object} query 分页信息
 */
export function getUsers(query) {
  return request({
    url: `/user/getUsers`,
    method: 'get',
    params: query
  })
}

/**
 * 新增用户
 * @param {Object} data 用户信息
 */
export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

/**
 * 编辑用户
 * @param {Object} data 用户信息
 */
export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

/**
 * 根据角色 ID 获取用户列表
 * @param {Number} role_id
 */
export function getUserByRoleId(role_id) {
  return request({
    url: `/user/getUserByRoleId/${role_id}`,
    method: 'get'
  })
}

/**
 *
 * @param {*} data
 */
export function deleteUserRole(data) {
  return request({
    url: `/user/deleteUserRole`,
    method: 'post',
    data
  })
}
