<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 60= navbar  60  */
  min-height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  background: #f6f8f9 !important;
}

.fixed-header + .app-main {
  padding-top: 80px;
}

.hasTagsView {
  .app-main {
    /* 110 = navbar + tags-view = 60 + 50 */
    min-height: calc(100vh - 110px);
  }

  .fixed-header + .app-main {
    padding-top: 130px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
