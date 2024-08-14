import { defineStore } from 'pinia';
// import { onStoreReady } from 'pinia-plugin-onstoreready';
import { useUserAuth, useCreateUser, useUpdateUser, useDeleteUser } from '../utils/useUserFetch';
import { decodeJWTUserData, inputValueType } from '../utils/useSecurity';
import { fetchUserDataByToken } from '../api/api'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {},
    userIsAuthenticated: false,
    users: [],
    loading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    tokenExpiration: null,
    currentProtectedLocation: {
      /**
       * Current path.
       * @type {string}
       */
      path: '',

      /**
       * Current URL parameters.
       * @type {string}
       */
      params: '',

      /**
       * Current URL query string.
       * @type {string}
       */
      query: '',

      /**
       * Current route name.
       * @type {string}
       */
      route: '',

      /**
       * User data related to the current location.
       * @type {string}
       */
      userData: '',

      /**
       * Current component name.
       * @type {string}
       */
      componentName: '',

      /**
       * Object containing previous location details.
       * @type {Object}
       */
      previous: {
        /**
         * Previous path.
         * @type {string}
         */
        path: '',

        /**
         * Previous URL parameters.
         * @type {string}
         */
        params: '',

        /**
         * Previous URL query string.
         * @type {string}
         */
        query: '',

        /**
         * Previous route name.
         * @type {string}
         */
        route: '',

        /**
         * User data related to the previous location.
         * @type {string}
         */
        userData: '',

        /**
         * Previous component name.
         * @type {string}
         */
        componentName: '',
      }
    },
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
        const decodedJWT = decodeJWTUserData(thisData.value.token)
        thisData.value.user = {
          id: decodedJWT.sub,
          username: decodedJWT.user,
        };
        console.log('decodedJWT.token:', decodedJWT)
        const { data, error, loading } = await fetchUserDataByToken(thisData.value.token)
        // this.userIsAuthenticated = true;
        if(thisData.value.user.id == data.user.id){
          thisData = {
            ...data.user,
            token: thisData.value.token,
          };
          thisError = error;
          thisLoading = loading;
        }
        else {
          console.log('thisData.value:', thisData.value,  data)
        }
        
      }

      this.user = thisData.value;
      this.error = thisError;
      this.loading = thisLoading;

      console.log(thisData.value, this.user)
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

    setLoggedInUser(userData, token) {
      this.user = userData;
      this.accessToken = token;
      this.userIsAuthenticated = true;
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

    setCurrentProtectedLocation(to, from) {
      this.currentProtectedLocation = {
        path: to.path,
        params: to.params,
        query: to.query,
        route: to.route,
        userData: to.userData,
        componentName: to.componentName || to.name,
        previous: {
          path: from.path,
          params: from.params,
          query: from.query,
          route: from.route,
          userData: from.userData,
          componentName: from.componentName || from.name
        }
      };
    },

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
