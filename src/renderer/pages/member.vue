<template>
  <el-row>
    <el-col :xs="0" :sm="5">
    Aside
    </el-col>
    
    <el-col :xs="24" :sm="19">
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

          <el-row :gutter="15">
            <el-col :span="4">
              <el-select v-model="method" style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                   >
                </el-option>
              </el-select>
            </el-col>
            <el-col :xs="11" :sm="12">
              <el-input v-model="url"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="warning" style="width:100%;" class="button" @click="sendRequest">SEND 
                <i class="el-icon-position"></i>
              </el-button>
            </el-col>
            <el-col :xs="5" :sm="4" style="text-align:right;">
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
          <el-form class="status-code" style="display: flex; justify-content: flex-end;">
            <el-form-item>
              <span class="demo-input-label" style="padding-right: 10px">Status </span>
            </el-form-item>
            <el-form-item>
              <el-input v-model="status" :disabled="true"></el-input>
            </el-form-item>
          </el-form>

          <el-tabs v-model="activeName" @tab-click="requestTab">
            <el-tab-pane label="Pretty" name="first">
                <AceEditor
                  v-model="content"
                  @init="editorInit"
                  lang="json"
                  theme="chrome"
                  height="500px"
                  :options="optionsj"
                ></AceEditor>
              </el-tab-pane>
            <el-tab-pane label="Raw" name="second">{{raw}}</el-tab-pane>
            <el-tab-pane label="Preview" name="third">{{preview}}</el-tab-pane>
          </el-tabs>
        </div>

        
      </el-main>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import AceEditor from "vue2-ace-editor";
import '@/assets/scss/main.scss';

  export default {
    components: {
      AceEditor
    },
    data() {
      return {
        content: '',
        optionsj: {
          readOnly: true,
          autoScrollEditorIntoView: true
        },
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
        paramsInput:''
      }
    },

    methods: {
      editorInit: function(editor) {
        require('brace/mode/json')
        require('brace/theme/chrome')
        //console.log(editor);
      },
      sendRequest() {
        axios({
          method: this.method,
            url: this.url,
            header: {
              'Content-type':'application/json'
            },
            data: {               
              'username': 'view',
              'password': '123456'
            }
        })
        .then(res => {
          this.content = JSON.stringify(res.data, null, 4)
          this.status = res.status+" "+res.statusText
        }).catch(err => {
          console.log(err)
          this.content = JSON.stringify(err.response.data, null, 4)
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
