import { defineStore } from 'pinia';
// import { onStoreReady } from 'pinia-plugin-onstoreready';
import { useUserAuth, useCreateUser, useUpdateUser, useDeleteUser, decodeJWTUserData, inputValueType } from '../utils/useUserFetch';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,
    userIsAuthenticated: false,
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

      let thisData, thisError, thisLoading;

      if(inputValueType(email).type === 'email'){
        console.log(inputValueType(email).type)
      }
      else {
        const { data, error, loading } = await useUserAuth(email, password);
        thisData = data;
        thisError = error;
        thisLoading = loading;
      }

      if(thisData?.value?.token){
        thisData.value.user = decodeJWTUserData(thisData.value.token);
        this.userIsAuthenticated = true;
      }

      this.user = thisData;
      this.error = thisError;
      this.loading = thisLoading;

      // console.log(thisData)
      return { data: thisData, error: thisError, loading: thisLoading }
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
    isAuthenticated: (state) => !!state.isAuthenticated,
  },

  onStoreReady() {
    // Perform any additional setup or fetch data when the store is ready
    console.log('Store is ready!');
  },

  persist: {
    enabled: true,
    strategies: [
      { key: 'userStore', storage: localStorage },
    ],
  },
});
