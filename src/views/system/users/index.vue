<template>
  <div class="container">
    <div class="filterBar">
      <div class="handle-block">
        <el-button
          v-permission="'ADD'"
          type="primary"
          size="mini"
          @click="addHandle"
        >新建</el-button>
      </div>
      <div class="search-block">
        <el-input
          v-model="listQuery.keyword"
          placeholder="请输入内容"
          size="mini"
        >
          <el-button slot="append" icon="el-icon-search" @click="search" />
        </el-input>
      </div>
      <div class="extend-block">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="exportHandle"
        >导出</el-button>
      </div>
    </div>
    <div class="tableArea">
      <el-table :data="rows" stripe size="mini">
        <el-table-column prop="realname" label="真实姓名" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" size="mini">正常</el-tag>
            <el-tag v-else size="mini">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="editHandle(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>

    <el-dialog
      width="600px"
      :visible.sync="dialogVisible"
      :title="dialogVisibleType == 'add' ? '新建' : '编辑'"
    >
      <el-form
        :model="items"
        label-width="80px"
        label-position="right"
        size="mini"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="items.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="items.password" />
        </el-form-item>

        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="items.realname" />
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <el-input v-model="items.avatar" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="items.email" />
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="items.phone" />
        </el-form-item>

        <el-form-item label="自我介绍">
          <el-input
            v-model="items.introduction"
            :autosize="{ minRows: 5, maxRows: 10 }"
            type="textarea"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="items.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="-1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="mini"
          type="danger"
          @click="dialogVisible = false"
        >取消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="commitHandle()"
        >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import { addUser, updateUser, getUsers } from '@/api/user'
import Pagination from '@/components/Pagination'
export default {
  name: 'User',
  filters: {},
  directives: { permission },
  components: { Pagination },
  props: {},
  data() {
    return {
      rows: [],
      items: {
        status: 0
      },
      dialogVisible: false,
      dialogVisibleType: '',
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    async getList() {
      const { data, total } = await getUsers(this.listQuery)
      this.rows = data
      this.total = total
    },
    search() {
      this.getList()
    },
    addHandle(row) {
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.items = {
        status: 0
      }
    },
    editHandle(row) {
      this.dialogVisible = true
      this.dialogVisibleType = 'edit'
      this.items = row
    },
    exportHandle() {},

    async commitHandle() {
      if (this.dialogVisibleType === 'add') {
        await addUser(this.items)
      } else {
        await updateUser(this.items)
      }
      this.dialogVisible = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
