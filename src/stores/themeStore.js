import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('themeStore', {
  state: () => ({
    theme: 'system', // Default theme
    preferredTheme: 'system',
  }),
  
  actions: {
    setTheme(newTheme) {
        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.theme = prefersDark ? 'dark' : 'light';
        } else {
            this.theme = newTheme;
        }
        document.documentElement.className = newTheme; // Apply the theme to the root element
        this.preferredTheme = newTheme;
        console.log(newTheme)
    },

    setPreferredTheme(newTheme) {
        this.preferredTheme = newTheme;
        // document.documentElement.className = newTheme; // Apply the theme to the root element
    },
    
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.documentElement.className = this.theme;
    },

    setSystemTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // console.log(prefersDark)
        this.setTheme(prefersDark ? 'dark' : 'light');
    }
  },
  
  getters: {
    currentTheme: (state) => state.theme,
    userTheme: (state) => state.preferredTheme,
  },

  persist: {
    enabled: true,
    strategies: [
      { key: 'themeStore', storage: localStorage },
    ],
  },
});
