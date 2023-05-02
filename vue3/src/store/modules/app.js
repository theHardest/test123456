import { login as loginApi } from "../../api/user";
import router from "../../router";
import { setTokenTime } from "../../utils/auth";
import toast from "../../utils/toast";

export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem("token") || "",
  }),
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
      setTokenTime();
      router.push("/");
       
    },
    logout(state){
      state.token=""
      localStorage.clear();
      router.push("/login");
    }
  },
  actions: {
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((res) => {
            // console.log(res);
            commit("setToken", res.token);
            toast.add({
              severity: "success",
              summary: "登入成功",
              life: 3000,
            });
            resolve("登入成功");
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};
