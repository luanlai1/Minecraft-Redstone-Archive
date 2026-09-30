<script setup lang="ts">
/* Toast容器 */
import { toasts } from '@/utils/ui'
</script>

<template>
  <div class="toast-layer" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="item in toasts" :key="item.id" class="toast">
        <span class="toast__dot" aria-hidden="true" />
        {{ item.text }}
      </div>
    </TransitionGroup>
  </div>
</template>
