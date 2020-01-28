<template>

<div class="form" id="app">

  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
    <el-row>
      <b><h2>เข้าสู่ระบบ</h2></b>
    </el-row>
       <!-- <v-row>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            label="Regular"
          ></v-text-field>
        </v-col>
        </v-row> -->

    <el-row>
      
        <el-form-item  label="Username" prop="username" >
          <el-input id="input" type="text"  prefix-icon="fas fa-user"  v-model="ruleForm.username" ></el-input>
        </el-form-item> 
    </el-row>

    <el-row>
        
        <!-- <el-form-item  label="Password" prop="pass"> -->
            <!-- <i class="el-icon-unlock"></i> -->
          <!-- <el-input id="input" type="password"  prefix-icon="fas fa-lock" placeholder="Password" v-model="ruleForm.pass"   autocomplete="off"> -->
            <!-- <i slot="suffix" class="el-input__icon el-icon-view"></i> -->
         <!-- </el-input>
        </el-form-item>  -->

        <el-form-item v-if="visible" label="Password" prop="pass" >
          <el-input type="password" v-model="ruleForm.pass" prefix-icon="fas fa-lock" >
            <i slot="suffix"  @click="changePass('show')"  class="el-icon-view"></i>
          </el-input>
        </el-form-item>
        <el-form-item v-else label="Password" prop="pass">
          <el-input type="text" v-model="ruleForm.pass" prefix-icon="fas fa-lock" >
            <i slot="suffix" @click="changePass('hide')" class="el-icon-view"></i>
          </el-input>
        </el-form-item>

    </el-row>
 
    <p class="error">{{errorMessage}}</p>

    <el-row>
        <el-button type="primary" class="button" round @click="submitForm('ruleForm')">เข้าสู่ระบบ</el-button>
    </el-row>
<br>
 <el-row>
        <el-button type="primary" class="buttonregis" round @click="goToRegister">ลงทะเบียน</el-button>
    </el-row>
  </el-form>
</div>

</template>

<script>
import axios from 'axios'
import { type } from 'os';
import {env} from '../nuxt.config'
import '@/assets/scss/login.scss';

  export default {

    head() {
    return {
      server_api: env.SERVER_API,
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
    

    
      return {
        errorMessage : '',
        visible: true ,
        ruleForm: {
          username:'',
          pass: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          username: [
            { validator: checkUsername, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {      
      
      togglePassword() {
        this.password_type = this.password_type === 'password' ? 'text' : 'password'
      } ,
      submitForm(formName) {
        
        this.$refs[formName].validate((valid) => {
          if (valid) {

            //  this.$router.replace({ name: "next" });

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
      goToRegister(){
        this.$router.push({ name: "register" });
      },
       changePass(value) {
        this.visible = !(value === 'show');
      }  
    }
}
    
</script>
