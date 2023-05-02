<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { getUserInfo } from "@/api/user";
export default {
  name: "HomePage",
  components: {
    Header,
    Footer,
  },
  props: {},
  data() {
    return {
      userInfo:{}
    };
  },
  methods: {
    async getUser(){
      const userInfo = await getUserInfo()
      this.userInfo=userInfo
      // console.log(userInfo)
    }
  },
   created(){
    this.getUser()
  }
};
</script>
<template>
  <div class="home">
    <Header :user_avatar="userInfo.user_avatar" />
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
    // height: calc(100vh - 120px);
  }
}
</style>
