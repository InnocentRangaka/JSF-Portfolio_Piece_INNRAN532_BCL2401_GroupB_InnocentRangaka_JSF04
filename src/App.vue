<script setup>
import { onMounted, computed, watch } from 'vue'
import axios from 'axios'
import router from './router'
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/appStore'
import Layout from './components/includes/MainLayout.vue'

axios.defaults.baseURL = 'https://fakestoreapi.com/'

/**
 * Setup script for the main component of the Vue application.
 * This script handles initial data fetching, router hooks, and page loading state.
 *
 * @module MainComponentSetup
 */

// Import the app store to manage application state
const appStore = useAppStore()

const currentLocation = computed(() => appStore.currentLocation)
// const Layout = computed(() => appStore.currentLayout)

appStore.error = null

/**
 * Fetch categories data when the component is initialized.
 * This function fetches categories and updates the store with the data.
 */
// appStore.fetchCategories()

/**
 * Router afterEach hook to update the current location in the store.
 * This hook runs after each route change and updates the app store with the current and previous route details.
 *
 * @param {Object} to - The target Route Object being navigated to.
 * @param {Object} from - The current Route Object being navigated away from.
 */
router.afterEach((to, from) => {

  appStore.currentLocation = {
    path: to.path,
    params: to.params,
    query: to.query,
    route: to.route,
    userData: to.userData,
    componentName: to.componentName || to.name,
    redirectedFrom: to.redirectedFrom,
    previous: {
      path: from.path,
      params: from.params,
      query: from.query,
      route: from.route,
      userData: from.userData,
      componentName: from.componentName || from.name
    }
  }

  // console.log(to)
  // console.log(from)

})

// Define a computed property to dynamically import the correct layout component
// const layout = computed(() => appStore.currentLayout)

/**
 * onMounted lifecycle hook to set page loading state.
 * This hook runs when the component is mounted and sets a timeout to change the loading state in the app store.
 */
onMounted(async () => {
  setTimeout(() => {
    appStore.setPageLoading(false)
  }, 2000)
})

// Update layout based on the current path
watch(
  currentLocation,
  (newLocation) => {
    // appStore.updateLayout(newLocation.path)
    // console.log(newLocation)
  },
  { immediate: true }
)
</script>

<template>
  <!-- Computed layout -->
  <!-- <component :is="appStore.currentLayout.component" :key="appStore.currentLayout.name">
    <RouterView />
  </component> -->
  <Layout><RouterView /></Layout>
</template>
