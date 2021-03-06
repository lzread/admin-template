<template>
  <div class="container">
    <div class="filterBar">
      <div class="handle-block">
        <el-button
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
      <el-table v-loading="loading" :data="rows" stripe size="mini">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="release_time" label="发布时间" />
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
            <el-button
              type="text"
              size="mini"
              @click="delHandle(scope.$index, scope.row)"
            >删除</el-button>
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
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="items.title" />
        </el-form-item>
        <el-form-item label="日期" prop="content">
          <el-date-picker
            v-model="items.release_time"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>

        <el-form-item label="封面">
          <el-upload
            class="image-uploader"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="imagePath" class="image" :src="imagePath">
            <i v-else class="el-icon-plus image-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            v-model="items.content"
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
import { list, add, edit, del } from '@/api/notice'
import Pagination from '@/components/Pagination'
export default {
  name: 'Notice',
  filters: {},
  directives: {},
  components: { Pagination },
  props: {},
  data() {
    return {
      rows: [],
      items: {
        status: 0
      },
      loading: true,
      dialogVisible: false,
      dialogVisibleType: '',
      uploadPath: process.env.VUE_APP_BASE_API + '/uploadFile',
      imagePath: '',
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
      const { data, total } = await list(this.listQuery)
      this.rows = data
      this.total = total
      setTimeout(() => {
        this.loading = false
      }, 1500)
    },
    search() {
      this.getList()
    },
    addHandle(row) {
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.imagePath = ''
      this.items = {
        status: 0
      }
    },
    editHandle(row) {
      this.dialogVisible = true
      this.dialogVisibleType = 'edit'
      this.items = row
      this.imagePath = process.env.VUE_APP_UPLOAD_FILE_URL + row.image
    },
    delHandle(index, row) {
      this.$confirm('是否删除当前数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.rows.splice(index, 1)
        await del(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },

    handleImageSuccess(res, file) {
      if (res.code === '200') {
        this.imagePath = URL.createObjectURL(file.raw)
        this.items.image = res.url
      } else {
        this.$message.error('上传失败，请重试')
      }
    },
    beforeImageUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isLt2M
    },

    exportHandle() {},

    async commitHandle() {
      if (this.dialogVisibleType === 'add') {
        await add(this.items)
      } else {
        await edit(this.items)
      }
      this.dialogVisible = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.image-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image-uploader .el-upload:hover {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.image {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
