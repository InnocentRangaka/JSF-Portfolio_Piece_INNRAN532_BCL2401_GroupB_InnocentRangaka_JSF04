<script setup>
/**
 * Setup script for the main layout component.
 * Handles page structure, loading state, and dynamic component visibility.
 */
import { computed, watch } from 'vue'
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()
const { error } = appStore

const currentLocation = computed(() => appStore.currentLocation);

/**
 * Watcher for changes in the current location to update component visibility.
 * @param {Object} newValue - The new value of the watched property.
 * @returns {void}
 */
watch(currentLocation, () => {
  appStore.pageName
})
</script>

<template>
  <div>

    <main>
      <div class="page-content">

        <!-- Error -->
        <!-- <div v-if="error" class="w-full flex justify-center">
          <p class="mt-28 text-red-500 text-xl font-bold">
            {{ error.message }}
          </p>
        </div> -->

        <!-- Content Slot -->
        <slot></slot>
      </div>
    </main>

  </div>
</template>
