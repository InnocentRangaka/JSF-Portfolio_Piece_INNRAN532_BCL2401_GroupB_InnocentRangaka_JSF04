<script setup>
    import { ref, watch, computed } from 'vue';
    import { useAppStore } from '../../stores/appStore'

    const appStore = useAppStore()

    const isAdded = ref(false),
    isDisabled = ref(false),
    list = computed(() => appStore.compareList),
    totalItems = computed(() => appStore.compareList.totalItems);

    const { compareList, addToCompareList, isInCompareList} = appStore;

    // Define the `ratingNumber` prop
    const props = defineProps({
        productId: {
            type: Number,
            required: true
        }
    })

    // Function to handle adding to compare
    function addToCompare(productId) {
      const isInList = isInCompareList(productId);
      if(totalItems.value < 3 || isInList){
        addToCompareList(productId)
        isAdded.value = !isAdded.value;
        // console.log('N', props.productId, isDisabled.value)
      } else {
        console.log(isInList, compareList.totalItems, totalItems.value)
        appStore.showErrorToast('Product removed to compare list!');
      }
    }

    // watch(totalItems, (newTotal) => {
    //   console.log(newTotal)
    // })
</script>
  
<template>
    <button 
      @click="addToCompare(props.productId)"
      class="cursor-pointer flex items-center gap-2 pr-2 py-2 text-sm text-gray-700 justify-center whitespace-nowrap rounded-lg hover:text-blue-700 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors"
    >
      <span v-if="isInCompareList(props.productId)" class="inline-flex items-center text-cyan-700 hover:text-blue-700">
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

  