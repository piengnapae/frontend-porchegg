<template>
  <div>
    <el-select v-model="environments" placeholder="Select">
      <el-option
        v-for="(createEnvironment, index) in createEnvironment" v-bind:key="index"
        :label="createEnvironment.name"
        :value="createEnvironment.name">
      </el-option>
  </el-select>

    <el-button circle><i class="el-icon-view" ></i></el-button>
    <el-button  icon="el-icon-setting"   @click="addEnvironmentDialog = true" circle></el-button>     
    <el-dialog title="Environment" :visible.sync="addEnvironmentDialog">
      <div  v-for="(createEnvironment, index) in createEnvironment" v-bind:key="index">
        {{ createEnvironment.name }}
        <el-button style="position: absolute; right: 275px;" icon="el-icon-copy-document" ></el-button>
        <el-button style="position: absolute; right: 200px;"  icon="fas fa-edit" @click="openEditBox(createEnvironment.id)"></el-button>
        <el-button style="position: absolute; right: 125px;" icon="fas fa-trash-alt" @click="remove(createEnvironment.id)" ></el-button>
        <el-button  style="position: absolute; right: 50px;" icon="fas fa-file-export" ></el-button>
          <el-divider></el-divider>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addEnvironmentDialog = false">Cancel</el-button>
        <el-button type="success" @click="CreateEnvironmentDialog = true">Create</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Edit Environment" :visible.sync="EditEnvironmentDialog ">
      <el-form :model="editEnvironment">
        <el-form-item label="NAME ENVIRONMENT" >
          <el-input v-model="editEnvironment.name" autocomplete="off" ></el-input>
        </el-form-item>  
      </el-form> 
         <el-col :span="11"> VARIABLE </el-col>
            <el-col :span="11"> VALUE </el-col> <br>
              <div v-for="(input, index) in inputEditEnvironment" v-bind:key="index">
                <div style="margin: 15px;"></div>
                  <el-row :gutter="25"> 
                  <el-col :span="11">  
                    <el-input v-model="input.variable"></el-input>
                  </el-col>
                  <el-col :span="11">      
                    <el-input v-model="input.value"></el-input>
                  </el-col>
                  <el-col :span="2" v-if="inputEditEnvironment.length > 1">
                    <el-button @click="deleteRowsEditEnvironment(index)"  type="danger" circle><i class="el-icon-delete"></i></el-button>
                  </el-col>
                </el-row>   
              </div>
                
              <div style="margin: 15px;"></div>
              <center><el-button class="font" type="text" @click="addRowsEditEnvironment"><i class="el-icon-plus"></i> Add New</el-button></center>
               
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="EditEnvironmentDialog = false">Cancel</el-button>
        <el-button type="success" @click="EditEnvironment(editEnvironment.id) ">Submit</el-button>
      </span>
    </el-dialog>

     <el-dialog title="Create Environment" :visible.sync="CreateEnvironmentDialog">
        <el-form :model="environment">
          <el-form-item label="NAME ENVIRONMENT" >
            <el-input v-model="environment.name" autocomplete="off"></el-input>
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
        EditEnvironmentDialog : false,
        environments : 'No Environment',
        createEnvironment: {
        name: ''
        },
        environment: {
          name: ''
        },
        editEnvironment: {
        id : null,
        name: '',
        values: []
        },
        inputEnvironment: [{}],
        inputEditEnvironment: [{}]
    }  
  },
   updated:function () {
    this.getEnvironment()
  },

  created:function () {
    this.getEnvironment()
  },

  methods: {
        addRowsEnvironment() {
        this.inputEnvironment.push({
        })
      },
        deleteRowsEnvironment(indexEnvironment) {
        this.inputEnvironment.splice(indexEnvironment,1)
      },
        addRowsEditEnvironment() {
        this.inputEditEnvironment.push({
        })
      },
        deleteRowsEditEnvironment(indexEditEnvironment) {
        this.inputEditEnvironment.splice(indexEditEnvironment,1)
      },
        CreateEnvironment(createEnvironment) {
          axios.post(this.server_api+'/environment', {
          id_user : 1,
          name: this.environment.name,
          values: this.convertToEnvironment(this.inputEnvironment) 
      })
          .then(res => {
          this.$message({
          message: 'Success Added Environment!!',
          type: 'success'
        })
      })
          .catch(err => {
          this.$message({
          message: 'Failed!!',
          type: 'error'
        })
          console.log(err)
      })
          this.CreateEnvironmentDialog = false
      },
        convertToEnvironment(env){
          let arrayenv = []
          env.forEach(element => {
            const temp = {'variable' : element['keyEnvironment'] , 'value': element['valueEnvironment']}
            arrayenv.push(temp)
        });
          return arrayenv
      },
        getEnvironment(id) {
          axios.get(this.server_api+'/environment')
          .then(res => {
            this.createEnvironment = res.data.data
        })
          .catch(err => {
            console.log(err)
        })
      },
        openEditBox(id){
          axios.get(this.server_api+'/environment/'+id)
          .then(res => {
            this.editEnvironment.name = res.data.name
            this.editEnvironment.id = res.data.id
            this.inputEditEnvironment =JSON.parse(res.data.values)
            this.EditEnvironmentDialog = true
        })
          .catch(err => {
            console.log(err)
        })
      },
        EditEnvironment(id){
          axios.put(this.server_api+'/environment/'+id,{
            name: this.editEnvironment.name,
            values : this.inputEditEnvironment
        })
          .then(res => {
            this.editEnvironment.name = res.data.name
            this.inputEditEnvironment = res.data.values
            this.$message({
            message: 'Success Edited Environment!!',
            type: 'success'
        })
        })
          .catch(err => {
            console.log(err)
        })
        this.EditEnvironmentDialog = false   
      },
        remove(id) {
        axios.delete(this.server_api+'/environment/'+id, {
      })
        .then(res => {
          this.$message({
          message: 'Success Deleted Environment!!',
          type: 'success'
        })
          console.log("Success Deleted Environment!!")
      })
        .catch(err => {
          this.$message({
          message: 'Failed!!',
          type: 'error'
        })
          console.log(err)
      })
      this.addEnvironmentDialog = false
    },
  }
}
</script>


