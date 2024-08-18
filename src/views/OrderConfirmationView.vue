<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useUserStore } from '../stores/userStore'

const appStore = useAppStore()
const userStore = useUserStore()

const confirmation = ref(false),
paymentSuccessful = ref(false),
orderNumber = ref('');

// watch(
//   paymentMethod,
//   (newMethod) => {
//     // console.log('newPaymentMethod:', newMethod)
    
//   },
//   { deep: true }
// )

</script>

<template>

  <div v-if="confirmation && paymentSuccessful" class="container min-h-full text-center mx-auto pt-20">
    <div class="w-full min-h-full text-center">
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Order Confirmed
      </h1>
      <p class="mt-6 text-base leading-7 text-gray-600">
        Thank you for your order!
      </p>
      <p class="mt-2">Your order number is <strong>#{{ orderNumber }}</strong>. You will receive an email confirmation shortly.</p>
      <div class="mt-10 flex items-center justify-center gap-4">
        <router-link
          to="/"
          class="cursor-pointer rounded-md text-gray-900 hover:text-cyan-900 hover:underline py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          <span class="mb-[0.12rem] font-semibold">Continue shopping</span>
        </router-link>
      </div>
    </div>
  </div>

</template>
