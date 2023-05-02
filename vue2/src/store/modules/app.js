import { login as loginApi } from "@/api/user";
import router from "@/router";
import { setTokenTime ,setLocalStorage,removeLocalStorage} from "@/utils/auth";
import { Message } from "element-ui";
export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem("token") || "",
  }),
  mutations: {
    setToken(state, token) {
      state.token = token;
      setLocalStorage("token", token);
      setTokenTime();
      router.push("/");
       
    },
    logout(state){
      state.token=""
      removeLocalStorage("token");
      router.push("/login");
    }
  },
  actions: {
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((res) => {
            commit("setToken", res.token);
            Message({ message: "登入成功", type: "success" });
            resolve("登入成功");
          })
          .catch((err) => {
            Message({ message: err, type: "error" });
            reject(err);
          });
      });
    },
  },
};
