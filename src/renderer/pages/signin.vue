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
       
        <el-form-item>
            <el-button type="primary"  @click="submitForm('ruleForms')">Sign In</el-button> 
        </el-form-item>

    </el-form>
     
</template>
<script>
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

            //  this.$router.replace({ name: "next" });

            axios({
              method: 'post',
              url: 'http://localhost:9000/signin',
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

