<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div>
          <i class="el-icon-info"></i> {{request.name}}
        </div>
      </el-col>
    </el-row>

    <el-row>
      <!--- content --->
      <el-col :span="24">
        <div>
          <el-button type="text" class="text" @click="isShowing = !isShowing">
            <i class="el-icon-arrow-down"></i> Request
          </el-button>
        </div>
      </el-col>
    </el-row>

    <div v-if="isShowing" class="box">
      <el-row :gutter="15">
        <el-col :span="4">
          <el-select v-model="request.method" style="width:100%">
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
          <el-input v-model="request.url"></el-input>
        </el-col>
        
        <el-col :span="4">
          <el-button type="warning" style="width:100%;" class="button" @click="send">SEND 
            <i class="el-icon-position"></i>
          </el-button>
        </el-col>
        
        <el-col :xs="5" :sm="4" style="text-align:right;">
          <el-button @click="save(data.id)" :label-position="labelPosition" circle>
            <i class="fas fa-save" style="padding: 2px 4px 2px 4px"></i>
          </el-button> 
          <el-button circle><i class="fas fa-cloud-download-alt" style="padding: 2px;"></i></el-button>
        </el-col>
      </el-row>

      <el-tabs v-model="activeTab" @tab-click="paramsTab" class="tab">
        <el-tab-pane label="Parameters" name="params">
          <el-row>
            <el-col :span="24">
              <div>
                <el-button type="text" class="text" id="tabs" @click="isShowParameter = !isShowParameter">
                  <i class="el-icon-arrow-down"></i> Parameters
                </el-button>
              </div>
            </el-col>
          </el-row>

          <div v-if="isShowParameter" >            
            <div v-for="(input, indexParameter) in inputParameter" v-bind:key="indexParameter">
              <div style="margin: 15px;"></div>
              <el-row :gutter="25"> 
                <el-col :span="11">
                  <el-input v-model="input.keyParams" size="mini"></el-input>
                </el-col>

                <el-col :span="11">
                  <el-input v-model="input.valueParams" size="mini"></el-input>
                </el-col>

                <el-col :span="2" v-if="inputParameter.length > 1">
                  <el-button @click="deleteRowParam(indexParameter)" type="danger" size="mini" circle>
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-col>
              </el-row>
            </div>
      
            <center>
              <el-button  type="text" @click="addRowParameter" >
                <i class="el-icon-plus"></i> Add New
              </el-button>
            </center>

          </div>       
        </el-tab-pane>

        <el-tab-pane label="Authentication" name="authentication">
          <el-row>
            <el-col :span="24">
              <div>
                <el-button type="text" class="text" id="tabs" @click="isShowAuth = !isShowAuth">
                  <i class="el-icon-arrow-down"></i> Authentication
                </el-button>
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
                <el-button type="text" class="text" id="tabs" @click="isShowHeader = !isShowHeader">
                  <i class="el-icon-arrow-down"></i> Headers
                </el-button>
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
                  <el-button @click="deleteRowsHeader(indexHeader)" size="mini" type="danger" circle>
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-col>
              </el-row>
            </div>

            <div style="margin: 15px;"></div>
            <center>
              <el-button class="font" type="text" @click="addRowsHeader">
                <i class="el-icon-plus"></i> Add New
              </el-button>
            </center>
          </div>    
        </el-tab-pane>

        <el-tab-pane label="Body" name="body">
          <el-row>
            <el-col :span="24">
              <div>
                <el-button type="text" class="text" @click="isShowBody = !isShowBody">
                  <i class="el-icon-arrow-down"></i> Body
                </el-button>
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
          <el-button type="text" class="text" @click="isResponse = !isResponse">
            <i class="el-icon-arrow-down"></i> Response
          </el-button>
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
        <el-tab-pane label="Pretty" name="first" v-if="loading">
          <AceEditor
            v-model="content"
            @init="editorInit"
            lang="json"
            theme="chrome"
            height="500px"
            :options="optionsj"
            v-loading="loading"
          ></AceEditor>
        </el-tab-pane>

        <el-tab-pane label="Pretty" name="first" v-else>
          <AceEditor
            v-model="content"
            @init="editorInit"
            lang="json"
            theme="chrome"
            height="500px"
            :options="optionsj"
          ></AceEditor>
        </el-tab-pane>

        <el-tab-pane label="Raw" name="second">{{raw}}<br>......<br> {{params}} </el-tab-pane>
        <el-tab-pane label="Preview" name="third">{{preview}}</el-tab-pane>
      </el-tabs>
    </div>

    <!-- Dialog Save As request -->

    <el-dialog title="Save As Request" :visible.sync="addRequestDialog">
      <el-form :model="request" label-width="120px">
        <el-form-item label="Request Name : ">
          <el-input v-model="request.name"></el-input>
        </el-form-item>

        <el-form-item label="Save to : ">
          <el-select v-model="valueColection" placeholder="Select Collection" @change="getFolder" v-if="collections.length > 0">
            <el-option
              v-for="item in collections"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select v-else v-model="valueColection" disabled placeholder="No Collection"></el-select>
        
          <el-select v-model="request.id_folder" placeholder="Select Folder" v-if="collections.length > 0 && folders.length > 0">
            <el-option
              v-for="item in folders"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select v-else-if="collections.length > 0 && folders.length <= 0" 
            v-model="request.id_folder" disabled placeholder="No Folder">
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addRequestDialog = false">CANCLE</el-button>
        <el-button type="success" @click="addRequest()">SAVE</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import AceEditor from "vue2-ace-editor";
import '@/assets/scss/main.scss';
import {env} from '../nuxt.config';

export default {
  
  props: [
    'data',
    'targetName'
  ],

  components: {
    AceEditor
  },

  data () {
    return {
      server_api: env.SERVER_API,
      inputParameter: [{"keyParams": "", "valueParams": ""}],
      params : this.data.params,
      inputHeader: [{"keyHeaders": "", "valueHeaders": ""}],
      content: '',
      textbody: this.data.body || '{}',
      optionsj: {
        readOnly: true,
        autoScrollEditorIntoView: true
      },
      optionsbody: {
        autoScrollEditorIntoView: true
      },
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
          label: 'DEL'
        }
      ],
      optionauth: [
        {
          value: 'No Auth',
          label: 'No Auth'
        }, {
          value: 'Bearer Token',
          label: 'Bearer Token'
        }, {
          value: 'Basic Auth',
          label: 'Basic Auth'
        }
      ],
      auth: 'No Auth',
      token: this.data.auth,
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
      loading: false,
      formLabelWidth: '180px',
      labelPosition: 'left',
      collections: [],
      valueColection: null,
      folders: [],
      valueFolder:null,
      addRequestDialog: false,
      request: {
        id_folder: this.data.id_folder || null,
        name: this.data.name || 'Untitled Request',
        method: this.data.method || 'get',
        url: this.data.url || ''
      }
    }
  },
    
  methods: {
    editorInit: function(editor) {
      require('brace/mode/json')
      require('brace/theme/chrome')
    },

    send(){
      this.loading = true
      this.sendRequest()
    },

    getFolder(){
      axios.get(this.server_api+'/V1/collections/folders/'+this.valueColection)
      .then(res => {
        this.folders = res.data.data
      })
      .catch(err => {
        this.$message({
          message: 'Failed',
          type: 'error'
        })
        console.log(err)
      })
    },

    save(id){
      if(id){
        axios.put(this.server_api+'/V1/requests/'+id, {
          name: this.request.name,
          id_folder: this.request.id_folder,
          method: this.request.method,
          url: this.request.url,
          id_user: sessionStorage.getItem('id_user'),
          body: JSON.parse(this.textbody),
          params: this.convertToParams(this.inputParameter),
          header: this.inputHeader,
          auth: JSON.stringify(this.token)
        })
        .then(res => {
          this.inputParameter = this.convertParams(this.data.params)
          this.$message({
            message: 'Success',
            type: 'success'
          })
        })
        .catch(err => {
          this.$message({
            message: 'Failed',
            type: 'error'
          })
          console.log(err)
        })
      }else{
        axios.get(this.server_api+'/V1/collections')
        .then(res => {
          this.collections = res.data.data
          this.addRequestDialog = true
        })
        .catch(err => {
          this.$message({
          message: 'Failed',
          type: 'error'
        })
          console.log(err)
        })
      }
    },

    sendRequest() {
      axios({
        method: this.request.method,
        url: this.request.url,
        headers: this.headerArray(),             
        data: JSON.parse(this.textbody),
        params: this.convertToParams(this.inputParameter)
      })
      .then(res => { 
        this.content = JSON.stringify(res.data, null, 4)
        this.status = res.status+" "+res.statusText
        this.loading = false
      }).catch(err => {
        console.log(err.response)
        this.content = JSON.stringify(err.response.data, null, 4)
        this.status = err.response.status+" "+err.response.statusText
        this.loading = false
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

    convertToParams(params){
      let arr = {}
      params.forEach(params => {
        var key = params['keyParams']

        if(key == ""){
          return '{}'
        }

        arr[key] =  params['valueParams']
      })
      
      return arr
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

    addRequest() {
      axios.post(this.server_api+'/V1/requests', {
        id_folder: this.request.id_folder,
        name: this.request.name,
        method: this.request.method,
        url: this.request.url,
        id_user: sessionStorage.getItem('id_user')
      })
      .then(res => {
        this.$emit('newRequest', res.data.data.id)
        this.$emit('remove', this.targetName)
        this.$message({
          message: 'Save as New Request',
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
      this.request.id_folder = null
      this.request.name = 'Untitled Request'
      this.request.method = 'get'
      this.request.url = ''
    },

    convertParams(data){
      // [{"keyParams": "", "valueParams": ""}]
      let arr = []
      data = JSON.parse(data)
      for (var key in data) {
        if (data.hasOwnProperty(key)){
          arr.push({"keyParams" : key, "valueParams" : data[key]})
        }
      }

      return arr
    }
  }
}
</script>
