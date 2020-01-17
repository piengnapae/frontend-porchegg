<template>
  <el-container>
    <el-aside width="20%">Aside
    </el-aside>
    
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24">
            <div>
              <i class="el-icon-info"></i> Title Request
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div>
              <el-button type="text" class="el-icon-arrow-down text" @click="isShowing = !isShowing"> Request</el-button>
            </div>
          </el-col>
        </el-row>

        <div v-if="isShowing" class="box">

          <el-row>
            <el-col>
              <el-select v-model="method" style="width:10%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="url" style="padding-left: 10px; padding-right: 10px; width:65%"></el-input>
              <el-button type="warning" class="button" @click="sendRequest">SEND 
                <i class="el-icon-position"></i>
              </el-button>
              <el-button circle><i class="fas fa-save" style="padding: 2px 4px 2px 4px"></i></el-button>
              <el-button circle><i class="fas fa-cloud-download-alt" style="padding: 2px;"></i></el-button>
            </el-col>

          </el-row>

          <el-tabs v-model="activeTab" @tab-click="paramsTab">
            <el-tab-pane label="Parameters" name="params">Parameters</el-tab-pane>
            <el-tab-pane label="Authentication" name="authentication">Authentication</el-tab-pane>
            <el-tab-pane label="Headers" name="headers">Headers</el-tab-pane>
            <el-tab-pane label="Body" name="body">Body</el-tab-pane>
          </el-tabs>
          
        </div>

        <el-row>
          <el-col :span="24">
            <div>
              <el-button type="text" class="el-icon-arrow-down text" @click="isResponse = !isResponse"> Response</el-button>
            </div>
          </el-col>
        </el-row>

        <div v-if="isResponse" class="box">
          <el-form style="display: flex; justify-content: flex-end;">
            <el-form-item>
              <span class="demo-input-label" style="padding-right: 10px">Status </span>
            </el-form-item>
            <el-form-item>
              <el-input v-model="status" :disabled="true"></el-input>
            </el-form-item>
          </el-form>

          <el-tabs v-model="activeName" @tab-click="requestTab">
            <el-tab-pane label="Pretty" name="first">
              <div class="jsonStyle" v-html="pretty"></div>
              </el-tab-pane>
            <el-tab-pane label="Raw" name="second">{{raw}}</el-tab-pane>
            <el-tab-pane label="Preview" name="third">{{preview}}</el-tab-pane>
          </el-tabs>
        </div>

        
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
const prettyPrintJson = require('pretty-print-json');

  export default {
    components: {
    },
    data() {
      return {
        options: [{
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
          label: 'DEL'
        }],
        method: 'get',
        url: '',
        hideRequest: '',
        isShowing: true,
        isResponse: true,
        activeName: 'first',
        activeTab: 'params',
        pretty: '',
        raw: 'raw',
        preview: 'preview',
        status: '',
        statusText: '',
        paramsInput:'',
        

      }
    },

    methods: {
      sendRequest() {
        axios({
          method: this.method,
            url: this.url,
            header: {
              'Content-type':'application/json'
            },
            data: {               
              'username': 'view',
              'password': '1234566'
            }
        })
        .then(res => {
          const html = prettyPrintJson.toHtml(res.data);
          this.pretty = html
          this.status = res.status+" "+res.statusText
        }).catch(err => {
          console.log(err)
          const html = prettyPrintJson.toHtml(err.response.data);
          this.pretty = html
          this.status = err.response.status+" "+err.response.statusText
        })
        
      },

      requestTab(tab, event) {
        console.log(tab, event);
      },

      paramsTab(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Mitr&display=swap');
@import '../assets/styles/json.css';

body {
  font-family: 'Mitr', sans-serif;
  background-color: #eeeeee;
}

.button{
  background-color: #ffb526;
  color: white;
  border: 2px solid #ffb526
}

.button:hover {
  background-color: #f8e5bf;
  color: #ffb526;
  border: 2px solid #f8e5bf
}

.text {
  color: #303133;
  font-size: 16px
}

.text:hover {
  color: #303133
}

.circle{
  border-radius: 50%;
  padding: 20px;
}

.box {
  background-color: white; 
  padding: 20px;
  border: 2px solid #e5e5e5;
  white-space: pre;
}

.jsonStyle {
  font-family: Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif;
}

</style>
