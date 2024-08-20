<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAppStore } from '../stores/appStore'
import NoItemFound from '../components/includes/NoItemFound.vue'
import CompareSkeleton from '../components/compare/CompareSkeleton.vue';

const appStore = useAppStore()
const { fetchCompareListItems, removeAllCompareListItems, addToCart, removeCompareListItem } = appStore
const products = computed(() => appStore.products)
const compareList = computed(() => appStore.compareList)
const compareListItems = computed(() => appStore.compareList?.totalItems)
const compareListIds = computed(() => appStore.compareList?.items)
const loading = ref(appStore.loading)
const error = ref(appStore.error)


const features = ref([])
// Extract the unique features for comparison
const desiredOrder = ['description', 'rating', 'price'];

const createFeatures = () => {
  let featuresMap = products.value ? ref([...new Set(products.value.flatMap(product => Object.keys(product)))]) : features.value;
  features.value = Object.values(featuresMap.value).filter(feature => !['id', 'image', 'title'].includes(feature)).sort((a, b) => {
    return desiredOrder.indexOf(a) - desiredOrder.indexOf(b);
  });
}

const compareListProducts = async () => {
  const idArray = compareListIds?.value && Object.keys(compareListIds.value) || [];
  await fetchCompareListItems(idArray)
  createFeatures();
}

const goldenStar = `
    <svg class="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
    </svg>
  `,
grayStar = `
    <svg class="w-4 h-4 ms-1 text-gray-300 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
    </svg>
  `;

onMounted(async () => {
  await compareListProducts()
})

watch(compareListIds, async () => {
  await compareListProducts()
});

watch(compareList, async () => {
  await compareListProducts()
});

// watch(products, async () => {
//   await compareListProducts()
// });

</script>

<template>
  <div v-if="compareListItems > 0">
    <div v-if="loading.products"
      
    >
      <CompareSkeleton />
    </div>

    <div v-else>
      <div class="bg-gray-100 mb-10">
        <div
          class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]"
        >
          <h1 class="text-gray-800 text-xl font-bold my-2">Compare Products ({{ compareListItems }})</h1>
          <div class="mb-2 text-xs text-right flex items-end ml-auto">
            <a href="/" class="cursor-pointer text-gray-900 hover:text-cyan-900 hover:underline">
              <span class="flex h-full items-center text-xs text-right">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="currentColor"
                >
                  <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                </svg>
                <span class="mb-[0.1rem]">Continue shopping</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    
      <div class="container mx-auto mb-8">
        <div class="grid grid-cols-1 relative">
          <div class="overflow-x-auto">
            <table class="w-full bg-white border border-gray-200">
              <thead>
                <tr class="flex-wrap table-row">
                  <th class="p-4 text-left w-full md:w-auto"></th>
                  <th v-for="(product, index) in products" :key="index" class="p-4 text-left w-full md:w-auto items-center justify-center">
                    <router-link :to="`/product/${product.id}`" class="flex-1 flex flex-col mx-auto w-fit">
                      <img
                        class="object-contain max-w-20 mt-3 cursor-pointer"
                        :src="product.image"
                        :alt="product.title"
                      />
                    </router-link>
                  </th>
                </tr>
      
                <tr>
                  <th class="p-4 text-left text-gray-600 bg-gray-100 font-medium w-full md:w-auto capitalize place-content-baseline">Title</th>
                  <th v-for="(product, index) in products" :key="index" class="place-content-baseline p-4 text-left text-gray-600 bg-gray-100 font-medium w-full md:w-auto">
                    <router-link :to="`/product/${product.id}`" class="">
                      {{ product.title }}
                    </router-link>
                  </th>
                </tr>
    
              </thead>
              <tbody>
                <!-- Iterate over features -->
                <tr v-for="(feature, index) in features" :key="index" class="flex-wrap justify-start items-start place-content-baseline table-row border-b border-gray-200">
                  <td class="p-4 text-gray-600 font-medium max-w-fit md:w-auto capitalize w-[83.5px]">{{ feature }}</td>
                  <!-- Iterate over products to display feature values -->
                  <td v-for="(product, productIndex) in products" :key="productIndex" class="place-content-baseline p-4 text-gray-600 min-w-[192.5px] w-[31,46%] max-w-[467.66px] md:w-auto">
                    <!-- Handle nested objects like rating -->
                    <span v-if="typeof product[feature] === 'object'" class="flex capitalize items-center">
                      <span class="mr-2" v-html="product[feature].rate > 0 ? goldenStar : grayStar"></span>
                      {{ product[feature].rate || 0 }}/5 ({{ product[feature].count || 0 }} reviews)
                    </span>
                    <span v-else-if="feature === 'price'" class="flex">
                      {{ appStore.currency }} {{ product.price.toFixed(2) }}
                    </span>
                    <span v-else-if="feature === 'description'" class="h-full">
                      {{ product[feature].charAt(0).toUpperCase() + product[feature].slice(1) || 'N/A' }}
                    </span>
                    <span v-else class="capitalize">
                      {{ product[feature] || 'N/A' }}
                    </span>
                  </td>
                </tr>
                <tr class="flex-wrap table-row">
                  <td class="p-4 text-gray-600 font-medium w-full md:w-auto"></td>
                  <td v-for="(product, index) in products" :key="index" class="p-4 text-gray-600 w-full md:w-auto">
                    <div class="flex gap-6">
                      <button
                        @click="(event) => removeCompareListItem(product, event.target)"
                        class="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <button
                        :id="`add-to-cart-${product.id}`"
                        @click="addToCart(product)"
                        class="cursor-pointer inline-flex flex-1 justify-center whitespace-nowrap rounded-lg bg-cyan-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-900 focus:bg-cyan-900 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors"
                      >
                        {{ appStore.cart.addToCartText }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    
        <div
          class="flex justify-center mt-10 mb-20"
        >
          <button
            @click="() => removeAllCompareListItems()"
            class="text-xs text-gray-900 hover:text-cyan-900 hover:underline"
          >
            Remove All
          </button>
        </div>
        
      </div>
    </div>
  </div>

  <NoItemFound v-else name="compare list" />
</template>

<style scoped>
/* Optional styling */
</style>
