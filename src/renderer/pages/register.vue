<template>

<div class="form" id="app">
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-row>
      <b><h2>Register</h2></b>
    </el-row>

    <el-row>
        <el-form-item label="E-mail" prop="email">
          <el-input type="email"  v-model="ruleForm.email" placeholder="Example@mail.com" prefix-icon="fa fa-envelope"></el-input>
        </el-form-item>
    </el-row>

    <el-row>
        <el-form-item  label="Username" prop="username" >
          <el-input type="text"  v-model="ruleForm.username" placeholder="myname112" prefix-icon="fas fa-user"></el-input>
        </el-form-item> 
    </el-row>

    <el-row>
        <el-form-item  label="Password" prop="pass">
          <el-input type="password"  v-model="ruleForm.pass" autocomplete="off" placeholder="eg.WeebnK" prefix-icon="fas fa-lock"></el-input>
        </el-form-item> 
      
    </el-row>
    <el-row>
      <el-form-item  label="Confirm Password" prop="checkPass">
        <el-input type="password"  v-model="ruleForm.checkPass" autocomplete="off" placeholder="eg.WeebnK" prefix-icon="fas fa-lock"></el-input>
      </el-form-item>
    </el-row>
  
    <p class="error">{{errorMessage}}</p>

    <el-row>
        <el-button type="primary" class="button" round @click="submitForm('ruleForm')">Register</el-button>
    </el-row>
    <div style="margin-top:20px;">
      <router-link :to="{ name: 'login'}">Return to home page </router-link>
      
    </div>

  </el-form>
</div>

</template>

<script>
import axios from 'axios'
import { type } from 'os';
import {env} from '../nuxt.config'
import '@/assets/scss/register.scss';
  export default {
    head() {
    return {
      bodyAttrs: {
        class: 'register'
      }
    }
  },
    data() {
      var checkUsername = (rule, value, callback) => {
          if (!value) {
          return callback(new Error('Please input the username'));  
        }
          else {
              callback();
            }   
      };
      var checkEmail = (rule, value, callback) => {
          if (!value) {
          return callback(new Error('Please input the E-mail'));
        } 
            else {
              callback();
            }       
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } 
        else if (value.length <=5 ) {
          callback(new Error('Password more than 6 characters long'));
        }
        else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('Two password don\'t match!'));
        } else {
          callback();
        }
      };
      
      return {
        server_api: env.SERVER_API,
        errorMessage : '',
        ruleForm: {
          email:'',
          username:'',
          pass: '',
          checkPass: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          username: [
            { validator: checkUsername, trigger: 'blur' }
          ],
          email: [
           { validator: checkEmail, trigger: 'blur' },
           { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    methods: {       
      submitForm(formName) {
        
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios({
              method: 'post',
              url: this.server_api+'/V1/register',
              header: {
               'Content-type':'application/json'
              },
              data: {
                'email': this.ruleForm.email,
                'username':this.ruleForm.username,
                'password': this.ruleForm.pass
              }
            })
            .then(res => {
              this.$message({
                message: 'Success Register!!',
                type: 'success'
              })
              this.$router.push('/login')
            })
            .catch(err => {
              console.log(err.response.data.errors.errors.email)
              if(err.response.data.errors.errors.email && err.response.data.errors.errors.username){
                this.errorMessage = "This email and username is already used by another user. Please try with another email and username."          
              }else if(err.response.data.errors.errors.email){  
               this.errorMessage =  "This email is already used by another user. Please try with another email." 
              }else{
                this.errorMessage = "This username is already used by another user. Please try with another username." 
              }
              
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
