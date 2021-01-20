<template>
  <div class="container">
    <el-form :model="items" label-width="80px" label-position="right">
      <el-form-item label="真实姓名">
        <el-input v-model="items.realname" />
      </el-form-item>

      <el-form-item label="头像">
        <el-input v-model="items.avatar" />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="items.email" />
      </el-form-item>

      <el-form-item label="联系电话">
        <el-input v-model="items.phone" />
      </el-form-item>

      <el-form-item label="自我介绍">
        <el-input
          v-model="items.introduction"
          :autosize="{ minRows: 5, maxRows: 10 }"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getInfo } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  name: 'Profile',
  data() {
    return {
      items: {}
    }
  },
  computed: {
    ...mapGetters(['id'])
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const { data } = await getInfo(this.id)
      this.items = data
    }
  }
}
</script>
<style lang="scss" scoped></style>
