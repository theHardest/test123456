<script setup>
const props = defineProps({
  userInfo: {
    type: Object,
  },
});
</script>

<template>
  <div class="user">
    <div class="imgContainer">
      <img :src="props.userInfo.user_avatar" alt="avator" />
    </div>
    <h2>{{ props.userInfo.user_name }}</h2>
    <!-- <p>line-ID: {{ props.userInfo.line_id }}</p> -->
    <p>Email: {{ props.userInfo.user_email }}</p>
  </div>
</template>

<style lang="scss" scoped>
.user {
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
