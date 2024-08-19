<script setup>
import { ref } from 'vue';
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

// Define the products and their features
const products = ref([
  {
    id: 9,
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 64,
    rating: { rate: 3.3, count: 203 },
    description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
  },
  // Repeat the product object for three products
  {
    id: 10,
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 64,
    rating: { rate: 3.3, count: 203 },
    description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
  },
  {
    id: 11,
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 64,
    rating: { rate: 3.3, count: 203 },
    description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
  }
]);

// Extract the unique features for comparison
const desiredOrder = ['description', 'rating', 'price'];

const features = ref([...new Set(products.value.flatMap(p => Object.keys(p)))]);
features.value = features.value.filter(f => !['id', 'image', 'title'].includes(f)).sort((a, b) => {
  return desiredOrder.indexOf(a) - desiredOrder.indexOf(b);
});

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
</script>

<template>
  <div class="bg-gray-100 mb-10">
    <div
      class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]"
    >
      <h1 class="text-gray-800 text-xl font-bold my-2">Shopping Cart ({{ totalItems }})</h1>
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
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Compare Products</h2>
    <div class="grid grid-cols-1 relative">
      <div class="overflow-x-auto">
        <table class="w-full bg-white border border-gray-200">
          <thead>
            <tr class="flex flex-wrap table-row">
              <th class="p-4 text-left w-full md:w-auto"></th>
              <th v-for="(product, index) in products" :key="index" class="p-4 text-left w-full md:w-auto">
                <router-link :to="`/product/${product.id}`" class="flex-1 flex flex-col">
                  <img
                    class="object-contain max-h-48 mt-3 cursor-pointer"
                    :src="product.image"
                    :alt="product.title"
                  />
                </router-link>
              </th>
            </tr>
  
            <tr>
              <th class="p-4 text-left text-gray-600 bg-gray-100 font-medium w-full md:w-auto capitalize">Title</th>
              <th v-for="(product, index) in products" :key="index" class="p-4 text-left text-gray-600 bg-gray-100 font-medium w-full md:w-auto">
                <router-link :to="`/product/${product.id}`" class="">
                  {{ product.title }}
                </router-link>
              </th>
            </tr>

          </thead>
          <tbody>
            <!-- Iterate over features -->
            <tr v-for="(feature, index) in features" :key="index" class="flex flex-wrap table-row border-b border-gray-200">
              <td class="p-4 text-gray-600 font-medium w-full md:w-auto capitalize">{{ feature }}</td>
              <!-- Iterate over products to display feature values -->
              <td v-for="(product, productIndex) in products" :key="productIndex" class="p-4 text-gray-600 w-full md:w-auto">
                <!-- Handle nested objects like rating -->
                <span v-if="typeof product[feature] === 'object'" class="flex items-center">
                  <span class="mr-2" v-html="product[feature].rate > 0 ? goldenStar : grayStar"></span>
                  {{ product[feature].rate || 0 }}/5 ({{ product[feature].count || 0 }} reviews)
                </span>
                <span v-else-if="feature === 'price'" class="flex items-center">
                  {{ appStore.currency }} {{ product.price.toFixed(2) }}
                </span>
                <span v-else class="">
                  {{ product[feature] || 'N/A' }}
                </span>
              </td>
            </tr>
            <tr class="flex flex-wrap table-row">
              <td class="p-4 text-gray-600 font-medium w-full md:w-auto"></td>
              <td v-for="(product, index) in products" :key="index" class="p-4 text-gray-600 w-full md:w-auto">
                <button
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
/* Optional styling */
</style>
