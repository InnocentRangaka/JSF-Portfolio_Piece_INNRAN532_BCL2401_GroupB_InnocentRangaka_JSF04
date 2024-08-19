<script setup>
  import { ref } from 'vue';
  
  const isAdded = ref(false);
  
  // Function to handle adding to compare
  function addToCompare() {
    isAdded.value = !isAdded.value;
    // Add your logic to handle adding the item to a comparison list here
  }
</script>
  
<template>
    <button 
      @click="addToCompare"
      class="cursor-pointer flex items-center gap-2 pr-2 py-2 text-sm text-gray-700 justify-center whitespace-nowrap rounded-lg hover:text-blue-700 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors"
    >
      <span v-if="isAdded" class="inline-flex items-center text-cyan-700 hover:text-blue-700">
        <!-- Check icon for 'Added to Compare' -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
        </svg>
        Compared
      </span>

      <span v-else class="inline-flex items-center">
        <!-- Plus icon for 'Add to Compare' -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Compare
      </span>
    </button>
</template>

  