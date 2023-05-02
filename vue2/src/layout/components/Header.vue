<script>
export default {
  props: {
    user_avatar: String,
  },
  data() {
    return {
      active: "user",
    };
  },
  methods: {
    logout() {
      this.$store.commit("app/logout");
    },
  },
  created(){
    this.active = this.$route.name;
  }
};
</script>
<template>
  <header>
    <el-menu
      router
      :default-active="active"
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item index="user">
        <i class="el-icon-user"></i>
        個人資訊
      </el-menu-item>

      <el-menu-item index="list"> 
        <i class="el-icon-headset"></i>
        客戶列表 
      </el-menu-item>
    </el-menu>
    <el-dropdown class="avatar">
      <el-avatar :size="60" :fit="'cover'" :src="user_avatar" @error="true">
        <img
          src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
        />
      </el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="logout" icon="el-icon-switch-button"
          >登出</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </header>
</template>
<style lang="scss">
header {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .avatar {
    position: absolute;
    right: 2%;
    cursor: pointer;
  }
}
</style>
