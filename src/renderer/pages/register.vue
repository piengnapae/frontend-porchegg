<template>

<div class="form" id="app">
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-row>
      <b><h2>ลงทะเบียน</h2></b>
    </el-row>

    <el-row>
        <el-form-item label="E-mail" prop="email">
          <el-input type="email"  v-model="ruleForm.email"></el-input>
        </el-form-item>
    </el-row>

    <el-row>
        <el-form-item  label="Username" prop="username" >
          <el-input type="text"  v-model="ruleForm.username"></el-input>
        </el-form-item> 
    </el-row>

    <el-row>
        <el-form-item  label="Password" prop="pass">
          <el-input type="password"  v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item> 
      
    </el-row>
    <el-row>
      <el-form-item  label="Confirm Password" prop="checkPass">
        <el-input type="password"  v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
    </el-row>
  
    <p class="error">{{errorMessage}}</p>

    <el-row>
        <el-button type="primary" class="button" round @click="submitForm('ruleForm')">ลงทะเบียน</el-button>
    </el-row>

  </el-form>
</div>

</template>

<script>
import axios from 'axios'
import { type } from 'os';
import {env} from '../nuxt.config'
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

            //  this.$router.replace({ name: "next" });

            axios({
              method: 'post',
              url: this.server_api+'/register',
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
              this.$router.replace({ name: "login" });
            })
            .catch(err => {
              if(err.response.data.email && err.response.data.username){
                this.errorMessage = "Email และ Username มีคนใช้แล้ว กรุณาตรวจสอบใหม่"
                // The email and username has already been taken.
              }else if(err.response.data.email){
                this.errorMessage = "Email มีคนใช้แล้ว กรุณาตรวจสอบใหม่"
                // +err.response.data.email
              }else{
                this.errorMessage = "Username มีคนใช้แล้ว กรุณาตรวจสอบใหม่"
                // +err.response.data.username
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

<style>
@import url('https://fonts.googleapis.com/css?family=Mitr&display=swap');

#app {
  font-family: 'Mitr', sans-serif;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 300px;
  margin:  auto;
}
.form {
  position: relative;
  border-radius: 50px;
  top: 100px;
  z-index: 1;
  background: #FFFFFF;
  max-width: 500px;
  margin: 0 auto 100px;
  padding: 50px 150px 100px 150px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

.register {
    background-color: #ffb526;
    
  }
.button {
  background-color: #ffb526; 
  font-family: 'Mitr', sans-serif;
  border: none;
  color: white;
  width: 100%;
  text-align: center;
  text-decoration: none;
  display: flex;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
