<script setup>
import { ref } from "vue";
import base from "../assets/images/btn_login_base.png";
import hover from "../assets/images/btn_login_hover.png";
import press from "../assets/images/btn_login_press.png";
const buttonStatus = ref(base);
const hoverEvent = () => (buttonStatus.value = hover);
const initEvent = () => (buttonStatus.value = base);
const pressEvent = () => (buttonStatus.value = press);
</script>

<template>
  <div>
    <img
      :src="buttonStatus"
      @mouseover="hoverEvent()"
      @mousedown="pressEvent()"
      @mouseup="hoverEvent()"
      @mouseleave="initEvent()"
      @click="$emit('click')"
    />
  </div>
</template>

<style lang="scss" scoped></style>
