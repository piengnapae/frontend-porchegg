<template>
  <el-container>
    <el-header height="50">
      <!--- Header ---->
       <el-row>
          <el-col :span="12">
            <nuxt-link class="credit-link" to="/credit">PorchEGG</nuxt-link>
          </el-col>
          <el-col :span="12" style="textAlign: right;">
            Hi, {{username}} 
            <el-button icon="el-icon-refresh" circle @click="fetching"></el-button>
            <el-button icon="el-icon-switch-button" circle  @click="logout"></el-button>          
          </el-col>
       </el-row>
    </el-header>
    <el-container>
      <!--- left sidebar --->
      <el-aside width="220px">
        <Folder @requestId="clickFolder"></Folder>
        
      </el-aside>
      <!--- right sidebar --->
      <el-main>
        <div style="float:right">
          <Environment></Environment>
        </div>
        <div>
        </div>
        <br><br>
        <div>
          <el-tabs v-model="editableTabsValue" type="card" editable  @edit="handleTabs" class="box">
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <Request :data="item.content" :key="item.hash" :targetName="item.name" @newRequest="clickFolder" @remove="removeTab"></Request>  
            </el-tab-pane>
          </el-tabs>
        </div>
        
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import '@/assets/scss/main.scss';
import Folder from '../components/folder';
import Request from '../components/request';
import axios from 'axios';
import Environment from '../components/environment'
import {env} from '../nuxt.config';

  export default {

    components: {
      Folder,
      Request,
      Environment,
    },

    data() {
      return {
        server_api: env.SERVER_API,
        editableTabs: [{
          title: 'New Tab',
          name: '1',
          content: '',
          id_request: 0,
          hash: null,
        }],
        tabIndex: 1,
        editableTabsValue: '1',
        dialog: null,
        envURL: '',
        username: sessionStorage.getItem('username')
        }
    },
    
    methods: {
      clickFolder (id) {
        this.openMessageLoading()
        let arrId = []
      },
      handleTabs(targetName, action) {
        if(action === 'remove'){
          this.removeTab(targetName)
        }else{
          this.addTab(targetName)  
      } 
      
      },

      fetching () {
        this.editableTabs.forEach((value, index) => {
          var id = value['id_request']
          var name = value['name']

          if(value['id_request'] != 0){
            axios.get(this.server_api+'/V1/requests/'+ id)
            .then(res => {
              const temp = {
                title : res.data.name,
                name : name,
                content: res.data,
                id_request: res.data.id,
                hash: res.data.hash
              }
              this.$set(this.editableTabs, index, temp)
            })
          }
        })
      },

      clickFolder (id) {
        this.openMessageLoading()
        const index = this.editableTabs.findIndex(arr => arr.id_request === id)

        if(index < 0){
          axios.get(this.server_api+'/V1/requests/'+id)
          .then(res => {
            let newTabName = ++this.tabIndex + ''
            this.editableTabs.push({
              title: res.data.name,
              name: newTabName,
              content: res.data,
              id_request: id,
              hash: res.data.hash
            })
            this.editableTabsValue = newTabName
            this.closeMessageLoading()
          })
          .catch(err => {
            console.log(err)
          })
        }else{
          this.editableTabsValue = this.editableTabs[index].name
          this.closeMessageLoading()
        }
      },

      addTab(targetName) {
        let newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content',
          id_request: 0,
          hash: null
        });
        this.editableTabsValue = newTabName
      },

      removeTab(targetName) {
        let tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        
        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      },

      test(){
        this.$router.push('/test')
      },

      openMessageLoading(){
        this.dialog = this.$message({
          message: 'Loading...',
          duration: 0,
        });
      },
      
      closeMessageLoading(){
        this.dialog.close()
      },
      logout(){
        sessionStorage.clear()
        this.$router.push('/login') 
      }
    }
  }
</script>
