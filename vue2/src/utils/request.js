import axios from 'axios'
import {   getLocalStorage, diffTokenTime } from "@/utils/auth.js";
import store from "@/store";
import { Message } from 'element-ui'
const service =axios.create({
    baseURL: 'api',
    timeout:3000
})

//請求攔截
service.interceptors.request.use((config)=>{
    const isToken = localStorage.getItem("token") !== null;
    if (isToken) {
      if (diffTokenTime()) {
        store.commit("app/logout");
        return Promise.reject(new Error("token過期"));
      }
    }
    config.headers["authorization"] = "Bearer " + getLocalStorage('token') || "";
    return config;
}),(error)=>{
    Message({ message: "系統錯誤", type: "error" });
    return Promise.reject(error)
}

//響應攔截
service.interceptors.response.use((response)=>{
    const { status, data, message = "操作成功" } = response.data;
    if (status === "success") {
      return data;
    } else{
        Message({ message, type: "warning" });
    }

}),(error)=>{
    Message({ message: "系統錯誤", type: "error" });
    return Promise.reject(error)
}

export default service