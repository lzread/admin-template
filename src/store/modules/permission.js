import { constantRoutes } from '@/router'
import { makePermissionRouters, filterAsyncRoutes } from '@/utils/router'
const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { roles, serverRouter }) {
    return new Promise(resolve => {
      let accessedRoutes

      const routes = makePermissionRouters(serverRouter)
      if (roles.includes('admin')) {
        accessedRoutes = routes || []
      } else {
        accessedRoutes = filterAsyncRoutes(routes, roles)
      }

      commit('SET_ROUTES', accessedRoutes)

      resolve(routes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
