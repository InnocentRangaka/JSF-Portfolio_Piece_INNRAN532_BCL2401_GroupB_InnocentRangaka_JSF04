<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '../../stores/appStore'
import { useUserStore } from '../../stores/userStore'
import { useRouter } from 'vue-router'
import UserIcon from '../icons/UserIcon.vue'
import UserLoggedInIcon from '../icons/UserLoggedInIcon.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()


let pageName = computed(() => router.currentRoute.value.name),
isUserAuthenticated = computed(() => userStore.userIsAuthenticated);

const navigateTo = (path) => {
  router.push(path)
}

const isActivePage = (name) => {
  const routeName = pageName?.value
  let page = routeName?.toLowerCase()
  if (routeName == 'Products') {
    page = router.currentRoute?.value?.params?.category
  }

  return page == name
}

</script>
<template>
    <button 
        v-if="!isUserAuthenticated"
        @click="navigateTo('/auth/login')"
        :class="{
            'text-cyan-700': isActivePage('login'),
            'text-gray-700': !isActivePage('login')
        }"
        class="group inline-flex w-[32px] h-[32px] rounded-full hover:bg-transparent md:hover:text-blue-700 justify-center items-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
        <UserIcon />
    </button>

    <button 
        v-if="isUserAuthenticated"
        @click="navigateTo('/auth/login')"
        :class="{
            'text-cyan-700': isActivePage('login'),
            'text-gray-700': !isActivePage('login')
        }"
        class="group inline-flex w-[32px] h-[32px] rounded-full hover:bg-transparent md:hover:text-blue-700 justify-center items-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
        <UserLoggedInIcon />
    </button>
</template>