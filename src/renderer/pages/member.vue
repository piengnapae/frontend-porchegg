<template>
  <el-container>
    <el-header height="50">
      <!--- Header ---->
       <el-row>
          <el-col :span="12">
            PorchEGG
          </el-col>
          <el-col :span="12" style="textAlign: right;">
            Hi, Administrator ทดสอบผู้ใช้ระบบ 
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
      <!-- {{editableTabs}} -->
      <el-main>
        <div style="float:right">
          <Environment></Environment>
        </div>
        <br><br>
        <div>
          <Tab :data="editableTabs" :tabsValue="editableTabsValue" @newTab="addTab" @remove="removeTab" @addRequest="clickFolder"></Tab>
        </div>
        
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import '@/assets/scss/main.scss';
import Tab from '../components/tabRequest';
import Folder from '../components/folder';
import Request from '../components/request';
import axios from 'axios';
import Environment from '../components/environment'
import {env} from '../nuxt.config';

  export default {

    components: {
      Tab,
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
          id_request: null
        }],
        tabIndex: 1,
        editableTabsValue: '1',
        dialog: null,
        }
    },
    
    methods: {
      fetching () {
        console.log("loading...")
        this.editableTabs.forEach((value, index) => {
          var id = value['id_request']
          var name = value['name']

          if(value['id_request'] != null){
            axios.get(this.server_api+'/V1/requests/'+ id)
            .then(res => {
              this.editableTabs[index] = {
                title : res.data.name,
                name : name,
                content: res.data,
                id_request: res.data.id
              }

              console.log(res.data)
            })
          }
        })
      },

      clickFolder (id) {
        this.openMessageLoading()
        let arrId = []

        this.editableTabs.forEach(tab => {
          arrId.push(tab['id_request'])
        })

        if(!arrId.includes(id)){
          axios.get(this.server_api+'/V1/requests/'+id)
          .then(res => {
            let newTabName = ++this.tabIndex + ''
            this.editableTabs.push({
              title: res.data.name,
              name: newTabName,
              content: res.data,
              id_request: id
            })
            this.editableTabsValue = newTabName
            this.closeMessageLoading()
          })
          .catch(err => {
            console.log(err)
          })
        }else{
          this.closeMessageLoading()
        }
      },

      addTab(targetName) {
        let newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content',
          id_request: null
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
      this.$router.push('/login') 
      }
    }
  }
</script>
