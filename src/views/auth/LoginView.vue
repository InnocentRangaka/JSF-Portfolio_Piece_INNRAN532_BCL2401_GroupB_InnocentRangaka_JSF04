<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/appStore'
import { useUserStore } from '../../stores/userStore'
// import { useUserAuth } from '../../utils/useUserFetch.js'
import EyeOn from '../../components/icons/EyeOn.vue'
import EyeOff from '../../components/icons/EyeOff.vue'
import displayError from '../../components/alerts/displayError.vue'


/**
 * Application store for managing global state.
 * @type {ReturnType<typeof useAppStore>}
 */
const appStore = useAppStore()
const userStore = useUserStore()

const { getCart } = appStore;
const { loginUser, setAuthentication, setLoggedInUser } = userStore;

const router = useRouter(),
email = ref(''),
password = ref(''),
showPassword = ref(false),
credentialsError = ref({
  username: {},
  password: {}
}),
loginError = computed(() => appStore.error),
currentLocation = computed(() => userStore.currentProtectedLocation),
currentUser = computed(() => appStore.user);

// let loginData = null,
// loginLoading = false;

const goBack = () => {
  router.back()
}

const handleSubmit = async () => {
  credentialsError.value = {}
  loginError.value && appStore.setError(null)
  
  const username = email.value.trim(' '),
  userpassword = password.value;

  const { data, error, loading } = await loginUser(username, userpassword)

  // loginData = data;
  // loginLoading = loading;

  console.log(data)
  
  if(loading.value) console.log('isLoading:', loading)
  
  if (data) {
    if(!currentUser.value){
      setLoggedInUser(data)
    }
    setAuthentication(data.id, data.token)

    getCart(data.id)
    console.log(data.id)
    // console.log(currentLocation.value.path, currentLocation.value)
    const path = currentLocation.value.path;
    
    if(path.startsWith('/auth') || !path){
      router.push('/')
    } else {
      console.log(path)
      router.push(path)
    }

    console.log('Login Successful:', currentUser.value)

  } else if (error.value) {
    appStore.userIsAuthenticated = false;
    if(error.value.code === 'ERR_BAD_REQUEST'){
      appStore.setError(null)

      appStore.setError({
        status: error.value.response.status,
        message: error.value.response.data,
        type: error.value.code,
        input: 'all'
      })
    }

    if(error.value.code === 'ERR_NETWORK'){
      credentialsError.value = {}

      appStore.setError({
        status: error.value.request.status,
        message: error.value.message,
        type: error.value.code
      })
    }

    loginError;

    console.log('Login Error:', error.value.code, loginError.value, appStore.getError)
  }
}

const handlePasswordInput = (typedValue) => {
  if(typedValue.length < 6 || typedValue.length > 12){
    credentialsError.value.password = {
        status: 'PSSWD',
        message: 'Password should be 6 to 12 characters.',
        type: 'AUTH',
        input: 'password'
      }
  }
  else {
    credentialsError.value.password = {}
  }
}

const handleShowPassword = () => {
  showPassword.value = !showPassword.value
}

onMounted(() => {
  // Pre-fill with example credentials
  email.value = "mor_2314"
  password.value = "83r5^_"
  // handleSubmit()
})
</script>

<template>
  <div class="container flex items-center mx-auto px-4 py-4 min-h-[44px]">
    <div class="mb-2 text-xs text-left flex items-start mr-auto">
      <a @click="goBack" class="cursor-pointer text-gray-500 hover:text-cyan-900 hover:underline">
        <span class="flex h-full items-center text-xs text-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
          <span class="mb-[0.1rem]">Back</span>
        </span>
      </a>
    </div>
  </div>

  <div
    class="container mx-auto p-8 mb-20 min-h-[600px] h-full max-h-screen w-full items-center justify-center m-auto flex flex-col"
  >
    <div class="flex min-h-full w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 m-auto">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="../../assets/icons/cart.svg" alt="SwiftCart Logo" />
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <displayError :message="loginError?.message"/>

      <div class="bg-white rounded-lg shadow-md mt-10 p-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="handleSubmit" class="space-y-6" action="#" method="POST">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
              >Username / Email address</label
            >
            <div class="mt-2">
              <input
                v-model="email"
                id="username"
                name="username"
                type="text"
                autocomplete="username"
                required
                class="block w-full rounded-md p-2.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <span class="text-xs text-red-700" id="userNameError" v-if="credentialsError.value?.input == 'username'">{{ credentialsError.value.message }}</span>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label 
                for="password" class="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div class="mt-2 relative">
              <input
                v-model="password"
                @input="handlePasswordInput(password)"
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="block w-full rounded-md p-2.5 pr-8 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />

              <button 
                @click="handleShowPassword"
                class="absolute text-gray-900 inset-y-[0.5625rem] end-0 grid place-content-center items-center px-4 h-6 w-6"
              >
                <EyeOn v-if="!showPassword" />
                <EyeOff v-else />
              </button>
              <span class="text-xs text-red-700" id="userPasswordError" v-if="credentialsError.password">{{ credentialsError.password.message }}</span>
            </div>
          </div>

          <div class="flex items-start mb-5">
            <div class="flex items-center h-5">
              <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
            </div>
            <label for="remember" class="ms-2 block text-sm font-medium  text-gray-900">Remember me</label>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <div class="flex items-center justify-between mt-10">
          <div class="block text-sm">
            <router-link
              to="/auth/forgot_password"
              class="font-semibold text-indigo-600 hover:text-indigo-500"
              >Forgot password?</router-link
            >
          </div>

          <p class="block text-center text-sm text-gray-700 leading-6">
            Not a member?
            <router-link
              to="/auth/signup"
              class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >Sign up</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- <button @click="goBack">Go Back</button>
  <div v-if="loginLoading">Loading...</div>
  <div v-if="loginError">Error: {{ error.message }}</div>
  <div v-if="loginData">Token: {{ data.token }}</div> -->
</template>
