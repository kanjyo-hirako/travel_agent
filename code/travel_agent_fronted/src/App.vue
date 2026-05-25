<script setup>

</script>

<template>
  <div class="app-container">
    <router-view></router-view> <!-- 路由出口 -->
  <van-tabbar route v-model="active"> <!-- route开启路由模式 -->
    <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/chat" icon="chat-o">对话</van-tabbar-item>
    <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
  </div>
</template>
