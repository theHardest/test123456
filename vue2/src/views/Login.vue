<script>
export default {
  name: '',
  props: {},
  data() {
    return {
      form: {
        name: "Carl",
        password: "123456",
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
           this.$store.dispatch("app/login", this.form);
        } else {
          console.error(this.form);
        }
      });
    },
  },
};
</script>
<template>
  <div class='login'>
    <el-form label-width="80px" :model="form" ref="form">
        <el-form-item
          label="Name"
          prop="name"
          :rules="[
            { required: true, message: '輸入帳號', trigger: 'blur' },
            {
              min: 4,
              max: 10,
              message: '長度在4-10位字符之間',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="Password"
          prop="password"
          :rules="[
            { required: true, message: '請輸入密碼', trigger: 'blur' },
            {
              min: 6,
              max: 12,
              message: '長度在6-12位字符之間',
              trigger: 'blur',
            },
          ]"
        >
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">送出</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<style lang='scss' scoped>
.login{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  form{
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.5),
      0 0 10px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 50px 50px 20px 50px;
    margin-bottom: 20px;
  }
}
</style>