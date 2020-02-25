<template>
  <div>
    <!-- {{array}} -->
    <el-tabs v-model="tabs" type="card" closable @tab-remove="removeTab" class="box">
      <el-tab-pane
        v-for="(item) in data"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <!-- {{item.content}} -->
        
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
    'data',
    'tabsValue'
  ],

  components: {
    Request
  },

  data () {
    return {
      tabs: this.tabsValue,
    }
  },
  
  methods: {
    removeTab(targetName) {
      this.$emit('remove', targetName)
    }
  }
}
</script>
