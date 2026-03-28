<script setup>
import { computed, onMounted, ref } from "vue";
import { getSession, request } from "../services/api.js";

const health = ref(null);
const checking = ref(false);
const session = computed(() => getSession());

async function checkHealth() {
  checking.value = true;
  try {
    health.value = await request("/health");
  } finally {
    checking.value = false;
  }
}

onMounted(checkHealth);
</script>

<template>
  <div class="container-fluid px-0">
    <div class="row g-4">
      <div class="col-xl-6">
        <div class="card page-card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 mb-0">系统状态</h2>
              <button class="btn btn-outline-secondary btn-sm" @click="checkHealth">{{ checking ? '检查中...' : '重新检查' }}</button>
            </div>
            <div v-if="health" class="d-grid gap-2 small">
              <div><span class="text-secondary">服务状态：</span>{{ health.status }}</div>
              <div><span class="text-secondary">Mongo：</span>{{ health.mongo }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card page-card h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">当前连接</h2>
            <div class="d-grid gap-2 small">
              <div><span class="text-secondary">API Base：</span>{{ session.apiBase }}</div>
              <div><span class="text-secondary">当前账号：</span>{{ session.username }}</div>
              <div><span class="text-secondary">Token：</span>{{ session.token ? '已设置' : '未设置' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
