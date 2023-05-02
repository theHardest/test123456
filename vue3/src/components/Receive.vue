<template>
  <div class="about">loading.....</div>
</template>

<script setup>
import axios from "axios";
import Qs from "qs";
import jwtDecode from "jwt-decode";
import { lineLogin } from "../api/user";
import { setTokenTime } from "../utils/auth";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import {useStore} from 'vuex'
const store = useStore()
const route = useRoute();
const setLocalStoreAge = async (res) => {
  localStorage.setItem("token", res.token);
  setTokenTime();
  store.commit('app/setToken',res.token)

};
onMounted(() => {
  let options = Qs.stringify({
    grant_type: "authorization_code",
    code: route.query.code,
    redirect_uri: import.meta.env.VITE_APP_LINE_REDIRECT_URL,
    client_id: import.meta.env.VITE_APP_LINE_CHANELL_ID,
    client_secret: import.meta.env.VITE_APP_LINE_CHANELL_SECRET,
  });
  axios
    .post("https://api.line.me/oauth2/v2.1/token", options, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((res) => {
      return jwtDecode(res.data.id_token); // 把結果的id_token做解析
    })
    .then(async (data) => {
      console.log(data)
      const res = await lineLogin(data);
      console.log(res)
      await setLocalStoreAge(res);
    });
});
</script>
