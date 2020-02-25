<template>
  <div>
    <el-button @click="addCollectionDialog = true"><i class="el-icon-plus"></i> New Collection</el-button>

    <el-dialog title="Add Collection" :visible.sync="addCollectionDialog">
      <el-form :model="collection">
        <el-form-item label="Collection Name : " :label-width="formLabelWidth">
          <el-input v-model="collection.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addCollectionDialog = false">CANCEL</el-button>
        <el-button type="success" @click="addCollection('request')">SAVE</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import {env} from '../nuxt.config'

export default {
  data() {
    return {
      server_api: env.SERVER_API,
      addCollectionDialog: false,
      collection: {
        name: ''
      },
      formLabelWidth: '150px'
    }
  },

  methods: {
    addCollection(collection) {
      axios.post(this.server_api+'/collections', {
        name: this.collection.name
      })
      .then(res => {
       this.$message({
          message: 'Success Added Collection!!',
          type: 'success'
        })
      })
      .catch(err => {
        this.$message({
          message: 'Failed!!',
          type: 'error'
        })
        console.log(err)
      })

      this.addCollectionDialog = false
    }
  }
}
</script>
