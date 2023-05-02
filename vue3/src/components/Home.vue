<script setup>
import Header from "./common/Header.vue";
import Footer from "./common/Footer.vue";
import { ref, onBeforeMount } from "vue";
import { getUserInfo } from "../api/user";
const userInfo = ref({});
onBeforeMount(async () => {
  const userInfoApi = await getUserInfo();
  userInfo.value = userInfoApi;
});

</script>

<template>
  <div class="home">
    <Header  :user_avatar="userInfo.user_avatar" />
    <main>
      <router-view :userInfo="userInfo"></router-view>
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.home {
  main {
    width: 100%;
    height: calc(100vh - 120px);
    background: gray;
  }
}
</style>
