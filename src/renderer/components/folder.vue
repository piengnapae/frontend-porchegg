<template>
  <div>
    <br>
    <el-button @click="addCollectionDialog = true"><i class="el-icon-plus"></i> New Collection</el-button>

    <el-dialog title="Add Collection" :visible.sync="addCollectionDialog">
      <el-form :model="collection">
        <el-form-item label="Collection Name : " :label-width="formLabelWidth">
          <el-input v-model="collection.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addCollectionDialog = false">CANCEL</el-button>
        <el-button type="success" @click="addCollection('request')">SAVE</el-button>
      </span>
    </el-dialog>

    <div v-loading="loading" style="min-height: 400px">
      <div v-for="(collection, index) in collections" v-bind:key="index">
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
                      <el-button type="text" @click="renameCollection(collection.id, collection.name)">
                        <i class="fas fa-edit"></i> Rename 
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="text" @click="formFolder(collection.id)">
                        <i class="fas fa-folder-plus"></i> Add Folder 
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="text" @click="exportJson(collection.id)"><i class="fas fa-file-export"></i> Export </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="text" @click="removeCollection(collection)">
                        <i class="fas fa-trash-alt"></i> Delete
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </td>
          </tr>
        </table>
        <el-tree
          :data="folders"
          node-key="id"
          v-if="folders != '' && collection.id == collection_id"
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
                    <el-button type="text" @click="formRequest(data.folder_id, null)" >
                      <i class="fas fa-plus-circle"></i> Add Request 
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="data.type != 'request'">
                    <el-button type="text" @click="formFolder(collection.id, data.folder_id)">
                      <i class="fas fa-folder-plus"></i> Add Folder 
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button v-if="data.type == 'folder'" type="text" @click="remove(node, data)">
                      <i class="fas fa-trash-alt"></i> Delete
                    </el-button>
                    <el-button v-else type="text" @click="remove(node, data)">
                      <i class="fas fa-trash-alt"></i> Delete
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        </el-tree>

        <el-dialog title="Add Request" :visible.sync="addRequestDialog">
          <el-form :model="request">
            <el-form-item label="Folder ID : " :label-width="formLabelWidth" hidden>
              <el-input v-model="request.id_folder" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="Request Name : " :label-width="formLabelWidth">
              <el-input v-model="request.name" autocomplete="off" required></el-input>
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
              <el-input v-model="request.url" autocomplete="off" required></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="addRequestDialog = false">CANCLE</el-button>
            <el-button type="success" @click="addRequest()">SAVE</el-button>
          </span>
        </el-dialog>

        <!-- dialog folder -->

        <el-dialog title="Add Folder" :visible.sync="addFolderDialog">
          <el-form :model="folder">
            <el-form-item label="Collection ID : " :label-width="formLabelWidth" hidden>
              <el-input v-model="folder.id_collection" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="Parent ID : " :label-width="formLabelWidth" hidden>
              <el-input v-model="folder.parent_id" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="Folder Name : " :label-width="formLabelWidth">
              <el-input v-model="folder.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="addFolderDialog = false">CANCLE</el-button>
            <el-button type="success" @click="addFolder()">SAVE</el-button>
          </span>
        </el-dialog>

        <!-- dialog rename collection -->

          <el-dialog title="Rename Collection" :visible.sync="renameCollectionDialog">
          <el-form :model="folder">
            <el-form-item label="Collection ID : " :label-width="formLabelWidth" hidden>
              <el-input v-model="collection_id" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="Name : " :label-width="formLabelWidth">
              <el-input v-model="name_collection" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="renameCollectionDialog = false">CANCLE</el-button>
            <el-button type="success" @click="updateCollection">SAVE</el-button>
          </span>
        </el-dialog>
      </div>
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
      addCollectionDialog: false,
      collection: {
        name: ''
      },
      formLabelWidth: '150px',
      folders :[],
      collections:[],
      collection_id: null,
      addRequestDialog: false,
      addFolderDialog: false,
      renameCollectionDialog: false,
      name_collection: '',
      request: {
        id_folder: '',
        name: '',
        method:'get',
        url:''
      },
      folder: {
        id_collection: '',
        name: '',
        parent_id: null
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
      ]
    }
  },

  created:function () {
    this.getCollection()
  },

  beforeUpdate: function () {
    if(this.addFolderDialog == false){
      this.folder.name = ''
    }

    if(this.addRequestDialog == false){
      this.request.name = ''
      this.request.url = ''
    }

    if(this.renameCollection == false){
      this.name_collection = ''
    }

    if(this.addCollectionDialog == false){
      this.collection.name = ''
    }
  },
  methods: {
    exportJson(id) {
      axios.post(this.server_api+'/V1/export',{
        id_collection: id
      })
      .then(res => {    
        let text = JSON.stringify(res.data)
        let blob = new Blob([text], {
          type: "text/json",
        })
        let anchor = document.createElement("a")
        anchor.download = res.data.info.name + ".json"
        anchor.href = window.URL.createObjectURL(blob)
        anchor.target = "_blank"
        anchor.style.display = "none"
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)

        this.$message({
          message: 'Export Collection: ' + res.data.info.name + ' success!',
          type: 'success'
        })
      })
      .catch(err => {
        console.log(err.response.data.errors.errors)
        this.$message({
          message: err.response.data.errors.errors,
          type: 'error'
        })
      })
    },

    addCollection(collection) {
      axios.post(this.server_api+'/V1/collections', {
        name: this.collection.name
      })
      .then(res => {
        this.getCollection()
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
      this.collection.name = ''
    },

    getFolder(id) {
      this.loading = true
      axios.get(this.server_api+'/V1/collections/'+id+'/folder-view')
        .then(res => {
          this.folders = res.data.data
          this.collection_id = id
          this.loading = false
        })
        .catch(err => {
          this.$message({
          message: 'Folder Failed',
          type: 'error'
        })
          this.loading = false
          console.log(err)
        })
    },

    renameCollection(id, name) {
      this.renameCollectionDialog = true
      this.collection_id = id
      this.name_collection = name
    },

    updateCollection() {
      axios.put(this.server_api+'/V1/collections/' + this.collection_id, {
        name: this.name_collection
      })
      .then(res => {
        this.getCollection()
        this.$message({
          message: 'Rename Success!',
          type: 'success'
        })
      })
      .catch(err => {
        this.$message({
          message: "Can't rename collection, please try again!",
          type: 'error'
        })
        console.log(err)
      })

      this.renameCollectionDialog = false
      this.collection_id = null
      this.name_collection = ''
    },

    getCollection() {
      axios.get(this.server_api+'/V1/collections')
        .then(res => {
          this.collections = res.data.data
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
      this.request.id_folder = id
      this.addRequestDialog = true
    },

    collectionBt(id) {
      this.loading = true
      this.showFolder(id)
    },

    formFolder(collection, parent){
      this.folder.id_collection = collection
      this.folder.parent_id = parent
      this.addFolderDialog = true
    },

    addFolder() {
      axios.post(this.server_api+'/V1/folders', {
        id_collection: this.folder.id_collection,
        name: this.folder.name,
        parent_id: this.folder.parent_id
      })
      .then(res => {
        this.getFolder(res.data.data.id_collection)
        this.$message({
          message: 'Added New Folder',
          type: 'success'
        })
      })
      .catch(err => {
        this.$message({
          message: "Can't add the new folder, please try again!",
          type: 'error'
        })
        console.log(err)
      })

      this.addFolderDialog = false
      this.folder.id_collection = ''
      this.folder.name = ''
      this.folder.parent_id = null
    },

    addRequest() {
      axios.post(this.server_api+'/V1/requests', {
        id_folder: this.request.id_folder,
        name: this.request.name,
        method: this.request.method,
        url: this.request.url,
        id_user: sessionStorage.getItem('id_user')
      })
      .then(res => {
        this.getFolder(res.data.id_folder)
        this.$message({
          message: 'Added New Request',
          type: 'success'
        })
      })
      .catch(err => {
        this.$message({
          message: 'Can\'t add the new request, please try again!',
          type: 'error'
        })
        console.log(err.response)
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

    removeCollection(data){
      this.$confirm('Do you want to delete Collection: ' + data.name +'?', 'Delete Collection', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          axios.delete(this.server_api+'/V1/collections/' + data.id)
            .then(res => {
              this.getCollection()
              this.$message({
                type: 'success',
                message: 'Delete completed'
              })
            })
            .catch(err => {
              this.$message({
                message: "Can't Delete, please try again!",
                type: 'error'
              })
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          })
        })
    },

    remove(node, data) {
      const id = data.folder_id || data.request_id
      this.$confirm('Do you want to delete ' + data.type + ': ' + data.label +'?', 'Delete '+ data.type, {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          axios.delete(this.server_api+'/V1/' + data.type + 's/' + id)
            .then(res => {
              const parent = node.parent
              const children = parent.data.children || parent.data
              const index = children.findIndex(d => d.folder_id === id || d.request_id === id)
              
              children.splice(index, 1)

              this.$message({
                type: 'success',
                message: 'Delete completed'
              })
            })
            .catch(err => {
              this.$message({
                message: "Can't Delete, please try again!",
                type: 'error'
              })
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          })
        })
    },

    handleDragStart(node, ev) {
      console.log('drag start', node)
    },

    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },

    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },

    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },

    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },

    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('Node : ' +JSON.stringify(this.folders))
      console.log('tree drop: ', dropNode.label, dropType)
    },

    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === 'Level two 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },

    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('Level three 3-1-1') === -1
    }
  }
}
</script>
