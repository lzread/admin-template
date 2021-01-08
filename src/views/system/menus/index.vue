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

        <el-table-column prop="name" width="180" label="路由名称">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? scope.row.name : '' }}
          </template>
        </el-table-column>

        <el-table-column label="Affix" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">
              <el-switch
                v-model="scope.row.affix"
                active-value="true"
                inactive-value="false"
              />
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Breadcrumb" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">
              <el-switch
                v-model="scope.row.breadcrumb"
                active-value="true"
                inactive-value="false"
              />
            </span>
          </template>
        </el-table-column>

        <el-table-column label="类别" width="100">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? '菜单' : '功能' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.type == 0"
              type="text"
              @click="addChildrenHandle(scope.row)"
            >添加下级菜单</el-button>
            <el-button
              v-show="scope.row.type == 0"
              type="text"
              @click="addPermissionHandle(scope.row)"
            >添加权限功能</el-button>
            <el-button
              type="text"
              @click="editHandle(scope.row)"
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
      :title="dialogVisibleType == 'add' ? '新建' : '编辑'"
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
          <small class="tips">设置路由的 component 属性</small>
        </el-form-item>

        <el-form-item label="菜单路径">
          <el-input v-model="items.path" placeholder="请输入" />
          <small class="tips">设置路由的 path 属性</small>
        </el-form-item>

        <el-form-item v-if="isTop" label="菜单图标">
          <el-input v-model="items.icon" placeholder="请输入" />
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
          <el-switch
            v-model="items.affix"
            active-value="1"
            inactive-value="0"
          />
          <small
            class="tips"
          >如果设置，它则会固定在tags-view中(默认 不固定)</small>
        </el-form-item>

        <el-form-item label="面包屑">
          <el-switch
            v-model="items.breadcrumb"
            active-value="1"
            inactive-value="0"
          />
          <small
            class="tips"
          >如果设置，则不会在breadcrumb面包屑中显示(默认 显示)</small>
        </el-form-item>
        <el-form-item label="页面缓存">
          <el-switch
            v-model="items.noCache"
            active-value="1"
            inactive-value="0"
          />
          <small
            class="tips"
          >如果设置，则不会被 <mark>keep-alive</mark> 缓存(默认 缓存)</small>
        </el-form-item>
        <el-form-item label="忽略规则">
          <el-switch
            v-model="items.alwaysShow"
            active-value="1"
            inactive-value="0"
          />
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
  </div>
</template>

<script>
import { list, add, edit, del } from '@/api/menu'
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  name: 'Menus',
  directives: { permission },
  data() {
    return {
      rows: [],
      items: {},
      dialogVisible: false,
      isTop: true,
      isRedirect: true,
      dialogVisibleType: '',
      restaurants: []
    }
  },
  computed: {},
  mounted() {
    this.restaurants = this.loadFileNameAll()
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data } = await list()
      this.rows = data
    },
    addHandle() {
      this.isTop = true
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.items = {}
    },
    editHandle(row) {
      if (row.parent_id == 0) {
        this.isTop = true
      } else {
        this.isTop = false
      }
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
      this.items = {}
      this.items.parent_id = row.id
    },
    addPermissionHandle(row) {},

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
      files.keys().reduce((modules, modulePath) => {
        const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
        restaurants.push({ value: moduleName, address: 123 })
      }, {})
      return restaurants
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
