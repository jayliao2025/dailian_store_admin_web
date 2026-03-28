<script setup>
import AppHeader from "../components/AppHeader.vue";
import AppSidebar from "../components/AppSidebar.vue";
</script>

<template>
  <div class="app-shell bg-body-tertiary">
    <AppHeader />
    <div class="d-flex">
      <AppSidebar />
      <main class="content-pane flex-grow-1 p-4">
        <slot />
      </main>
    </div>
  </div>
</template>
