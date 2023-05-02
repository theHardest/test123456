import Vue from "vue";
import Router from "vue-router";
import Home from "@/layout/Home.vue"
Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", redirect: "/user", component: Home },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/receive",
      name: "receive",
      component: () => import("@/views/Receive.vue"),
    },
    {
      path: "/",
      component: Home,
      children: [
        {
          path: "user",
          name: "user",
          component: () => import("@/views/User.vue"),
        },
        {
          path: "list",
          name: "list",
          component: () => import("@/views/Cus"),
        },
        {
          path: "list2",
          name: "list2",
          component: () => import("@/views/Cus/index2.vue"),
        },
      ],
    },
  ],
  mode: "history",
});
