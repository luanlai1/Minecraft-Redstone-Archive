<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import BackToTop from '@/components/BackToTop.vue'
import ToastLayer from '@/components/ToastLayer.vue'
</script>

<template>
  <AppNav />
  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <BackToTop />
  <ToastLayer />
</template>
