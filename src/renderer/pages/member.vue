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
              <el-button type="text" class="el-icon-arrow-down text" @click="isShowing = !isShowing">Request</el-button>
            </div>
          </el-col>
        </el-row>

        <div v-if="isShowing" class="box">

          <el-row gutter="15">
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

          <el-tabs v-model="activeTab" @tab-click="paramsTab" >
            <el-tab-pane label="Parameters" name="params">
              <el-row>
                <el-col :span="24">
                  <div>
                    <el-button type="text" class="el-icon-arrow-down text" @click="isShowParam = !isShowParam">Parameters</el-button>
                  </div>
                </el-col>
              </el-row>

            <div v-if="isShowParam"  >  
              <el-row gutter="25">
                <el-col :span="11">
                  <el-row>KEY</el-row>
                    <el-input v-model="keyParam"></el-input>
                </el-col>

                <el-col :span="11">
                  <el-row>VALUE</el-row>
                    <el-input v-model="valuesParam"></el-input>
                  </el-col>
              </el-row>
            
              <div v-for="(input, index) in inputsParam" v-bind:key="index">
                <div style="margin: 15px;"></div>
                  <el-row gutter="25"> 
                    <el-col :span="11">
                        <el-input v-model="input.keyParammeter"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input v-model="input.valuesParammeter"></el-input>
                    </el-col>
                    <el-col :span="2">
                      <el-button @click="deleteRow(index)" type="danger" circle><i class="el-icon-delete"></i></el-button>
                    </el-col>
                  </el-row>
              </div>
    
              <div style="margin: 15px;"></div>
                <center><el-button class="font" type="text" @click="addRow" ><i class="el-icon-plus"></i> Add New</el-button></center>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.0.3/vue.js"></script>
              </div>       
            </el-tab-pane>

          <el-tab-pane label="Authentication" name="authentication"> 
              
            <el-row>
              <el-col :span="24">
                <div>
                  <el-button type="text" class="el-icon-arrow-down text" @click="isShowAuth = !isShowAuth">Authentication</el-button>
                </div>
              </el-col>
             </el-row>
       
          <div v-if="isShowAuth" >
            <el-row gutter="15">
              <el-col :span="4">
                <el-row>TYPE</el-row>
                  <el-select v-model="auth" >
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
                  <el-input v-model="token"></el-input>                 
              </el-row>
            </el-col>

            <el-col  :sm="10">
              <el-row v-if="auth === 'Basic Auth'">
                <el-row>USERNAME</el-row>
                  <el-input v-model="username"></el-input>
              </el-row>
            </el-col> 

            <el-col  :sm="10">
              <el-row v-if="auth === 'Basic Auth'">
                <el-row>PASSWORD</el-row>
                  <el-input  v-model="password" show-password></el-input>
              </el-row>
            </el-col>            
            </el-row>
          </div>
          </el-tab-pane>
  
            <el-tab-pane label="Headers" name="headers">
               <el-row>
                <el-col :span="24">
                  <div>
                    <el-button type="text" class="el-icon-arrow-down text" @click="isShowHeader = !isShowHeader">Headers</el-button>
                  </div>
                </el-col>
              </el-row>

        <div v-if="!isShowHeader" >  
              <el-row gutter="25">
                <el-col :span="11">
                  <el-row>KEY</el-row>
                    <el-input v-model="keyHeader"></el-input>
                </el-col>
                <el-col :span="11">
                  <el-row>VALUE</el-row>
                    <el-input v-model="valuesHeader"></el-input>
                  </el-col>
              </el-row>
            
             <div v-for="(head, indexs) in inputsheaders" v-bind:key="indexs">
                <div style="margin: 15px;"></div>
                  <el-row gutter="25"> 
                      <el-col :span="11">
                          <el-input v-model="head.keyheaders"></el-input>
                      </el-col>
                      <el-col :span="11">
                          <el-input v-model="head.valuesheaders"></el-input>
                      </el-col>
                      <el-col :span="2">
                          <el-button @click="deleteRows(indexs)" type="danger" circle><i class="el-icon-delete"></i></el-button>
                      </el-col>
                  </el-row>
             </div>

              <div style="margin: 15px;"></div>
                <center><el-button class="font" type="text" @click="addRows"><i class="el-icon-plus"></i> Add New</el-button></center>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.0.3/vue.js"></script>
            </div>       
          </el-tab-pane>

            <el-tab-pane label="Body" name="body">
               <el-row>
                <el-col :span="24">
                  <div>
                    <el-button type="text" class="el-icon-arrow-down text" @click="isShowBody = !isShowBody">Body</el-button>
                  </div>
                </el-col>
              </el-row>

              <div v-if="isShowBody" class="jsonStyle">  
                  <!-- <el-input 
                    type="textarea"
                    :autosize="{ minRows: 7, maxRows: 7}"
                    v-model="textarea"> 
                  </el-input>   -->

                <el-table :data="tableData" style="width: 100%">
                  <el-table-column  >
                    <template slot-scope="scope">
                      <vue-json-editor
                        v-model="scope.row.data"
                        mode="code"
                        :modes="['code']"
                        :show-btns="false"
                        :exapndedOnStart="true"
                      ></vue-json-editor>
                    </template>
                  </el-table-column>
                </el-table>

              </div>       
            </el-tab-pane>
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
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
const prettyPrintJson = require('pretty-print-json');

import vueJsonEditor from "vue-json-editor";

  export default {
    components: {  
      vueJsonEditor 
    },
    data() {
      return {
         tableData: [ 
          {}
          ],

        inputsParam: [],
        inputsheaders: [],
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
        keyParam:'',
        valuesParam: '',
        keyHeader: '',
        valuesHeader: '',
        token: '',
        username: '',
        password: '',
        textarea: '',
        isShowHeader: '',
        hideRequest: '',
        isShowing: true,
        isResponse: true,
        isShowAuth: true,
        isShowParam: true,
        isShowBody: true,
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
      },
      addRow() {
      this.inputsParam.push({
        keyParammeter: '',
        valuesParammeter: ''
      })
      },
      deleteRow(index) {
        this.inputsParam.splice(index,1)
      },
      addRows() {
        this.inputsheaders.push({
          keyheaders: '',
          valuesheaders: ''
        })
      },
      deleteRows(indexs) {
        this.inputsheaders.splice(indexs,1)
      }
    }   
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Mitr&display=swap');
@import '../assets/styles/json.css';

body {
  font-family: 'Mitr', sans-serif;
  background-color: #eeeeee
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
}

.jsonStyle {
  font-family: Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif;
}
.font{
   font-family: 'Mitr';
}

</style>
