<template>
  <div>
    <span  v-loading.fullscreen.lock="fullscreenLoading">
    </span>
  </div>
</template>

<script>
import { remote } from 'electron'

export default {
  components: {
  },
  data () {
    return {
      fullscreenLoading: true,
      externalContent: ''
    }
  },
  mounted() {
    this.fullscreenLoading = false
    this.$router.push('/login')
  },
  methods: {
    openURL (url) {
      remote.shell.openExternal(url)
    }
  }
}
</script>

<style>
.el-loading-spinner .path {
    stroke: #ffb526;
}
</style>
