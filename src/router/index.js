import { createRouter, createWebHashHistory } from "vue-router";
import { loadAuthState } from "../stores/auth.js";
import LoginView from "../views/LoginView.vue";
import PackagesView from "../views/PackagesView.vue";
import OrdersView from "../views/OrdersView.vue";
import SystemView from "../views/SystemView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/login", name: "login", component: LoginView, meta: { guestOnly: true } },
    { path: "/", redirect: "/packages" },
    { path: "/packages", name: "packages", component: PackagesView, meta: { requiresAuth: true } },
    { path: "/orders", name: "orders", component: OrdersView, meta: { requiresAuth: true } },
    { path: "/system", name: "system", component: SystemView, meta: { requiresAuth: true } },
  ],
});

router.beforeEach((to) => {
  const session = loadAuthState();
  const isAuthed = Boolean(session?.token);

  if (to.meta.requiresAuth && !isAuthed) {
    return { name: "login" };
  }

  if (to.meta.guestOnly && isAuthed) {
    return { name: "packages" };
  }

  return true;
});

export default router;
