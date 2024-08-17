<script setup>
/**
 * Setup script for the main layout component.
 * Handles page structure, loading state, and dynamic component visibility.
 */
import { onMounted, ref, computed, watch } from 'vue'
import { useAppStore } from '../../stores/appStore'
import SearchFilterSort from './SearchFilterSort.vue'
import Footer from './MainFooter.vue'
import Header from './StickyHeader.vue'
import SuccessToast from './SuccessToast.vue'

const appStore = useAppStore()
const { fetchCategories, error } = appStore

const currentLocation = computed(() => appStore.currentLocation),
  // showStaticPart = ref(false),
  showSearchFilterSort = ref(true)

/**
 * Determines whether to show the static part of the layout based on the current page.
 * @returns {void}
 */
const isTopPartShown = (name) => {
  const isAuthPage = appStore.pages.authPages.includes(name)
  const cartPages = appStore.pages.cartPages.includes(name)

  showSearchFilterSort.value = !(isAuthPage || cartPages)
  if(!isAuthPage && !cartPages){ 
    fetchCategories()
  }
}

/**
 * Handles the visibility of the search filter sort component based on the given path name.
 * @param {string} pathName - The current path name.
 * @returns {void}
 */
// const handleShowSearchFilterSort = (pathName) => {
//   const isNotProductShow = pathName.startsWith('/auth') || pathName.startsWith('/cart')
//   showStaticPart.value = !isNotProductShow
// }

/**
 * Watcher for changes in the current location to update component visibility.
 * @param {Object} newValue - The new value of the watched property.
 * @returns {void}
 */
watch(currentLocation, (newLocation) => {
  // console.log(newLocation.componentName, appStore.pageName)
  appStore.pageName
  // handleShowSearchFilterSort(currentLocation.value.path)
  isTopPartShown(newLocation.componentName.toLowerCase())
})
</script>

<template>
  <div>
    <!-- Header -->
    <Header />

    <main>
      <div class="page-content">
        <!-- Search Filter Sort -->
        <SearchFilterSort v-if="showSearchFilterSort" />

        <!-- Error -->
        <div v-if="error" class="w-full flex justify-center">
          <p class="mt-28 text-red-500 text-xl font-bold">
            {{ error.message }}
          </p>
        </div>

        <!-- Content Slot -->
        <slot></slot>
      </div>
    </main>

    <!-- Toast Notification -->
    <SuccessToast />

    <!-- Footer -->
    <Footer />
  </div>
</template>
