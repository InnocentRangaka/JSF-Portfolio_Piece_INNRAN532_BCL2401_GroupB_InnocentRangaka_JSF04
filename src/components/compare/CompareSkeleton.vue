<script setup>
  const columns = 3; // Number of columns in the table (e.g., number of products)
  const rows = 5; // Number of features/rows in the table
</script>
<!-- components/ComparisonSkeleton.vue -->
<template>
    <div class="bg-background mb-10">
        <div class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]">
          <!-- Skeleton for Heading -->
          <div class="h-8 bg-gray-300 rounded-md w-3/4 animate-pulse"></div>
          <div class="mb-2 text-xs text-right flex items-end ml-auto">
            <!-- Skeleton for "Continue shopping" link -->
            <div class="flex h-full items-center animate-pulse">
              <div class="h-6 w-6 bg-gray-300 rounded-full mr-2"></div>
              <div class="h-4 bg-gray-300 rounded-md w-3/4"></div>
            </div>
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
                <!-- Skeleton placeholders for product images -->
                <th v-for="n in columns" :key="n" class="p-4 text-left w-full md:w-auto items-center justify-center">
                  <div class="w-20 h-20 bg-gray-300 animate-pulse rounded-md mx-auto"></div>
                </th>
              </tr>
              <tr>
                <th class="p-4 text-left text-gray-600 bg-background font-medium w-full md:w-auto capitalize place-content-baseline">
                  <div class="w-1/4 h-6 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th v-for="n in columns" :key="n" class="place-content-baseline p-4 text-left text-gray-600 bg-background font-medium w-full md:w-auto">
                  <div class="w-3/4 h-6 bg-gray-300 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Iterate over features -->
              <tr v-for="n in rows" :key="n" class="flex-wrap justify-start items-start place-content-baseline table-row border-b border-gray-200">
                <td class="p-4 text-gray-600 font-medium max-w-fit md:w-auto capitalize w-[83.5px]">
                  <div class="w-1/2 h-6 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td v-for="m in columns" :key="m" class="place-content-baseline p-4 text-gray-600 min-w-[192.5px] w-[31.46%] max-w-[467.66px] md:w-auto">
                  <div class="w-full h-6 bg-gray-300 rounded animate-pulse"></div>
                </td>
              </tr>
              <tr class="flex-wrap table-row">
                <td class="p-4 text-gray-600 font-medium w-full md:w-auto"></td>
                <td v-for="n in columns" :key="n" class="p-4 text-gray-600 w-full md:w-auto">
                  <div class="flex gap-6">
                    <div class="w-1/3 h-6 bg-gray-300 rounded animate-pulse"></div>
                    <div class="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-center mt-10 mb-20">
        <div class="w-1/3 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
</template>

  