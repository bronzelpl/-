<script setup>
import {ref, reactive} from "vue";

const props = defineProps({
  centerDialogVisibles: false,
// 图片地址 
  imgUrl:null

});
const emit = defineEmits(['inFocus'])

const hends=()=>{

    emit('inFocus')

}
</script>
<template>
    <el-dialog 
    :before-close="hends"
        v-model="props.centerDialogVisibles"
        title="头像预览"
        width="35%"
        
        destroy-on-close
        center
      >
       
     <img class="lings" :src="props.imgUrl" alt="">

   
        <template #footer>
       
        </template>
      </el-dialog>
      </template>


<style scoped lang="scss">

.lings{width: 100%;
height: 100%;}
</style>
