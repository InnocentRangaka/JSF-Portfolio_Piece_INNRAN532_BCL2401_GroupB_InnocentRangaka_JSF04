<script setup></script>

<template>
  <div class="bg-gray-100 mb-10 animate-pulse">
    <div class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]">
      <div class="h-8 bg-gray-300 rounded w-40"></div>
      <div class="mb-2 text-xs text-right flex items-end ml-auto">
        <div class="h-4 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  </div>

  <div class="container mx-auto mb-4">
    <div class="grid grid-cols-1 gap-3 relative">
      <div class="grid grid-cols-1 md:grid-cols-3 h-fit gap-3 relative">
        <!-- Order Status Skeleton -->
        <div class="w-full h-full text-slate-600 bg-white p-8 rounded-lg shadow-md relative">
          <div class="h-6 bg-gray-300 rounded w-36 mb-4"></div>
          <div class="h-4 bg-gray-300 rounded w-full mb-4"></div>
          <!-- Progress bar -->
          <div class="relative mt-2 mb-4">
            <div class="h-2 bg-gray-200 rounded-full"></div>
            <div class="h-2 bg-gray-300 rounded-full mt-2"></div>
          </div>

          <div class="mt-4 space-y-4">
            <div class="flex justify-between">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>

        <!-- Shipping Address Skeleton -->
        <div class="w-full h-full text-slate-600 bg-white p-8 rounded-lg shadow-md relative">
          <div class="h-6 bg-gray-300 rounded w-36 mb-4"></div>
          <div class="space-y-4">
            <div class="h-4 bg-gray-300 rounded w-full"></div>
            <div class="h-4 bg-gray-300 rounded w-full"></div>
            <div class="h-4 bg-gray-300 rounded w-full"></div>
          </div>

          <div class="mt-4 h-6 bg-gray-300 rounded w-36 mb-4"></div>
          <div class="h-4 bg-gray-300 rounded w-full"></div>
        </div>

        <!-- Order Summary Skeleton -->
        <div class="w-full h-full text-slate-600 bg-white p-8 rounded-lg shadow-md relative">
          <div class="h-6 bg-gray-300 rounded w-36 mb-4"></div>
          <div class="space-y-4">
            <div class="flex justify-between">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-4 bg-gray-300 rounded w-24"></div>
              <div class="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>

          <div class="mt-4 h-6 bg-gray-300 rounded w-36 mb-4"></div>
          <div class="flex justify-between">
            <div class="h-4 bg-gray-300 rounded w-24"></div>
            <div class="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div class="flex justify-between mt-4">
            <div class="h-4 bg-gray-300 rounded w-24"></div>
            <div class="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>

      <!-- Product Items Skeleton -->
      <div class="relative bg-white p-8 rounded-lg shadow-md">
        <div v-for="i in 2" :key="i" class="border-b pb-4 mb-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center w-full relative gap-4 sm:gap-10">
              <div class="grid w-[80px]">
                <div class="h-20 bg-gray-300 rounded"></div>
              </div>
              <div class="flex flex-col w-full">
                <div class="h-6 bg-gray-300 rounded w-36 mb-2"></div>
                <div class="h-4 bg-gray-300 rounded w-full"></div>
                <div class="flex gap-4 text-slate-600 flex flex-col sm:flex-row items-center sm:justify-between mt-3">
                  <div class="w-full flex flex-col items-left">
                    <div class="h-4 bg-gray-300 rounded w-24"></div>
                    <div class="h-4 bg-gray-300 rounded w-20 mt-2"></div>
                  </div>
                  <div class="w-full flex flex-0 mx-auto items-center justify-between pt-4 sm:pt-0">
                    <div class="h-6 bg-gray-300 rounded w-10"></div>
                    <div class="h-6 bg-gray-300 rounded w-10 ml-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
