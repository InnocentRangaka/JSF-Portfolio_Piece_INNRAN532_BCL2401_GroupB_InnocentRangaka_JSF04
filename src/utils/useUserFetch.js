import { ref } from 'vue'
import axios from 'axios'


axios.defaults.baseURL = 'https://fakestoreapi.com/'

/**
 * A custom hook to fetch user data.
 *
 * @param {string} url - The API endpoint.
 * @param {string} method - The HTTP method (e.g., 'POST', 'GET').
 * @param {Object} [bodyData=null] - The request body data.
 * @returns {Object} The data, error, loading state, and fetchData function.
 */
export const useUserFetch = (url, method, bodyData = null) => {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios({
        method: method,
        url: url,
        data: bodyData,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      data.value = response.data
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, fetchData }
}

export const useUserAuth = async (userEmail, userPassword) => {
    const body = JSON.stringify({
      username: userEmail,
      password: userPassword,
    })
    const { data, error, loading, fetchData } = useUserFetch('auth/login', 'POST', body)
    await fetchData()
    
    return { data, error, loading }
}