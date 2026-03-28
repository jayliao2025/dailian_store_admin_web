<script setup>
const menus = [
  { name: "packages", label: "套餐管理", icon: "bi-box-seam" },
  { name: "orders", label: "订单管理", icon: "bi-receipt" },
  { name: "system", label: "系统状态", icon: "bi-hdd-network" },
];
</script>

<template>
  <aside class="sidebar p-3 d-flex flex-column">
    <div class="small text-uppercase text-secondary fw-semibold mb-3">Menu</div>
    <nav class="nav flex-column gap-1">
      <RouterLink
        v-for="item in menus"
        :key="item.name"
        :to="{ name: item.name }"
        class="nav-link d-flex align-items-center gap-2"
        active-class="active"
      >
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
