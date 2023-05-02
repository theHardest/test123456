<script>
export default {
  name: "User",
  props: {
    userInfo: Object,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<template>
  <div class="user">
    <div class="imgContainer">
      <img :src="userInfo.user_avatar" alt="avator" />
    </div>
    <h2>{{ userInfo.user_name }}</h2>
    <p>Email: {{ userInfo.user_email }}</p>
  </div>
</template>
<style lang="scss" scoped>
.user {
  height: 100%;
  background: gray;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  gap: 40px;
  .imgContainer {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
