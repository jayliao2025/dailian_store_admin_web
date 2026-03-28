<script setup>
import { computed, onMounted, ref } from "vue";
import { request } from "../services/api.js";

const loading = ref(false);
const status = ref("");
const items = ref([]);
const current = ref(null);

const grouped = computed(() => ({
  total: items.value.length,
  paid: items.value.filter((item) => item.status === "PAID").length,
  inService: items.value.filter((item) => item.status === "IN_SERVICE").length,
  finished: items.value.filter((item) => item.status === "FINISHED").length,
}));

async function loadOrders() {
  loading.value = true;
  try {
    const query = status.value ? `?status=${encodeURIComponent(status.value)}` : "";
    const data = await request(`/admin/orders${query}`);
    items.value = data.items || [];
    if (current.value) {
      current.value = items.value.find((item) => item.order_no === current.value.order_no) || null;
    }
  } finally {
    loading.value = false;
  }
}

async function fetchDetail(orderNo) {
  const data = await request(`/admin/orders/${orderNo}`);
  current.value = data.item;
}

async function transit(orderNo, action) {
  const route = action === "start" ? "start-service" : "finish";
  await request(`/admin/orders/${orderNo}/${route}`, { method: "POST" });
  await loadOrders();
  await fetchDetail(orderNo);
}

onMounted(loadOrders);
</script>

<template>
  <div class="container-fluid px-0">
    <div class="row g-4 mb-4">
      <div class="col-md-6 col-xl-3"><div class="card metric-card h-100"><div class="card-body"><div class="text-secondary small">订单总数</div><div class="display-6 fw-bold">{{ grouped.total }}</div></div></div></div>
      <div class="col-md-6 col-xl-3"><div class="card metric-card h-100"><div class="card-body"><div class="text-secondary small">待开始</div><div class="display-6 fw-bold text-warning">{{ grouped.paid }}</div></div></div></div>
      <div class="col-md-6 col-xl-3"><div class="card metric-card h-100"><div class="card-body"><div class="text-secondary small">服务中</div><div class="display-6 fw-bold text-info">{{ grouped.inService }}</div></div></div></div>
      <div class="col-md-6 col-xl-3"><div class="card metric-card h-100"><div class="card-body"><div class="text-secondary small">已完结</div><div class="display-6 fw-bold text-success">{{ grouped.finished }}</div></div></div></div>
    </div>

    <div class="row g-4">
      <div class="col-xl-8">
        <div class="card page-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 mb-0">订单列表</h2>
              <div class="d-flex gap-2">
                <select v-model="status" class="form-select form-select-sm" style="width: 180px" @change="loadOrders">
                  <option value="">全部状态</option>
                  <option value="PAID">PAID</option>
                  <option value="IN_SERVICE">IN_SERVICE</option>
                  <option value="FINISHED">FINISHED</option>
                  <option value="PENDING_PAY">PENDING_PAY</option>
                </select>
                <button class="btn btn-outline-secondary btn-sm" @click="loadOrders">{{ loading ? '刷新中...' : '刷新' }}</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead><tr><th>订单号</th><th>状态</th><th>实付</th><th>创建时间</th><th class="text-end">操作</th></tr></thead>
                <tbody>
                  <tr v-for="item in items" :key="item.order_no">
                    <td>
                      <button class="btn btn-link p-0 text-decoration-none fw-semibold" @click="fetchDetail(item.order_no)">{{ item.order_no }}</button>
                    </td>
                    <td><span class="badge text-bg-light border">{{ item.status }}</span></td>
                    <td>{{ item.pay_amount_cent }}</td>
                    <td>{{ new Date(item.created_at).toLocaleString() }}</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" :disabled="item.status !== 'PAID'" @click="transit(item.order_no, 'start')">开始服务</button>
                        <button class="btn btn-outline-success" :disabled="item.status !== 'IN_SERVICE'" @click="transit(item.order_no, 'finish')">完结</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card page-card h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">订单详情</h2>
            <div v-if="current" class="small d-grid gap-2">
              <div><span class="text-secondary">订单号：</span>{{ current.order_no }}</div>
              <div><span class="text-secondary">状态：</span>{{ current.status }}</div>
              <div><span class="text-secondary">原价：</span>{{ current.original_amount_cent }}</div>
              <div><span class="text-secondary">实付：</span>{{ current.pay_amount_cent }}</div>
              <div><span class="text-secondary">区服：</span>{{ current.server_region || '-' }}</div>
              <div><span class="text-secondary">备注：</span>{{ current.remark || '-' }}</div>
              <div><span class="text-secondary">创建时间：</span>{{ new Date(current.created_at).toLocaleString() }}</div>
              <div><span class="text-secondary">完结时间：</span>{{ current.finished_at ? new Date(current.finished_at).toLocaleString() : '-' }}</div>
            </div>
            <div v-else class="text-secondary small">点击左侧订单号查看详情。</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
