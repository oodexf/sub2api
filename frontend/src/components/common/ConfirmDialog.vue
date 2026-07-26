<template>
  <BaseDialog :show="show" :title="title" width="narrow" @close="handleCancel">
    <div class="space-y-4">
      <div class="flex items-start gap-3.5">
        <div
          v-if="danger"
          class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        >
          <Icon name="exclamationTriangle" size="md" />
        </div>
        <p class="pt-0.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{{ message }}</p>
      </div>
      <slot></slot>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button @click="handleCancel" type="button" class="btn btn-secondary btn-md">
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          type="button"
          class="btn btn-md"
          :class="danger ? 'btn-danger' : 'btn-primary'"
        >
          {{ confirmText }}
        </button>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseDialog from './BaseDialog.vue'
import Icon from '@/components/icons/Icon.vue'

const { t } = useI18n()

interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  danger: false
})

const confirmText = computed(() => props.confirmText || t('common.confirm'))
const cancelText = computed(() => props.cancelText || t('common.cancel'))

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>
