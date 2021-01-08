import { asyncRoutes } from '@/router'
const hasPermission = (roles, route) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
/**
 * 转换服务端菜单格式
 * @param {Object} serverRouter
 */
export const makePermissionRouters = serverRouter => {
  const obj = []
  const map = []
  serverRouter.forEach(item => {
    map[item.id] = item
  })
  serverRouter.forEach(item => {
    if (item.path) {
      if (item.parent_id == 0) {
        item.component = resolve => require(['@/layout'], resolve)
      } else {
        const component = item.component
        item.component = resolve => require(['@/views/' + component], resolve)
      }

      const parent = map[item.parent_id]

      item.meta = {}
      item.meta.roles = stringToArray(item.roles)
      item.meta.permission = matchPermission(serverRouter, item)
      item.meta.title = item.title
      item.hidden = item.hidden != 0
      item.meta.noCache = item.noCache != 0
      item.meta.activeMenu = item.activeMenu != 0
      item.meta.affix = item.affix != 0
      item.meta.alwaysShow = item.alwaysShow != 0
      item.meta.breadcrumb = item.breadcrumb != 0
      item.meta.icon = item.icon

      delete item.status
      delete item.sort
      delete item.roles
      delete item.title
      delete item.noCache
      delete item.activeMenu
      delete item.affix
      delete item.alwaysShow
      delete item.breadcrumb
      delete item.icon

      if (parent) {
        if (!Array.isArray(parent.children)) {
          parent.children = []
        }
        parent.children.push(item)
      } else {
        obj.push(item)
      }
    }
  })
  // 将 asyncRoutes 合并
  return obj.concat(asyncRoutes)
}

/**
 * 转换按钮权限格式
 * @param {Object} serverRouter
 * @param {Object} element
 */
const matchPermission = (serverRouter, element) => {
  if (element.type === 0) {
    const res = []
    serverRouter.map(item => {
      if (element.id == item.parent_id && item.type == 1) {
        res.push({
          name: item.name,
          title: item.title,
          roles: stringToArray(item.roles)
        })
      }
    })
    return res
  } else {
    return []
  }
}

const stringToArray = res => {
  if (res) {
    return res.split(',')
  } else {
    return []
  }
}

export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {
      ...route
    }

    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
