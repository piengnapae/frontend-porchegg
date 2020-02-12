<template>  
  <div>
    <!-- {{test}}
    <el-button @click="testpage">Test Page</el-button> -->
    <div v-for="(collection, index) in collection" v-bind:key="index">
      <el-button type="text" @click="showFolder(collection.id)">{{collection.name}}</el-button>
      
      <el-tree :data="folder" v-if="folder != '' && collection.id == collection_id"></el-tree>
    </div>
  </div>

</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      server_api: "http://localhost:9000",
      folder :[],
      collection:[],
      collection_id: null
    }
  },
  created:function () {
    this.getCollection()
  },
  methods: {
    getFolder(id) {
      axios.get(this.server_api+'/collections/'+id+'/folder-view')
        .then(res => {
          this.folder = res.data.data
          this.collection_id = id
          console.log(this.folder)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCollection() {
      axios.get(this.server_api+'/collections')
        .then(res => {
          this.collection = res.data.data
          console.log(this.collection)
        })
        .catch(err => {
          console.log(err)
        })
    },
    showFolder(id) {
      this.test = id
      this.getFolder(id)
    },
    remove(id) {
        console.log(id)
      },
  }
}
</script>
