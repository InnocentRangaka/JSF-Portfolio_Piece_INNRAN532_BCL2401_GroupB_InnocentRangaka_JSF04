<script setup>
import { watch, ref, onMounted, computed } from 'vue'
import { useAppStore } from '../../stores/appStore'
import { useUserStore } from '../../stores/userStore'
import RatingStars from '../icons/RatingStars.vue'
import CompareButton from '../compare/CompareButton.vue';

/**
 * Application store for managing global state, including products, cart, and wishlist.
 * @type {ReturnType<typeof useAppStore>}
 */
const appStore = useAppStore()
const userStore = useUserStore()

const { isInWishList, addToCart, addToFavourites, fetchProducts } = appStore

/**
 * Reactive reference to store the current products.
 * @type {Ref<Array>}
 */
let currentProducts = ref(appStore.products),
user = computed(() => userStore.user);

// Fetch products on component mount
onMounted(async () => {
  if(appStore.currentLocation.path === '/'){
    if(Object.values(appStore.products).length < 20){
      fetchProducts();
    }
  }
  // const DataProducts = applyDiscounts(appStore, currentProducts.value.slice());
  //  console.log(DataProducts)
  currentProducts.value = appStore.products
})

// Watch for changes in products and update the reference
watch(
  appStore.products, 
  (newProducts) => {
    currentProducts.value = newProducts
    appStore.getProducts
    // appStore.products
    if(Object.values(currentProducts) === 0){
      fetchProducts();
      currentProducts.value = appStore.products;
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    v-show="!appStore.loading.products"
    class="container mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none my-4 px-2 md:px-0"
  >
    <div
      v-for="product in appStore.products"
      :key="product.id"
      class="flex flex-col relative max-h-[130rem] max-w-80 bg-background-secondary hover:-translate-y-1 hover:scale-105 duration-300 border border-color shadow shadow-slate-950/5 rounded-2xl overflow-hidden"
    >
      <!-- 10% Off Label -->
      <span
        v-if="product?.discount"
        class="absolute z-[1] top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 -ml-[0.5px] rounded-xl "
      >
        {{ product.discount }}<br>Off
      </span>
      <router-link :to="`/product/${product.id}`" class="z-0 flex-1 flex flex-col relative  bg-white border rounded-xl w-[95%] mt-2 mx-auto">
        <img
          class="object-contain h-48 cursor-pointer"
          :src="product.image"
          :alt="product.title"
        />
      </router-link>
      <div class="flex-1 flex flex-col p-6 items-start">
        <div class="flex-1">
          <header class="mb-2 flex-2">
            <div
              class="text-slate-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 min-h-[49.5px]"
            >
              <router-link :to="`/product/${product.id}`">
                <h2 class="cursor-pointer text-md line-clamp-2 font-bold leading-snug">
                  {{ product.title }}
                </h2>
              </router-link>
            </div>
          </header>
          <div
            v-if="product.rating"
            class="flex -ml-2 mb-2 place-items-center items-center justify-between"
          >
            <div class="justify-start items-left flex-1">
              <RatingStars :ratingNumber="product.rating.rate" />
            </div>
            <div class="justify-end items-right flex-0">
              <span
                class="ml-auto inline-flex items-center justify-end rounded-md px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
              >
                {{ product.category }}
              </span>
            </div>
          </div>
          <div class="flex w-fulltext-base line-clamp-2 font-extrabold text-slate-600 leading-snug">
            <h2>{{ appStore.currency }} {{ parseFloat(product.price).toFixed(2) }}</h2>
            <p v-if="product?.originalPrice" class="ml-4 text-gray-500 line-through">{{ appStore.currency }} {{ parseFloat(product.originalPrice).toFixed(2) }}</p>
          </div>
        </div>
        <div class="flex w-full mt-1 space-x-2 place-items-center">
          <div class="flex w-full justify-end space-x-2 mt-2 place-items-center items-center">
            <CompareButton v-if="user?.id" :productId="product.id" />
            <button
              class="bg-transparent flex-0"
              :class="
                isInWishList(product.id)
                  ? 'cursor-pointer text-red-500'
                  : 'cursor-pointer text-gray-700'
              "
              @click="addToFavourites(product.id)"
            >
              <svg
                class="me-1.5 h-5 w-5 hover:fill-red-500 hover:text-red-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                transform="scale(1.6)"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                />
              </svg>
            </button>
            <button
              :id="`add-to-cart-${product.id}`"
              @click="addToCart(product)"
              class="cursor-pointer inline-flex flex-1 justify-center whitespace-nowrap rounded-lg bg-cyan-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-900 focus:bg-cyan-900 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors"
            >
              {{ appStore.cart.addToCartText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
