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
        <el-table-column prop="department_name" label="部门名称" />

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editHandle(scope.row)"
            >编辑</el-button>

            <el-button
              type="text"
              @click="addChildrenHandle(scope.row)"
            >添加下级部门</el-button>

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
      :title="dialogVisibleType == 'add' ? '新建部门' : '编辑部门'"
    >
      <el-form
        ref="department"
        :model="items"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="部门名称">
          <el-input v-model="items.department_name" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="父级部门">
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
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="danger" @click="reset('department')">取消</el-button>
        <el-button type="primary" @click="commitHandle()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 下拉树形选择框 https://github.com/riophae/vue-treeselect
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { list, add, edit, del } from '@/api/department'
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  name: 'Department',
  components: { Treeselect },
  directives: { permission },
  data() {
    return {
      rows: [],
      items: {},
      dialogVisible: false,
      dialogVisibleType: ''
    }
  },
  computed: {
    treeSelectData() {
      return [
        {
          id: 0,
          parent_id: -1,
          department_name: '根节点',
          children: this.rows
        }
      ]
    }
  },
  watch: {},
  mounted() {},
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
        label: node.department_name,
        isDisabled: disabled,
        children: node.children
      }
    },
    async getList() {
      const { data } = await list()
      this.rows = data
    },
    addHandle() {
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.items = {}
    },
    addChildrenHandle(row) {
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.items = {}
      this.items.parent_id = row.id
    },
    editHandle(row) {
      this.getList()
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
