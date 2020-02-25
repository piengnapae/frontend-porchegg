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
            <el-button icon="el-icon-switch-button" circle></el-button>
          </el-col>
       </el-row>
    </el-header>
    <el-container>
      <!--- left sidebar --->
      <el-aside width="220px">
        <el-row>
          <el-col :span="24">
            <div>
              <i class="el-icon-info"></i> COLLECTIONS
            </div>
          </el-col>
        </el-row>
        <Collection></Collection>
        <Folder @requestId="clickFolder"></Folder>
      </el-aside>
      <!--- right sidebar --->
      <el-main>
        <!-- <el-button
          size="small"
          @click="addTab(editableTabsValue)"
        >
          ADD NEW TAB
        </el-button> -->
        <Tab :array="myArray" :tabsValue.sync="editableTabsValue" @remove="removeTab"></Tab>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import '@/assets/scss/main.scss';
import Tab from '../components/tabRequest';
import Collection from '../components/collection';
import Folder from '../components/folder';
import Request from '../components/request';
import axios from 'axios';
import {env} from '../nuxt.config';

  export default {

    components: {
      Tab,
      Folder,
      Collection,
      Request
    },

    data() {
      return {
        server_api: env.SERVER_API,
        myArray: [{
          title: 'New Tab',
          name: '1',
          content: 'New Tab content'
        }],
        tabIndex: 1,
        editableTabsValue: '1'
        }
    },
    
    methods: {
      clickFolder (id) {
        axios.get(this.server_api+'/V1/requests/'+id)
          .then(res => {
            let newTabName = ++this.tabIndex + ''
            this.myArray.push({
              title: res.data.name,
              name: newTabName,
              content: res.data
            });
            this.editableTabsValue = newTabName;
          })
          .catch(err => {
            console.log(err)
          })
      },

      addTab(targetName) {
        let newTabName = ++this.tabIndex + ''
        this.myArray.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName
      },

      removeTab(targetName) {
        let tabs = this.myArray
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
        this.myArray = tabs.filter(tab => tab.name !== targetName)
      },

      test(){
        this.$router.push('/test')
      }
    }
  }
</script>
