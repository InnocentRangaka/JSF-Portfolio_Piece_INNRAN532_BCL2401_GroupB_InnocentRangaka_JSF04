<script setup>
import { computed } from 'vue'
import CartIcon from '../icons/CartIcon.vue'
import { useAppStore } from '../../stores/appStore'

/**
 * Application store for managing global state, including cart data.
 * @type {ReturnType<typeof useAppStore>}
 */
const appStore = useAppStore()

/**
 * Computed property to get the total number of items in the cart from the app store.
 * @type {ComputedRef<number>}
 */
const cartTotalItems = computed(() => appStore.cart.totalItems)
</script>

<template>
  <div class="hidden lg:block md:block relative">
    <div v-if="cartTotalItems" class="t-0 absolute left-3 -top-4">
      <p
        class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white"
      >
        {{ cartTotalItems }}
      </p>
    </div>
    <CartIcon />
  </div>
</template>
