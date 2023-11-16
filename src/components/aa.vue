
    <script setup>
    import {ref,reactive,} from "vue";
    import AvatarCropper from './HelloWorld.vue'
    const dialogVisible=ref(true)
    const closeAvatarDialog=(data)=> {
            dialogVisible.value = false
          }
    </script>
<template>

    <AvatarCropper v-if="dialogVisible" :dialogVisible.sync="dialogVisible"
     @closeAvatarDialog="closeAvatarDialog"></AvatarCropper>
    
    </template>
    

 