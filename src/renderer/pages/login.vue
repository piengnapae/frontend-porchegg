<template>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForms" label-width="120px" class="demo-ruleForm">

        <el-form-item label="Sign In">
        </el-form-item>

        <el-form-item label="Username" prop="username">
          <el-input type="text" v-model="ruleForm.username" ></el-input>
        </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>

        <center>{{errorMessage}}</center>
       
        <el-form-item>
            <el-button type="primary"  @click="submitForm('ruleForms')">Sign In</el-button> 
        </el-form-item>

        Doesn't have an account ?
        <nuxt-link
          to="/register"
          exact
        >
          Register Here
        </nuxt-link>
    </el-form>
     
</template>
<script>
import {env} from '../nuxt.config'
import axios from 'axios'
  export default {
    data() {
      var checksUsername = (rule, value, callback) => {
          if (!value) {
          return callback(new Error('Please input the username'));  
        }
          else {
              callback();
            }   
      };
      
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } 
        else {
              callback();
            } 
      };     
      return {
        server_api: env.SERVER_API,
        errorMessage : '',
        ruleForm: { 
          username:'',
          password: ''
        },
        rules: {
            username: [
            { validator: checksUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
         
        }
      };
    },
    methods: {      
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            axios({
              method: 'post',
              url: this.server_api+'/login',
              header: {
               'Content-type':'application/json'
              },
              data: {               
                'username': this.ruleForm.username,
                'password': this.ruleForm.password
              }
            })
            .then(res => {
              console.log(res)
              this.$router.push('/member')
            })
            .catch(err =>{
              this.errorMessage = err.response.data.error.message;
            })
             
          } 
          else {
            console.log('error submit!!');
            return false;
          }
        });   
      }, 

  }
}
    
  
</script>

