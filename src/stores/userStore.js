import { defineStore } from 'pinia';
import { onStoreReady } from 'pinia-plugin-onstoreready';
import { useUserAuth, useCreateUser, useUpdateUser, useDeleteUser } from '../utils/useUserFetch';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    users: [],
    loading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    tokenExpiration: null,
  }),
  
  actions: {
    async loginUser(email, password) {
      this.loading = true;
      const { data, error, loading } = await useUserAuth(email, password);
      this.user = data;
      this.error = error;
      this.loading = loading;
    },
    
    async createUser(userData) {
      this.loading = true;
      const { data, error, loading } = await useCreateUser(userData);
      this.user = data;
      this.error = error;
      this.loading = loading;
    },

    async updateUser(userId, userData) {
      this.loading = true;
      const { data, error, loading } = await useUpdateUser(userId, userData);
      this.user = data;
      this.error = error;
      this.loading = loading;
    },

    async deleteUser(userId) {
      this.loading = true;
      const { data, error, loading } = await useDeleteUser(userId);

      if(data.value){
        console.log('Delete User Data:', data.value)
      }
      this.user = null;
      this.error = error;
      this.loading = loading;
    },

    // setToken(token) {
    //     this.accessToken = token
    //     const decoded = jwt.decode(token)
    //     this.tokenExpiration = decoded.exp * 1000
    //     this.scheduleTokenRefresh()
    // },

    // async refreshAccessToken() {
    //   try {
    //     const response = await axios.post('https://fakestoreapi.com/auth/refresh', { token: this.refreshToken })
    //     const { token } = response.data
    //     this.setToken(token)
    //   } catch (error) {
    //     console.error('Token refresh failed:', error)
    //   }
    // },

    // scheduleTokenRefresh() {
    //     const expirationTime = this.tokenExpiration - Date.now()
    //     const refreshTime = expirationTime - parseInt(import.meta.env.VITE_REFRESH_TOKEN_INTERVAL) * 60 * 1000
  
    //     setTimeout(() => {
    //       this.refreshAccessToken()
    //     }, refreshTime)
    // },
    
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  onStoreReady() {
    // Perform any additional setup or fetch data when the store is ready
    console.log('Store is ready!');
  }
});
