<script setup>
import {ref, reactive} from "vue";
import {getDicts,modifyInformation} from "../../api/user";
import {ElMessage} from "element-plus";
import AvatarCropper from "../../components/HelloWorld.vue";
import {useCounterStore} from "../../store/index";
import yulan from '../../components/yulan.vue'
import {storeToRefs} from "pinia";


import { onMounted,onUpdated } from 'vue'
const store = useCounterStore();
let {userInfo} = storeToRefs(store);

const emit = defineEmits(["zhuceOpen"]);

const props = defineProps({
  centerDialogVisible: false,
  option: 1,
  titlse: "注册孟游账号",
});
const dialogVisible = ref(false);

const ruleFormRef = ref();
// 表单密码重复校验
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入确认密码"));
  } else if (value !== form.passWord) {
    callback(new Error("两次密码不一致!"));
  } else {
    callback();
  }
};


// 判断是否是修改
const xiu=()=>{

  if(props.option==2){
    form.userNname=userInfo.value.userName

    form.passWord=userInfo.value.passWord

    form.passWordAgn=userInfo.value.passWord
  }
}

onUpdated(()=>{
  xiu()
})
onMounted(()=>{
  xiu()
})
// 表单组件
const form = reactive({
  userNname: "",
  passWord: "",
  passWordAgn: "",
});
// 表单校验
const rules = reactive({
  userNname: [
    {required: true, message: "用户名不能为空", trigger: "blur"},
    {min: 1, max: 5, message: "用户名不能多于6个字符", trigger: "blur"},
  ],
  passWord: [
    {required: true, message: "密码不能为空", trigger: "blur"},
    {min: 8, max: 16, message: "密码长度不能少于8个字符", trigger: "blur"},
  ],
  passWordAgn: [
    {validator: validatePass2, trigger: "blur"},
    {min: 8, max: 16, message: "密码长度不能少于8个字符", trigger: "blur"},
  ],
});

// 发送注册请求
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {

      // 注册走这里
      if (props.option == 1) {
        getDicts(form).then((res) => {
          console.log(res);

          if (res.code == 201) return ElMessage.error("用户已存在！");

          if (res.code == 200) {
            ElMessage({
              message: "恭喜您注册成功！",
              type: "success",
            });

            ruleFormRef.value.resetFields();
            emit("zhuceOpen");
          }
        });

        // 如果是修改信息走这里
      }
      
      else if(props.option == 2){
        const xinxi={
          id:userInfo.value.id,
          userName:form.userNname,
          passWord:form.passWord
         
        }
        modifyInformation(xinxi).then((res)=>{
          if(res.code===200){
            ElMessage({
              message: "修改成功！",
              type: "success",
            });
            emit("zhuceOpen");
            // 修改成功，调用获取用户信息的接口
            store.increment()
       
          }else if(res.code==201){
            ElMessage.error("用户已存在！");
          }
        })
       

      }
      // const formNew=
    } else {
      console.log("error submit!", fields);
    }
  });
};

let a = ref(true);

// 修改头像
const Modify = () => {
  dialogVisible.value = true;
};
const guanbi = () => {
  ruleFormRef.value.resetFields();
  emit("zhuceOpen");
};

const closeAvatarDialog = (data) => {
  dialogVisible.value = false;
};


// 图片预览
const centerDialogVisibles=ref(false)

const imgUrl=ref(null)
const yulantou =()=>{
  centerDialogVisibles.value=true

  imgUrl.value=userInfo.value.userHead

}
// 关闭预览
const inFocus=()=>{
  centerDialogVisibles.value=false
}
</script>

<template>

  <!-- 图片预览
   -->
  <yulan @inFocus="inFocus" :centerDialogVisibles="centerDialogVisibles" :imgUrl="imgUrl" />
  <el-dialog
    @close="guanbi"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-model="props.centerDialogVisible"
    :title="props.titlse"
    width="35%"
    center
  >
    <!-- 头像 -->
    <div
      v-if="option == 2"
      style="margin: auto; width: 200px; margin-bottom: 20px; display: flex"
    >
    <div @click="yulantou" class="yulan">
      <div v-if="!userInfo.userHead" class="headImg">
        <img src="../../assets/vue.svg" alt="" />
      </div>
      <div v-else class="headImg">
        <img :src="userInfo.userHead" alt="" />
      </div>
    </div>

      <span @click="Modify" class="xiugai">修改头像</span>
    </div>
    <!-- 修改头像插件 -->

    <AvatarCropper
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      @closeAvatarDialog="closeAvatarDialog"
    ></AvatarCropper>
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :model="form"
      label-width="100px"
      :hide-required-asterisk="true"
    >
      <el-form-item prop="userNname" label="账号：">
        <el-input clearable v-model="form.userNname" />
      </el-form-item>

      <el-form-item prop="passWord" label="密码：">
        <el-input clearable show-password v-model="form.passWord" />
      </el-form-item>

      <el-form-item prop="passWordAgn" label="确认密码：">
        <el-input clearable show-password v-model="form.passWordAgn" />
      </el-form-item>
      <!-- <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
      <div v-if="props.option==1">
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          完成
        </el-button>
        <el-button @click="$emit('zhuceOpen')">取消</el-button>
     
      </div> 

      <div v-else><el-button type="primary" @click="submitForm(ruleFormRef)">
          修改信息
        </el-button></div>
      
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.xiugai {

  cursor: pointer;
  font-size: 12px;
  line-height: 50px;
  margin-left: 50px;
  transform: scale(0.8);
  &:hover{color: #07c160;}
}

.headImg {
  width: 40px;
  cursor: pointer;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
