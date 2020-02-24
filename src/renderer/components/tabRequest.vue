<template>
  <div>
    <!-- {{array}} -->

    <el-tabs v-model="tabs" type="card" closable @tab-remove="removeTab" class="box">
      <el-tab-pane
        v-for="(item, index) in array"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <!-- {{item.content}} -->
        {{index}}
        
        <Request :data="item.content"></Request>  
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Request from '../components/request';
import axios from 'axios';
import {env} from '../nuxt.config';

export default {

  props: [
    'array',
    'tabsValue'
  ],

  data () {
    return {
      tabs: this.tabsValue
    }
  },

  components: {
    Request
  },

  updated: function () {
    this.tabUpdate()
  },

  methods: {
    removeTab(targetName) {
      this.$emit('remove', targetName)
    },

    tabUpdate() {
      this.tabs = this.tabsValue
    }
  }
}
</script>
