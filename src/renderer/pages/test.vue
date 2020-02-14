<template>
  <div class="custom-tree-container">
  <div class="block">
    <p>Using scoped slot</p>
    <el-button @click="test">test</el-button>
    <Folder></Folder>
    <hr>
    <el-tree
      :data="collection"
      node-key="id">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><i class="el-icon-edit"></i> Rename</el-dropdown-item>
              <el-dropdown-item><i class="el-icon-circle-plus-outline"></i> Add Request</el-dropdown-item>
              <el-dropdown-item><i class="el-icon-folder"></i> Add Folder</el-dropdown-item>
              <el-dropdown-item><i class="el-icon-delete"></i> Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </span>
    </el-tree>
    <hr>
    <el-tree
      :data="folder"
      node-key="id">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span><i class="fas fa-folder" v-if="data.type == 'folder'"></i> {{ node.label }}</span>
        <span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><i class="fas fa-edit"></i> Rename</el-dropdown-item>
              <el-dropdown-item v-if="data.type != 'request'"><i class="fas fa-plus-circle"></i> Add Request</el-dropdown-item>
              <el-dropdown-item v-if="data.type != 'request'"><i class="fas fa-folder-plus"></i> Add Folder</el-dropdown-item>
              <el-dropdown-item><i class="fas fa-trash-alt"></i> Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </span>
    </el-tree>
  </div>
</div>
</template>
<script>
import axios from 'axios';
import Folder from '../components/collection';

  let id = 1000;

  export default {
     components: {
      Folder
    },

    data() {
      return {
        folder:[],
        collection:[]
      }
    },

    created:function () {
      this.getFolder()
      this.getCollection()
    },

    methods: {
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      getFolder() {
        axios.get('http://localhost:9000/collections/1/folder-view')
          .then(res => {
            this.folder = res.data.data
            console.log(this.folder)
          })
          .catch(err => {
            console.log(err)
          })
      },

      getCollection() {
        axios.get('http://localhost:9000/collections')
          .then(res => {
            this.collection = res.data.data
            console.log(this.collection)
          })
          .catch(err => {
            console.log(err)
          })
      },

      test(){
        this.$router.push('/member')
      }
    }
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
