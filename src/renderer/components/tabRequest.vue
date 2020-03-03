<template>
  <div>
    <!-- {{array}} -->
    <el-tabs v-model="tabsValue" type="card" editable  @edit="handleTabs" class="box">
      <el-tab-pane
        v-for="(item) in data"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <Request :data="item.content" :targetName="item.name" @newRequest="addRequest" @remove="removeTab"></Request>  
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
    },

    addRequest(id) {
      this.$emit('addRequest', id)
    },

    handleTabs(targetName, action) {
      if(action === 'remove'){
        this.removeTab(targetName)
      }else{
        this.$emit('newTab', targetName)
      }
    }
  }
}
</script>
