<script setup>
    import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
    import { useThemeStore } from '../../stores/themeStore'
    import SunIcon from '../icons/SunIcon.vue';
    import MoonIcon from '../icons/MoonIcon.vue';
    import ComputerIcon from '../icons/ComputerIcon.vue';

    const themeStore = useThemeStore();

    // Toggle dropdown visibility
    // const toggleDropdown = () => {
    // dropdownOpen.value = !dropdownOpen.value;
    // };

    // Function to set the theme
    const setTheme = (newTheme) => {
        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeStore.setTheme(prefersDark ? 'dark' : 'light');
        } else {
            themeStore.setTheme(newTheme);
        }
        themeStore.setPreferredTheme(newTheme);
    };

    // Watch for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (themeStore.userTheme === 'system') {
            themeStore.setTheme(e.matches ? 'dark' : 'light');
            themeStore.setPreferredTheme('system');
        }
    });

    const isOpen = ref(false)
    const dropdownButton = ref(null)
    const dropdownList = ref(null);

    function toggleDropdown() {
        isOpen.value = !isOpen.value
    }

    function selectOption(option) {
        setTheme(option)
    console.log(`Selected option: ${option}`)
        isOpen.value = false
    }

    function handleOutsideClick(event) {
        if(isOpen.value){
            if (!dropdownButton.value.contains(event.target) && !dropdownList.value.contains(event.target)) {
                isOpen.value = false
            }
        }  
    }

    onMounted(() => {
        themeStore.setSystemTheme()
        document.addEventListener('click', handleOutsideClick)
    })

    onUnmounted(() => {
        document.removeEventListener('click', handleOutsideClick)
    })
   
</script>
  
<template>
    
    <div class="relative inline-block theme-toggle text-gray-700 ">
        <button v-if="themeStore.currentTheme === 'light'" ref="dropdownButton" @click="toggleDropdown" 
            :class="[
                'group text-gray-700 hover:bg-transparent md:hover:text-blue-700 hover:bg-background inline-flex w-[32px] h-[32px] rounded-full justify-center items-center focus:outline-none focus:ring-2 focus:ring-gray-200',
                { 'md:hover:text-blue-700': themeStore.currentTheme === 'light' }
            ]"
        >
            <SunIcon />
        </button>
        <button v-if="themeStore.currentTheme === 'dark'" ref="dropdownButton" @click="toggleDropdown" 
            :class="[
                'group text-gray-700 hover:bg-transparent md:hover:text-blue-700 hover:bg-background inline-flex w-[32px] h-[32px] rounded-full justify-center items-center focus:outline-none focus:ring-2 focus:ring-gray-200',
                { 'md:hover:text-blue-700': themeStore.currentTheme === 'dark' }
            ]"
        >
            <MoonIcon />
        </button>
        <button v-if="themeStore.currentTheme === 'system'" ref="dropdownButton" @click="toggleDropdown" 
            :class="[
                'group text-gray-700 hover:bg-transparent md:hover:text-blue-700 hover:bg-background inline-flex w-[32px] h-[32px] rounded-full justify-center items-center focus:outline-none focus:ring-2 focus:ring-gray-200',
                { 'md:hover:text-blue-700': themeStore.currentTheme === 'system' }
            ]"
        >
            <ComputerIcon />
        </button>
        <ul
          v-if="isOpen"
          class="absolute right-0 mt-2 w-48 bg-background-secondary rounded-md shadow-md"
          ref="dropdownList"
        >
          <li
            class="group flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-background text-gray-700 hover:text-blue-700"
            @click="selectOption('light')"
          >
            <SunIcon class="text-gray-700 group-hover:text-blue-700" /> Light
          </li>
          <li
            class="group flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-background text-gray-700 hover:text-blue-700"
            @click="selectOption('dark')"
          >
            <MoonIcon class="text-gray-700 group-hover:text-blue-700" /> Dark
          </li>
          <li
            class="group flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-background text-gray-700 hover:text-blue-700"
            @click="selectOption('system')"
          >
            <ComputerIcon class="text-gray-700 group-hover:text-blue-700" /> System
          </li>
        </ul>
      </div>

</template>

  