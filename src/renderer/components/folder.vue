<template>  
  <div v-loading="loading" style="min-height: 400px">
    <div v-for="(collection, index) in collection" v-bind:key="index">
      <table style="width:100%">
        <tr>
          <td width="90%">
            <el-button type="text" @click="collectionBt(collection.id)">{{ collection.name }}</el-button>
          </td>
          <td width="10%" align="center">
            <span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button type="text"><i class="fas fa-edit"></i> Rename </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text"><i class="fas fa-folder-plus"></i> Add Folder </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text"><i class="fas fa-file-export"></i> Export </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text"><i class="fas fa-trash-alt"></i> Delete </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </td>
        </tr>
      </table>
      <el-tree
        :data="folder"
        node-key="id"
        v-if="folder != '' && collection.id == collection_id"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">

        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.type == 'folder'"><i class="fas fa-folder"></i> {{ node.label }}</span>
          <span v-else @click="openTabRequest(data.request_id)">{{ node.label }}</span>
          <span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="text"><i class="fas fa-edit"></i> Rename </el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="data.type != 'request'">
                  <el-button type="text" @click="formRequest(data.folder_id)" >
                    <i class="fas fa-plus-circle"></i> Add Request 
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="data.type != 'request'">
                  <el-button type="text"><i class="fas fa-folder-plus"></i> Add Folder </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="text"><i class="fas fa-trash-alt"></i> Delete </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>

      <el-dialog title="Add Request" :visible.sync="addRequestDialog">
        <el-form :model="request">
          <el-form-item label="Folder ID : " :label-width="formLabelWidth" hidden>
            <el-input v-model="request.id" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="Request Name : " :label-width="formLabelWidth">
            <el-input v-model="request.name" autocomplete="off"></el-input>
          </el-form-item>
          
          <el-form-item label="Method : " :label-width="formLabelWidth">
            <el-select v-model="request.method" style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="URL : " :label-width="formLabelWidth">
            <el-input v-model="request.url" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="addRequestDialog = false">CANCLE</el-button>
          <el-button type="success" @click="addRequest('request')">SAVE</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {env} from '../nuxt.config'

export default {

  data() {
    return {
      server_api: env.SERVER_API,
      folder :[],
      collection:[],
      collection_id: null,
      addRequestDialog: false,
      request: {
        id: '',
        name: '',
        method:'get',
        url:''
      },
      formLabelWidth: '150px',
      loading: false,
      collectionLoading: false,
      options: [
        {
          value: 'get',
          label: 'GET'
        }, {
          value: 'post',
          label: 'POST'
        }, {
          value: 'put',
          label: 'PUT'
        }, {
          value: 'delete',
          label: 'DELETE'
        }
      ],
    }
  },

  created:function () {
    this.getCollection()
  },

  updated: function () {
    // this.getCollection()
  },
  methods: {
    getFolder(id) {
      this.loading = true
      axios.get(this.server_api+'/V1/collections/'+id+'/folder-view')
        .then(res => {
          this.folder = res.data.data
          this.collection_id = id
          this.loading = false
        })
        .catch(err => {
          this.$message({
          message: 'Folder Failed',
          type: 'error'
        })
          // this.loading = false
          console.log(err)
        })
    },

    getCollection() {
      this.loading = true
      axios.get(this.server_api+'/V1/collections')
        .then(res => {
          this.collection = res.data.data
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    showFolder(id) {
      this.test = id
      this.getFolder(id)
    },

    testpage() {
      this.$router.push('/test')
    },

    formRequest(id){
      this.request.id = id
      this.addRequestDialog = true
    },

    collectionBt(id) {
      this.showFolder(id)
    },

    addRequest(request) {
      axios.post(this.server_api+'/V1/requests', {
        id_folder: 1,
        name: this.request.name,
        method: this.request.method,
        url: this.request.url
      })
      .then(res => {
       this.$message({
          message: 'Success!!',
          type: 'success'
        })
        console.log(res.data.data)
      })
      .catch(err => {
        this.$message({
          message: 'Failed!!',
          type: 'error'
        })
        console.log(err)
      })

      this.addRequestDialog = false
      this.request.id = ''
      this.request.name = ''
      this.request.method = 'get'
      this.request.url = ''
    },

    openTabRequest(id){
      this.$emit('requestId', id)
    },

    remove(id) {
      console.log(id)
    },

    handleDragStart(node, ev) {
      console.log('drag start', node);
    },

    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label);
    },

    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label);
    },

    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label);
    },

    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },

    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
    },

    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === 'Level two 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },

    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('Level three 3-1-1') === -1;
    }
  }
}
</script>
