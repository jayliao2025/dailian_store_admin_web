<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api.js";

const router = useRouter();
const submitting = ref(false);
const errorMessage = ref("");
const form = reactive({
  apiBase: window.__APP_CONFIG__?.defaultApiBase || "http://localhost:3000",
  username: "admin",
  password: "123456",
});

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";

  try {
    await login(form);
    router.push({ name: "packages" });
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="auth-shell d-flex align-items-center justify-content-center p-3">
    <div class="card auth-card">
      <div class="card-body p-4 p-lg-5">
        <div class="mb-4">
          <h1 class="h3 mb-2">后台登录</h1>
          <p class="text-secondary mb-0">使用管理员账号密码进入控制台</p>
        </div>

        <form class="d-grid gap-3" @submit.prevent="handleSubmit">
          <div>
            <label class="form-label">API Base URL</label>
            <input v-model.trim="form.apiBase" class="form-control form-control-lg" />
          </div>
          <div>
            <label class="form-label">用户名</label>
            <input v-model.trim="form.username" class="form-control form-control-lg" />
          </div>
          <div>
            <label class="form-label">密码</label>
            <input v-model="form.password" type="password" class="form-control form-control-lg" />
          </div>
          <div v-if="errorMessage" class="alert alert-danger py-2 mb-0">{{ errorMessage }}</div>
          <button class="btn btn-primary btn-lg" :disabled="submitting">
            {{ submitting ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
