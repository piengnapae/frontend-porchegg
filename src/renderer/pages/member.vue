<template>
  <el-row>
    <el-col :xs="0" :sm="5" width="100%" heigth="100%">
      <el-main>
        <el-row>
          <el-col :span="24">
            <div>
              <i class="el-icon-info"></i> COLLECTIONS
            </div>
          </el-col>
        </el-row>
        <Folder></Folder>
      </el-main>
    <!-- <el-tree :data="folders" @node-click="getData" class="box"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
    ></el-tree> -->

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
              <el-button type="text" class="text" @click="isShowing = !isShowing"><i class="el-icon-arrow-down"></i> Request</el-button>
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

          <el-tabs v-model="activeTab" @tab-click="paramsTab" class="tab">
            <el-tab-pane label="Parameters" name="params">
              <el-row>
                <el-col :span="24">
                  <div>
                    <el-button type="text" class="text" id="tabs" @click="isShowParameter = !isShowParameter"><i class="el-icon-arrow-down"></i> Parameters</el-button>
                  </div>
                </el-col>
              </el-row>

            <div v-if="isShowParameter" >            
              <div v-for="(input, indexParameter) in inputParameter" v-bind:key="indexParameter">
                <div style="margin: 15px;"></div>
                  <el-row :gutter="25"> 
                    <el-col :span="11">
                        <el-input v-model="input.keyParammeters" size="mini"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input v-model="input.valueParammeters" size="mini"></el-input>
                    </el-col>
                    <el-col :span="2" v-if="inputParameter.length > 1">
                      <el-button @click="deleteRowParam(indexParameter)" type="danger" size="mini" circle><i class="el-icon-delete"></i></el-button>
                    </el-col>
                  </el-row>
              </div>
    
                <center><el-button  type="text" @click="addRowParameter" ><i class="el-icon-plus"></i> Add New</el-button></center>

              </div>       
            </el-tab-pane>

          <el-tab-pane label="Authentication" name="authentication">
              
            <el-row>
              <el-col :span="24">
                <div>
                  <el-button type="text" class="text" id="tabs" @click="isShowAuth = !isShowAuth"><i class="el-icon-arrow-down"></i> Authentication</el-button>
                </div>
              </el-col>
             </el-row>
       
          <div v-if="isShowAuth" >
            <el-row :gutter="15">
              <el-col :span="4">
                <el-row>TYPE</el-row>
                  <el-select v-model="auth" size="mini">
                    <el-option 
                      v-for="auth in optionauth"
                      :key="auth.value"
                      :label="auth.label"
                      :value="auth.value">
                    </el-option>
                  </el-select>  
              </el-col>

            <el-col :xs="18" :sm="20">
              <el-row v-if="auth === 'Bearer Token'">
                <el-row>TOKEN</el-row>
                  <el-input v-model="token" size="mini"></el-input>                 
              </el-row>
            </el-col>

            <el-col  :sm="10">
              <el-row v-if="auth === 'Basic Auth'">
                <el-row>USERNAME</el-row>
                  <el-input v-model="username" size="mini"></el-input>
              </el-row>
            </el-col> 

            <el-col  :sm="10">
              <el-row v-if="auth === 'Basic Auth'">
                <el-row>PASSWORD</el-row>
                  <el-input  v-model="password" show-password size="mini"></el-input>
              </el-row>
            </el-col>            
            </el-row>
          </div>
          </el-tab-pane>
  
          <el-tab-pane label="Headers" name="headers">
            <el-row>
            <el-col :span="24">
              <div>
                <el-button type="text" class="text" id="tabs" @click="isShowHeader = !isShowHeader"><i class="el-icon-arrow-down"></i> Headers</el-button>
              </div>
            </el-col>
          </el-row>

            <div v-if="!isShowHeader" >  
              <div v-for="(head, indexHeader) in inputHeader" v-bind:key="indexHeader">
                <div style="margin: 15px;"></div>
                <el-row :gutter="25"> 
                  <el-col :span="11">
                    <el-input v-model="head.keyHeaders" size="mini"></el-input>
                  </el-col>
                  <el-col :span="11">
                    <el-input v-model="head.valueHeaders" size="mini"></el-input>
                  </el-col>
                  <el-col :span="2" v-if="inputHeader.length > 1">
                    <el-button @click="deleteRowsHeader(indexHeader)" size="mini" type="danger" circle><i class="el-icon-delete"></i></el-button>
                  </el-col>
                </el-row>
              </div>

              <div style="margin: 15px;"></div>
                <center><el-button class="font" type="text" @click="addRowsHeader"><i class="el-icon-plus"></i> Add New</el-button></center>
                    
            </div>    
          </el-tab-pane>

          <el-tab-pane label="Body" name="body">
            <el-row>
              <el-col :span="24">
                <div>
                  <el-button type="text" class="text" @click="isShowBody = !isShowBody"><i class="el-icon-arrow-down"></i> Body</el-button>
                </div>
              </el-col>
            </el-row>

              <div v-if="isShowBody" class="jsonStyle">  
                <AceEditor
                  v-model="textbody"
                  @init="editorInit"
                  lang="json"
                  theme="chrome"
                  height="150px"
                  :options="optionsbody"
                ></AceEditor>
              </div>       
            </el-tab-pane>
          </el-tabs>         
        </div>

        <el-row>
          <el-col :span="24">
            <div>
              <el-button type="text" class="text" @click="isResponse = !isResponse"><i class="el-icon-arrow-down"></i> Response</el-button>
            </div>
          </el-col>
        </el-row>

        <div v-if="isResponse" class="box">
          <el-form class="status-code" style="display: flex; justify-content: flex-end;">
            <el-form-item>
              <span class="demo-input-label" style="padding-right: 10px" >Status </span>
            </el-form-item>
            <el-form-item>
              <el-input v-model="status" :disabled="true" size="small"></el-input>
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
import Folder from '../components/collection'
  export default {
    
    components: {
      AceEditor,
      Folder
    },
    data() {
      return {
        server_api: "http://localhost:9000",
        inputParameter: [{"keyParammeters": "", "valueParammeters": ""}],
        inputHeader: [{"keyHeaders": "", "valueHeaders": ""}],
        content: '',
        textbody: '',
        optionsj: {
          readOnly: true,
          autoScrollEditorIntoView: true
        },
        optionsbody: {
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
        optionauth: [{
          value: 'No Auth',
          label: 'No Auth'
        }, {
          value: 'Bearer Token',
          label: 'Bearer Token'
        }, {
          value: 'Basic Auth',
          label: 'Basic Auth'
        }],
        auth: 'No Auth',
        method: 'get',
        url: '',
        token: '',
        username: '',
        password: '',
        isShowHeader: '',
        hideRequest: '',
        isShowing: true,
        isResponse: true,
        isShowAuth: true,
        isShowParameter: true,
        isShowBody: true,
        activeName: 'first',
        activeTab: 'params',
        pretty: '',
        raw: 'raw',
        preview: 'preview',
        status: '',
        statusText: '',
        paramsInput:'',
        folders :[],
      };
    },
     mounted(){
            this.getData();
      },

    methods: {
      editorInit: function(editor) {
        require('brace/mode/json')
        require('brace/theme/chrome')
      },
        getData() {
        axios.get(this.server_api+'/collections/1/folder-view')
        .then(res => {
          this.folders = res.data.data
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
      },
        
      sendRequest() {
        axios({
            method: this.method,
            url: this.url,
            headers: this.headerArray(),
            data: {
            }
        })
        .then(res => { 
          this.content = JSON.stringify(res.data, null, 4)
          this.status = res.status+" "+res.statusText
        }).catch(err => {
          console.log(err.response)
          this.content = JSON.stringify(err.response.data, null, 4)
          this.status = err.response.status+" "+err.response.statusText
          console.log(this.headerArray())
        })       
      },

      requestTab(tab, event) {
        console.log(tab, event);
      },

      paramsTab(tab, event) {
        console.log(tab, event);
      },
      addRowParameter() {
        this.inputParameter.push({
          keyParammeters: '',
          valuesParammeters: ''
        })
      },
      deleteRowParam(indexParameter) {
        this.inputParameter.splice(indexParameter,1)
      },
      addRowsHeader() {
        this.inputHeader.push({
          keyHeaders: '',
          valueHeaders: ''
        })
      },
      deleteRowsHeader(indexHeader) {
        this.inputHeader.splice(indexHeader,1)
      },
      convertToArray(input){
        let arr = {}
        input.forEach(header => {
          var key = header['keyHeaders']

          if(key == ""){
            return '{}'
          }

          arr[key] =  header['valueHeaders']
        })
        return arr
      },
      headerArray(){
        let headerData = {}
        let tokenAuth = {}

        headerData = this.convertToArray(this.inputHeader)
        if(this.token != ''){
          tokenAuth['authorization'] = 'Bearer '+this.token
        }
        
        let merged = {...headerData, ...tokenAuth};
        return merged
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
