<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useAppStore } from '../../stores/appStore'

const router = useRouter();
const userStore = useUserStore()
const appStore = useAppStore()

const { logoutUser } = userStore;
const { saveCart } = appStore;

function useCountdownRedirect() {
  const countdown = ref(5); // Start countdown from 5 seconds

  const startCountdown = (redirectTo = '/') => {
    const interval = setInterval(() => {
      countdown.value--; // Decrement countdown

      if (countdown.value <= 0) {
        clearInterval(interval); // Stop the interval when countdown reaches 0
        router.push(redirectTo); // Redirect to the home page
      }
    }, 1000); // Set interval to 1 second (1000 milliseconds)
  };

  return { countdown, startCountdown };
}   

const { countdown, startCountdown } = useCountdownRedirect();

onMounted(() => {
  saveCart(userStore.user.id, appStore.cart)
  logoutUser();
  startCountdown();

});

// Function to navigate back to the home page
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="container min-h-full text-center mx-auto pt-20">
    <div class="w-full min-h-full text-center">
      <p class="text-base font-semibold text-cyan-700">You have been</p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Logged out
      </h1>
      <p class="mt-6 text-base leading-7 text-gray-600">
        You will automatically be redirected to home page in {{ countdown }}
      </p>
      <div class="mt-10 flex items-center justify-center gap-4">
        <button
          @click="goHome"
          class="cursor-pointer rounded-md text-gray-900 hover:text-cyan-900 hover:underline py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          <span class="flex h-full items-center text-left">
            <span class="mb-[0.12rem] font-semibold">Go to home page</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.min-h-full {
  min-height: 100vh;
}
</style>
