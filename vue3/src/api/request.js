import axios from "axios";
import { diffTokenTime } from "../utils/auth";
import store from "../store";
import toast from "../utils/toast";
const service = axios.create({
  baseURL: "api",
  // baseURL: `${import.meta.env.VITE_APP_BASE_API}/api`,
  timeout: 5000,
});
service.interceptors.request.use((config) => {
  const isToken = localStorage.getItem("token") !== null;
  if (isToken) {
    if (diffTokenTime()) {
      store.commit("app/logout");
      return Promise.reject(new Error("token過期"));
    }
  }
  config.headers["authorization"] =
    "Bearer " + localStorage.getItem("token") || "";
  return config;
}),
  (error) => {
    toast.add({
      severity: "error",
      detail: err,
      life: 3000,
    });
    return Promise.reject(error);
  };

service.interceptors.response.use(
  (response) => {
    const { status, data,  message = "操作成功" } = response.data;
    if (status === "success") {
      return data;
    } else {
      toast.add({
        severity: "error",
        summary: "錯誤訊息",
        detail: message,
        life: 3000,
      });
      return Promise.reject(new Error(message));
    }
  },
  (error) => {
    toast.add({
      severity: "error",
      detail: error,
      life: 3000,
    });
  }
);

export default service;
