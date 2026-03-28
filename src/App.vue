<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "./layouts/AdminLayout.vue";

const route = useRoute();
const isLogin = computed(() => route.name === "login");
</script>

<template>
  <router-view v-if="isLogin" />
  <AdminLayout v-else>
    <router-view />
  </AdminLayout>
</template>
