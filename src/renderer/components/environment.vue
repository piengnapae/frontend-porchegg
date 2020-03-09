 <template>
  <div>
    
    {{environments}}
    <el-select v-if="createEnvironment.length > 0" v-model="environments" @change="showEnv()" >
      <el-option label="No Environment" value="No Environment">
      </el-option>
      <el-option  
        v-for="(createEnvironment, index) in createEnvironment" v-bind:key="index" 
        :label="createEnvironment.name" 
        :value="createEnvironment.id"
        >
      </el-option>
    </el-select>

    <el-select v-else v-model="environments" >
      <el-option :label="environments" :value="environments">
      </el-option>
    </el-select>

     <el-dialog title="Environment" :visible.sync="EnvironmentDialog">
       {{env.name}} {{env.values}}
    </el-dialog>

    <el-button circle><i class="el-icon-view" ></i></el-button>
    <el-button  icon="el-icon-setting" @click="addEnvironmentDialog = true" circle></el-button>     
    <el-dialog title="Environment" :visible.sync="addEnvironmentDialog"> 
      <div  v-for="(createEnvironment, index) in createEnvironment" v-bind:key="index">
        {{ createEnvironment.name }}  
        <el-button style="position: absolute; right: 275px;" 
          icon="el-icon-copy-document" @click="duplicateEnvironment(createEnvironment.id)">
        </el-button>
        <el-button style="position: absolute; right: 200px;"  
          icon="fas fa-edit" @click="openEditBox(createEnvironment.id)">
        </el-button>
        <el-button style="position: absolute; right: 125px;" 
          icon="fas fa-trash-alt" @click="remove(createEnvironment.id)" >
        </el-button>
        <el-button  style="position: absolute; right: 50px;" 
          icon="fas fa-file-export" >
        </el-button>
        
        <el-divider></el-divider> 
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addEnvironmentDialog = false">Cancel</el-button>
        <el-button type="success" @click="createEnvironmentDialog = true">Create</el-button>
      </span>
    </el-dialog>
  
    <el-dialog title="Edit Environment" :visible.sync="editEnvironmentDialog ">
          <!-- {{ inputEditEnvironment }}   -->
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
                    <el-button @click="deleteRowsEditEnvironment(index)" type="danger" circle><i class="el-icon-delete"></i></el-button>
                  </el-col>
                </el-row>   
              </div>
              <div style="margin: 15px;"></div>
              <center><el-button class="font" type="text" @click="addRowsEditEnvironment"><i class="el-icon-plus"></i> Add New</el-button></center>
               
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editEnvironmentDialog = false">Cancel</el-button>
        <el-button type="success" @click="EditEnvironment(editEnvironment.id) ">Submit</el-button>
      </span>
    </el-dialog>

     <el-dialog title="Create Environment" :visible.sync="createEnvironmentDialog">
        <el-form :model="environment">
          <el-form-item label="NAME ENVIRONMENT" >
            <el-input v-model="environment.name" autocomplete="off"></el-input>
          </el-form-item>  
        </el-form> 
        <el-col :span="12"> VARIABLE </el-col>
        <el-col :span="12"> VALUE </el-col> <br>
        <div v-for="(env, indexEnvironment) in inputEnvironment" v-bind:key="indexEnvironment">
          <div style="margin: 15px;"></div>
          <el-row :gutter="25"> 
            <el-col :span="12">  
              <el-input v-model="env.variable"  ></el-input>
            </el-col>
            <el-col :span="12">      
              <el-input v-model="env.value" ></el-input>
            </el-col>
            <el-col :span="2" v-if="inputEnvironment.length > 1">
              <el-button @click="deleteRowsEnvironment(indexEnvironment)" type="danger" circle><i class="el-icon-delete"></i></el-button>
            </el-col>
          </el-row>   
        </div>

        <div style="margin: 15px;"></div>
        <center><el-button class="font" type="text" @click="addRowsEnvironment"><i class="el-icon-plus"></i> Add New</el-button></center>
      
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="createEnvironmentDialog = false">Cancel</el-button>
          <el-button type="success" @click="CreateEnvironment() ">Create</el-button>
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
        EnvironmentDialog: false,
        createEnvironmentDialog : false,
        editEnvironmentDialog : false,
        removeEnvironmentDialog : false,
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
        inputEnvironment: [{"variable" : "" , "value" : ""}],
        inputEditEnvironment: [{}],
        env: {
        name: '',
        values: ''
        },
        
    }  
  },

  beforeUpdate: function () {
    if(this.createEnvironmentDialog == false){
      this.environment.name = ''
      this.inputEnvironment = [{"variable" : "" , "value" : ""}]
    }
  },

  created:function () {
    this.getEnvironment()
  },

  methods: {
    addRowsEnvironment() {
      this.inputEnvironment.push({})
    },

    deleteRowsEnvironment(indexEnvironment) {
      this.inputEnvironment.splice(indexEnvironment,1)
    },
        
    addRowsEditEnvironment() {
      this.inputEditEnvironment.push({})
    },
        
    deleteRowsEditEnvironment(indexEditEnvironment) {
      this.inputEditEnvironment.splice(indexEditEnvironment,1)
    },

    CreateEnvironment() {
      axios.post(this.server_api+'/V1/environment', {
        id_user : sessionStorage.getItem('id_user'),
        name: this.environment.name,
        values: this.inputEnvironment
      })
        .then(res => {
          this.getEnvironment()
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
      this.createEnvironmentDialog = false
    },  

      // ตรวจสอบว่าสิ่งที่ป้อนเข้ามามี {{}} หรือไม่
      // ถ้ามี {{}} เชคว่า {{}} ที่ป้อนเข้ามาเป็นตัวแปรชื่อว่าอะไร
      // เอาค่า env ใส่ใน array js
      // เช็คกับ list ใน env เก็บค่าอะไรไว้บ้าง ตรงหรือไม่ วน เช็คค่า

    // convertToEnvironment(env){
    //   let arrayenv = []
    //   env.forEach(element => {
    //     const temp = {'variable' : element['variable'] , 'value': element['value']}
    //     arrayenv.push(temp)
    //   })
    //   return arrayenv
    //   },

    // arrayEnv(){
    //    const temp = ['s']
    //     temp.push(temp)
    //     console.log(temp)
    // },
    getEnvironment(id) {
 
      axios.get(this.server_api+'/V1/environment')
        .then(res => {
          this.createEnvironment = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        
    },

    openEditBox(id){
      axios.get(this.server_api+'/V1/environment/'+id)
        .then(res => {
          this.editEnvironment.name = res.data.name
          this.editEnvironment.id = res.data.id
          this.inputEditEnvironment = JSON.parse(res.data.values)
          this.editEnvironmentDialog = true
        })
        .catch(err => {
          console.log(err)
        })
    },

    EditEnvironment(id){
      axios.put(this.server_api+'/V1/environment/'+id,{
        name: this.editEnvironment.name,
        values : this.inputEditEnvironment
      })
        .then(res => {
          this.editEnvironment.name = res.data.name
          this.inputEditEnvironment = res.data.values
          this.getEnvironment()
          this.$message({
            message: 'Success Edited Environment!!',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
        })
      this.editEnvironmentDialog = false  
    },

    remove(id) {
      this.$confirm('Do you want to delete this environment? ', 'Delete Environment', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
          axios.delete(this.server_api+'/V1/environment/'+id, {
          })
            .then(res => {
              this.getEnvironment()
              this.$message({
                message: 'Success Deleted Environment!!',
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          })         
        })
    },

    duplicateEnvironment(id){
      axios.post(this.server_api+'/V1/environment/'+id, {
        id_user : 1,
        name: this.environment.name,
        values: this.inputEnvironment
        // this.convertToEnvironment(this.inputEnvironment) 
      })
        .then(res => {
          this.getEnvironment()
          this.$message({
            message: 'Success Duplicated Environment!!',
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
    },

    showEnv(){
      // console.log(this.environments)
      axios.get(this.server_api+'/V1/environment/'+this.environments)
        .then(res => {
          const data = JSON.parse(res.data.values)
          // console.log(data)
          let arrEnvironment = []

          for(let i = 0; i < data.length; i++ ){
            // console.log(data[i]['variable'])
            // console.log(data[i]['value'])

            // let obj = {}
            // obj['key'] = data[i]['value']
            arrEnvironment[data[i]['variable']] = data[i]['value']
           
          }
         
          // console.log(arrEnvironment)
          //  this.$emit('clickedEnv', arrEnvironment)
          this.$bus.$emit('send-env', arrEnvironment)

        })
        .catch(err => {
          console.log(err)
        })
         
    
    // alert(this.environments)
  }
  }
}
</script>


