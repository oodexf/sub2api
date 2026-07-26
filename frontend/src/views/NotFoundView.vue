<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 dark:bg-dark-950"
  >
    <!-- Background Decoration -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        class="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl"
      ></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(95,102,245,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(95,102,245,0.04)_1px,transparent_1px)] bg-[size:64px_64px]"
      ></div>
    </div>

    <div class="relative z-10 w-full max-w-lg text-center">
      <!-- 404 Display -->
      <p class="mb-2 font-mono text-xs uppercase tracking-[0.35em] text-primary-500">
        {{ t('errors.pageNotFound') }}
      </p>
      <h1
        class="not-found-figure select-none font-display text-[clamp(8rem,24vw,14rem)] font-bold leading-none tracking-tight"
      >
        404
      </h1>

      <p class="mx-auto mb-10 mt-4 max-w-sm text-gray-500 dark:text-dark-400">
        {{ t('errors.pageNotFoundDesc') }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col justify-center gap-3 sm:flex-row">
        <button @click="goBack" class="btn btn-secondary">
          <Icon name="arrowLeft" size="sm" />
          {{ t('errors.goBack') }}
        </button>
        <router-link to="/dashboard" class="btn btn-primary">
          <Icon name="home" size="sm" />
          {{ t('errors.goHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Icon from '@/components/icons/Icon.vue'

const { t } = useI18n()
const router = useRouter()

function goBack(): void {
  router.back()
}
</script>

<style scoped>
.not-found-figure {
  color: transparent;
  -webkit-text-stroke: 2px rgba(95, 102, 245, 0.35);
}

.dark .not-found-figure {
  -webkit-text-stroke-color: rgba(131, 145, 251, 0.4);
}
</style>
