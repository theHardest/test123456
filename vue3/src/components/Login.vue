<script setup>
import { reactive, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const form = reactive({
  name: "Carl",
  password: "123456",
});
// valid an email with regex command each line
const handleLogin = () => {
  store.dispatch("app/login", form);
};
const nameValid = computed(() => {
  return isNameValid(form.name);
});
const passwordValid = computed(() => {
  return isPasswordValid(form.password);
});
const isButtonDisable = computed(() => {
  if (form.name.length === 0) return true;
  if (form.password.length === 0) return true;
  if (!nameValid) true;
  if (!passwordValid) true;
  return false;
});

function isNameValid(name) {
  if (name.length === 0) return true;
  const rule = /^[A-Z][a-zA-Z]{3,}$/;
  return rule.test(name);
}

function isPasswordValid(password) {
  if (password.length === 0) return true;
  const rule = /^.{6,}$/;
  return rule.test(password);
}

const loginEvent = () => {
  let URL = "https://access.line.me/oauth2/v2.1/authorize?";
  URL += "response_type=code"; // 希望LINE回應什麼  但是目前只有code能選
  URL += `&client_id=${import.meta.env.VITE_APP_LINE_CHANELL_ID}`; // 你的頻道ID
  URL += `&redirect_uri=${import.meta.env.VITE_APP_LINE_REDIRECT_URL}`; // 要接收回傳訊息的網址
  URL += "&state=123456789"; // 用來防止跨站請求的 之後回傳會傳回來給你驗證 通常設亂數 這邊就先放123456789
  URL += "&scope=openid%20profile"; // 跟使用者要求的權限 目前就三個能選 openid profile email
  URL += "&nonce=helloWorld"; // 順便將機器人也加好友
  URL += "&prompt=consent";
  URL += "&max_age=3600";
  URL += "&ui_locales=zh-TW";
  URL += "&bot_prompt=normal";
  window.open(URL, "_self"); // 轉跳到該網址
};
</script>

<template>
  <div class="login">
    <form>
      <div>
        <span class="p-float-label" style="margin-bottom: 40px">
          <InputText v-model="form.name" inputId="name" />
          <label for="name">name</label>
          <div class="errorMessage">
            {{ !nameValid ? "至少4個字包含大小寫英文" : "" }}
          </div>
        </span>
      </div>
      <div>
        <span class="p-float-label">
          <Password v-model="form.password" inputId="password" toggleMask />
          <label for="password">Password</label>
          <div class="errorMessage">
            {{ !passwordValid ? "至少6個字" : "" }}
          </div>
        </span>
      </div>
      <Button :disabled="isButtonDisable" @click="handleLogin" label="登入" />
    </form>

    <button class="lineLoginButton" @click="loginEvent"></button>
  </div>
</template>

<style lang="scss">
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  form {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.5),
      0 0 10px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 50px 50px 20px 50px;
    margin-bottom: 20px;
    .p-float-label {
      width: 100%;
      .errorMessage {
        color: red;
        font-size: 12px;
        height: 10px;
      }
      &:first-child {
        input {
          padding-right: 32px;
        }
      }
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      border: none;
      background: gray;
      border-radius: 5px;
      width: 100%;
    }
  }
  .lineLoginButton {
    width: 222px;
    height: 60px;
    background-image: url(../assets/images/btn_login_base.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    &:hover {
      background-image: url(../assets/images/btn_login_hover.png);
    }
  }
}
</style>
