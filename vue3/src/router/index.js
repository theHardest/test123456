import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
const routes = [
  { path: "/", redirect: "/user", component: Home },
  {
    path: "/login",
    name: "login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/receive",
    name: "receive",
    component: () => import("../components/Receive.vue"),
  },
  {
    path: "/",
    name: "user",
    component: () => import("../components/Home.vue"),
    children: [
      {
        path: "/user",
        component: () => import("../components/users/User.vue"),
      },
      {
        path: "/list",
        component: () => import("../components/cus/Cus.vue"),
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
