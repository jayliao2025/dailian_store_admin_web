<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { request } from "../services/api.js";

const loading = ref(false);
const items = ref([]);
const logs = ref([]);
const form = reactive({
  title: "",
  price_cent: 0,
  sort_order: 0,
  cover_url: "",
  description: "",
});

const publishedCount = computed(() => items.value.filter((item) => item.status === "PUBLISHED").length);

function appendLog(message) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
}

async function loadPackages() {
  loading.value = true;
  try {
    const data = await request("/admin/packages");
    items.value = data.items || [];
  } finally {
    loading.value = false;
  }
}

async function submitPackage() {
  const data = await request("/admin/packages", {
    method: "POST",
    body: JSON.stringify({
      ...form,
      price_cent: Number(form.price_cent),
      sort_order: Number(form.sort_order),
    }),
  });

  appendLog(`已创建套餐 ${data.item.title}`);
  Object.assign(form, { title: "", price_cent: 0, sort_order: 0, cover_url: "", description: "" });
  await loadPackages();
}

async function changeStatus(id, action) {
  await request(`/admin/packages/${id}/${action}`, { method: "POST" });
  appendLog(`套餐 ${id} 已${action === 'publish' ? '上架' : '下架'}`);
  await loadPackages();
}

onMounted(loadPackages);
</script>

<template>
  <div class="container-fluid px-0">
    <div class="row g-4 mb-4">
      <div class="col-md-6 col-xl-3">
        <div class="card metric-card h-100"><div class="card-body"><div class="text-secondary small">套餐总数</div><div class="display-6 fw-bold">{{ items.length }}</div></div></div>
      </div>
      <div class="col-md-6 col-xl-3">
        <div class="card metric-card h-100"><div class="card-body"><div class="text-secondary small">已上架</div><div class="display-6 fw-bold text-primary">{{ publishedCount }}</div></div></div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-xl-4">
        <div class="card page-card">
          <div class="card-body">
            <h2 class="h5 mb-3">新增套餐</h2>
            <form class="d-grid gap-3" @submit.prevent="submitPackage">
              <div><label class="form-label">标题</label><input v-model.trim="form.title" class="form-control" required /></div>
              <div class="row g-3">
                <div class="col"><label class="form-label">价格(分)</label><input v-model.number="form.price_cent" type="number" class="form-control" required /></div>
                <div class="col"><label class="form-label">排序</label><input v-model.number="form.sort_order" type="number" class="form-control" /></div>
              </div>
              <div><label class="form-label">封面 URL</label><input v-model.trim="form.cover_url" class="form-control" /></div>
              <div><label class="form-label">描述</label><textarea v-model.trim="form.description" class="form-control" rows="4"></textarea></div>
              <button class="btn btn-primary">创建套餐</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-xl-8">
        <div class="card page-card mb-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 mb-0">套餐列表</h2>
              <button class="btn btn-outline-secondary btn-sm" @click="loadPackages">{{ loading ? '刷新中...' : '刷新' }}</button>
            </div>
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead><tr><th>标题</th><th>价格</th><th>状态</th><th>排序</th><th class="text-end">操作</th></tr></thead>
                <tbody>
                  <tr v-for="item in items" :key="item._id">
                    <td>
                      <div class="fw-semibold">{{ item.title }}</div>
                      <div class="small text-secondary text-break">{{ item._id }}</div>
                    </td>
                    <td>{{ item.price_cent }}</td>
                    <td><span class="badge" :class="item.status === 'PUBLISHED' ? 'text-bg-primary' : 'text-bg-secondary'">{{ item.status }}</span></td>
                    <td>{{ item.sort_order }}</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="changeStatus(item._id, 'publish')">上架</button>
                        <button class="btn btn-outline-secondary" @click="changeStatus(item._id, 'unpublish')">下架</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card page-card">
          <div class="card-body">
            <h2 class="h5 mb-3">操作日志</h2>
            <div class="log-box">{{ logs.join('\n') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
