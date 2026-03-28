<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getSession, logout } from "../services/api.js";

const router = useRouter();
const session = computed(() => getSession());
const tokenPreview = computed(() => {
  const token = session.value.token || "";
  if (!token) return "未登录";
  if (token.length <= 8) return token;
  return `${token.slice(0, 4)}****${token.slice(-4)}`;
});

function handleLogout() {
  logout();
  router.push({ name: "login" });
}
</script>

<template>
  <header class="topbar d-flex align-items-center px-4 justify-content-between">
    <div>
      <div class="fw-bold">代练后台管理</div>
      <div class="text-secondary small">Vue 3 + Bootstrap</div>
    </div>
    <div class="d-flex align-items-center gap-3">
      <div class="small text-secondary">{{ session.apiBase }}</div>
      <div class="token-pill">Token {{ tokenPreview }}</div>
      <div class="small">{{ session.username }}</div>
      <button class="btn btn-outline-danger btn-sm" @click="handleLogout">退出</button>
    </div>
  </header>
</template>
