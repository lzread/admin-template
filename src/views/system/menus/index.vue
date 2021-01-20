<template>
  <div class="container">
    <div class="filterBar">
      <div class="handle-block">
        <el-button type="primary" @click="addHandle">新建</el-button>
      </div>
    </div>
    <div class="tableArea">
      <el-table
        :data="rows"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="title" label="显示标题">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">
              {{ scope.row.title }}
            </span>
            <span v-else style="color:#1890ff;">
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="类别" width="100">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? '菜单' : '权限按钮' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.type == 0"
              type="text"
              @click="addChildrenHandle(scope.row)"
            >添加下级菜单</el-button>
            <el-button
              v-if="scope.row.type == 0"
              type="text"
              @click="addPermissionHandle(scope.row)"
            >添加权限功能</el-button>

            <el-button
              v-if="scope.row.type == 0"
              type="text"
              @click="editHandle(scope.row)"
            >编辑</el-button>

            <el-button
              v-if="scope.row.type == 1"
              type="text"
              @click="editPermissionHandle(scope.row)"
            >编辑</el-button>

            <el-button
              type="text"
              @click="deleteHandle(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      width="600px"
      :visible.sync="dialogVisible"
      :title="dialogVisibleType == 'add' ? '新建菜单' : '编辑菜单'"
    >
      <el-form
        ref="menu"
        :model="items"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="菜单名称">
          <el-input v-model="items.title" placeholder="请输入" />
          <small class="tips">设置该路由在侧边栏和面包屑中展示的名字</small>
        </el-form-item>

        <el-form-item label="父级菜单">
          <treeselect
            v-model="items.parent_id"
            :default-expand-level="1"
            :searchable="false"
            :clearable="false"
            :options="treeSelectData"
            :normalizer="normalizer"
            :instance-id="items.id || 0"
            placeholder="请选择"
          />
          <small class="tips">选择菜单级别</small>
        </el-form-item>

        <el-form-item label="路由名称">
          <el-input v-model="items.name" placeholder="请输入" />
          <small
            class="tips"
          >设置路由的
            name，一定要填写不然使用<mark>keep-alive</mark>时会出现各种问题</small>
        </el-form-item>

        <el-form-item label="组件路径">
          <el-autocomplete
            v-model="items.component"
            :fetch-suggestions="queryComponentSearch"
            placeholder="请输入"
            @select="handleComponentSelect"
          />
          <small
            class="tips"
          >设置路由的 component 属性， 顶级菜单请设置为
            <mark>layout</mark></small>
        </el-form-item>

        <el-form-item label="菜单路径">
          <el-input v-model="items.path" placeholder="请输入" />
          <small class="tips">设置路由的 path 属性</small>
        </el-form-item>

        <el-form-item label="菜单图标">
          <el-select v-model="items.icon" placeholder="请选择">
            <el-option
              v-for="item in iconItems"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <svg-icon :icon-class="item.value" />
              <span style="margin-left:5px;">{{ item.label }}</span>
            </el-option>
          </el-select>
          <small
            class="tips"
          >设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的
            icon</small>
        </el-form-item>

        <el-form-item label="重定向">
          <el-radio-group v-model="isRedirect" @change="isRedirectHandle">
            <el-radio :label="true">自定义</el-radio>
            <el-radio :label="false">noRedirect</el-radio>
          </el-radio-group>
          <el-input
            v-show="isRedirect"
            v-model="items.redirect"
            placeholder="请输入"
          />
          <small
            class="tips"
          >当设置<mark>noRedirect</mark>
            的时候该路由在面包屑导航中不可被点击</small>
        </el-form-item>

        <el-form-item label="固定显示">
          <el-radio-group v-model="items.affix">
            <el-radio :label="1">固定</el-radio>
            <el-radio :label="0">不固定</el-radio>
          </el-radio-group>
          <small
            class="tips"
          >如果设置，它则会固定在tags-view中(默认 不固定)</small>
        </el-form-item>

        <el-form-item label="面包屑">
          <el-radio-group v-model="items.breadcrumb">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
          <small
            class="tips"
          >如果设置，则不会在breadcrumb面包屑中显示(默认 显示)</small>
        </el-form-item>
        <el-form-item label="页面缓存">
          <el-radio-group v-model="items.noCache">
            <el-radio :label="1">缓存</el-radio>
            <el-radio :label="0">不缓存</el-radio>
          </el-radio-group>
          <small
            class="tips"
          >如果设置，则不会被 <mark>keep-alive</mark> 缓存(默认 缓存)</small>
        </el-form-item>
        <el-form-item label="忽略规则">
          <el-radio-group v-model="items.alwaysShow">
            <el-radio :label="1">忽略</el-radio>
            <el-radio :label="0">不忽略</el-radio>
          </el-radio-group>
          <small
            class="tips"
          >如果设置，就会忽略之前定义的规则，一直显示根路由</small>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="danger" @click="reset('menu')">取消</el-button>
        <el-button type="primary" @click="commitHandle()">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="600px"
      :visible.sync="dialogPermVisible"
      :title="dialogVisiblePermType == 'add' ? '新建权限按钮' : '编辑权限按钮'"
    >
      <el-form
        ref="perm"
        :model="items"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="权限功能">
          <el-radio-group v-model="permGroup">
            <el-radio-button label="ADD">新建权限</el-radio-button>
            <el-radio-button label="EDIT">编辑权限</el-radio-button>
            <el-radio-button label="DELETE">删除权限</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="items.title" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="reset('perm')">取消</el-button>
        <el-button
          type="primary"
          @click="commitPermissionHandle()"
        >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 下拉树形选择框 https://github.com/riophae/vue-treeselect
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { list, listSmall, add, edit, del } from '@/api/menu'
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  name: 'Menus',
  components: { Treeselect },
  directives: { permission },
  data() {
    return {
      rows: [],
      items: {},
      parentItems: [],
      dialogVisible: false,
      dialogPermVisible: false,
      dialogVisibleType: '',
      dialogVisiblePermType: '',
      restaurants: [],
      iconItems: [],
      isTop: true,
      isRedirect: true,
      permGroup: 'ADD'
    }
  },
  computed: {
    treeSelectData() {
      return [
        {
          id: 0,
          parent_id: -1,
          title: '根节点',
          children: this.parentItems
        }
      ]
    }
  },
  mounted() {
    this.restaurants = this.loadFileNameAll()
    this.iconItems = this.loadIconNameAll()
    this.getParentMap()
  },
  created() {
    this.getList()
  },
  methods: {
    normalizer(node, instanceId) {
      let disabled = false
      if (node.id == instanceId && node.parent_id != -1) {
        disabled = true
      }
      return {
        id: node.id,
        label: node.title,
        isDisabled: disabled,
        children: node.children
      }
    },
    async getList() {
      const { data } = await list()
      this.rows = data
    },
    async getParentMap() {
      const { data } = await listSmall()
      this.parentItems = data
    },
    addHandle() {
      this.isTop = true
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.items = {
        component: 'layout'
      }
    },
    editHandle(row) {
      if (row.parent_id == 0) {
        this.isTop = true
      } else {
        this.isTop = false
      }
      this.getParentMap()
      this.dialogVisible = true
      this.dialogVisibleType = 'edit'
      this.items = row
    },
    deleteHandle(row) {
      this.$confirm('是否删除当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await del(row.id)
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    async commitHandle() {
      if (this.dialogVisibleType === 'add') {
        await add(this.items)
      } else {
        await edit(this.items)
      }
      this.dialogVisible = false
      this.getList()
    },
    addChildrenHandle(row) {
      this.isTop = false
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.getParentMap()
      this.items = {}
      this.items.parent_id = row.id
    },
    addPermissionHandle(row) {
      this.dialogPermVisible = true
      this.dialogVisiblePermType = 'add'

      this.items = {
        type: 1,
        parent_id: row.id
      }
    },
    editPermissionHandle(row) {
      this.dialogPermVisible = true
      this.dialogVisiblePermType = 'edit'
      this.items = row
    },

    async commitPermissionHandle() {
      this.items.name = this.permGroup
      if (this.dialogVisiblePermType === 'add') {
        await add(this.items)
      } else {
        await edit(this.items)
      }
      this.dialogPermVisible = false
      this.getList()
    },

    isRedirectHandle(res) {
      if (res) {
        this.isRedirect = true
      } else {
        this.isRedirect = false
      }
    },
    loadFileNameAll() {
      const restaurants = this.restaurants
      const files = require.context('@/views', true, /\.vue$/)
      files.keys().map(path => {
        const name = path.replace(/^\.\/(.*)\.\w+$/, '$1')
        restaurants.push({ value: name })
      }, {})
      return restaurants
    },
    loadIconNameAll() {
      const iconItems = this.iconItems
      const icons = require.context('@/icons/svg/', false, /\.svg$/)
      icons.keys().map(path => {
        const name = path.replace(/^\.\/(.*)\.\w+$/, '$1')
        iconItems.push({ value: name, label: name })
      }, {})
      return iconItems
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleComponentSelect(res) {
      this.items.component = res.value
    },
    queryComponentSearch(queryString, cb) {
      const restaurants = this.restaurants
      const results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    reset(formName) {
      this.dialogVisible = false
      this.dialogPermVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-autocomplete {
  display: block;
}
.tips {
  display: block;
  width: 100%;
  float: left;
  color: #7a7a7a;
  mark {
    padding: 0 3px;
    margin: 0 3px;
  }
}
</style>
