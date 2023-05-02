<script setup>
import { ref } from "vue";
import {useStore} from 'vuex';
const store = useStore()
const menu = ref();

const props = defineProps({
  user_avatar:{
    type:String
  }
})
const items = [
  {
    label: "個人資訊",
    icon: "pi pi-user",
    to: "/user",
  },
  {
    label: "客戶列表",
    icon: "pi pi-users",
    to: "/list",
  }
];
const toggle = (event) => {
  menu.value.toggle(event);
};
const logout = [
  {
    label: "登出",
    icon: "pi pi-sign-out",
    command: () => {
      store.commit('app/logout')
    },
  },
];
</script>

<template>
  <header>
    <TabMenu :model="items" />
    <Avatar
      @click="toggle"
      :image="props.user_avatar"
      class="avatar"
      size="large"
      shape="circle"
    />
    <Menu ref="menu" :model="logout" :popup="true" />
  </header>
</template>

<style lang="scss" scoped>
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
