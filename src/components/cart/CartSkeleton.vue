<script></script>

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
  
  <div class="container mx-auto mb-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
      <!-- Skeleton for Cart Items -->
      <div class="col-span-2 relative bg-background-secondary p-8 rounded-lg shadow-md">
        <div v-for="n in 3" :key="n" class="border-b pb-4 mb-4 animate-pulse">
          <div class="flex justify-between items-center">
            <div class="flex items-center w-full relative gap-4 sm:gap-10">
              <!-- Skeleton for image -->
              <div class="w-20 h-20 bg-gray-300 rounded-md"></div>
              <div class="flex flex-col w-full">
                <!-- Skeleton for title -->
                <div class="h-4 bg-gray-300 rounded-md w-3/4 mb-2"></div>
                <!-- Skeleton for description -->
                <div class="h-3 bg-gray-200 rounded-md w-full mb-2"></div>
                <div class="h-3 bg-gray-200 rounded-md w-1/2"></div>
                <div class="flex gap-4 text-slate-600 flex flex-col sm:flex-row items-center sm:justify-between mt-3">
                  <!-- Skeleton for price -->
                  <div class="w-1/4 h-5 bg-gray-300 rounded-md"></div>
                  <!-- Skeleton for quantity dropdown -->
                  <div class="w-24 h-10 bg-gray-200 rounded-md"></div>
                  <!-- Skeleton for remove button -->
                  <div class="w-16 h-5 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Skeleton for Order Summary -->
      <div class="col-span-2 sm:col-span-1 text-slate-600 bg-background-secondary p-8 rounded-lg shadow-md relative animate-pulse">
        <div class="h-4 bg-gray-300 rounded-md w-1/2 mb-4"></div>
        <div class="flex justify-between mb-2">
          <div class="h-4 bg-gray-200 rounded-md w-1/4"></div>
          <div class="h-4 bg-gray-200 rounded-md w-1/4"></div>
        </div>
        <div class="flex justify-between mb-2">
          <div class="h-4 bg-gray-200 rounded-md w-1/3"></div>
          <div class="h-4 bg-gray-200 rounded-md w-1/4"></div>
        </div>
        <div class="flex justify-between font-semibold text-lg mb-8">
          <div class="h-5 bg-gray-300 rounded-md w-1/2"></div>
          <div class="h-5 bg-gray-300 rounded-md w-1/4"></div>
        </div>
        <div class="h-10 bg-cyan-700 rounded-md"></div>
        <div class="flex justify-center mt-10">
          <div class="h-4 bg-gray-200 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
</template>
