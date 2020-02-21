<template>
  <div>

    <el-select v-model="environments" placeholder="Select">
    <el-option
      v-for="environment in optionsenv"
      :key="environment.value"
      :label="environment.label"
      :value="environment.value">
    </el-option>
  </el-select>

    <el-button circle><i class="el-icon-view" ></i></el-button>
    <el-button  icon="el-icon-setting"  @click="addEnvironmentDialog = true" circle></el-button>     
    <el-dialog title="Environment" :visible.sync="addEnvironmentDialog">

      <div  v-for="(createEnvironment, index) in createEnvironment" v-bind:key="index">
         <el-button type="text">{{ createEnvironment.name }}</el-button>
       
            <el-button  icon="el-icon-copy-document"  ></el-button>
            <el-button  icon="fas fa-edit" ></el-button>
            <el-button  icon="fas fa-trash-alt" ></el-button>
            <el-button  icon="fas fa-file-export" ></el-button> 
            <el-divider></el-divider>
         
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addEnvironmentDialog = false">Cancel</el-button>
        <el-button type="success" @click="CreateEnvironmentDialog = true">Create</el-button>
      </span>
    </el-dialog>

     <el-dialog title="Create Environment" :visible.sync="CreateEnvironmentDialog">
         <el-form :model="createEnvironment">
              <el-form-item label="NAME ENVIRONMENT" >
                <el-input v-model="createEnvironment.name" autocomplete="off"></el-input>
              </el-form-item>  
             </el-form> 
             <el-col :span="11"> VARIABLE </el-col>
               <el-col :span="11"> VALUE </el-col> <br>
              <div v-for="(env, indexEnvironment) in inputEnvironment" v-bind:key="indexEnvironment">
                <div style="margin: 15px;"></div>
                <el-row :gutter="25"> 
                  <el-col :span="11">  
                    <el-input v-model="env.keyEnvironment" ></el-input>
                  </el-col>
                  <el-col :span="11">      
                    <el-input v-model="env.valueEnvironment" ></el-input>
                  </el-col>
                  <el-col :span="2" v-if="inputEnvironment.length > 1">
                    <el-button @click="deleteRowsEnvironment(indexEnvironment)"  type="danger" circle><i class="el-icon-delete"></i></el-button>
                  </el-col>
                </el-row>   
              </div>

                <div style="margin: 15px;"></div>
                <center><el-button class="font" type="text" @click="addRowsEnvironment"><i class="el-icon-plus"></i> Add New</el-button></center>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="CreateEnvironmentDialog = false">Cancel</el-button>
        <el-button type="success" @click="CreateEnvironment('createEnvironment') ">Create</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
import axios from 'axios';
import {env} from '../nuxt.config'

export default {
  data() {
    return {
        server_api: env.SERVER_API,
        addEnvironmentDialog: false,
        CreateEnvironmentDialog : false,
        environments : '',
        optionsenv: [{
          value: 'Option1',
          label: 'Option1'
        }, {
          value: 'Option2',
          label: 'Option2'
        }],
        createEnvironment: {
        name: ''
      },
      inputEnvironment: [{}],
      nameEnvironment : '',
      
      createEnvironment:[],
      collection_id: null,
    }  
  },
   created:function () {
    this.getEnvironment(),
      this.getCollection()
  },
  methods: {
       addRowsEnvironment() {
        this.inputEnvironment.push({
        })
      },
        deleteRowsEnvironment(indexEnvironment) {
        this.inputEnvironment.splice(indexEnvironment,1)
      },
        CreateEnvironment(createEnvironment) {
        axios.post(this.server_api+'/environment', {
        id_user : 1,
        name: this.createEnvironment.name,
        values: this.convertToEnvironment(this.inputEnvironment)
      })
      .then(res => {
       this.$message({
          message: 'Success Added Environment!!',
          type: 'success'
        })
        console.log(res.data.data)
      })
      .catch(err => {
        this.$message({
          message: 'Failed!!',
          type: 'error'
        })
        console.log(err)
      })
      this.CreateEnvironmentDialog = false,
      this.addEnvironmentDialog = false
    },
 
      convertToEnvironment(env){
        let arrayenv = []
        env.forEach(element => {
            const temp = {'variable' : element['keyEnvironment'] , 'value': element['valueEnvironment']}
            arrayenv.push(temp)
        });
        return arrayenv

      },
      getEnvironment() {
      axios.get(this.server_api+'/environment')
        .then(res => {
          this.createEnvironment = res.data.data
          console.log(this.createEnvironment)
        })
        .catch(err => {
          console.log(err)
        })
    },
  
      getCollection() {
      axios.get(this.server_api+'/collections')
        .then(res => {
          this.collection = res.data.data
          console.log(this.collection)
        })
        .catch(err => {
          console.log(err)
        })
    },
    
  }
}
</script>


