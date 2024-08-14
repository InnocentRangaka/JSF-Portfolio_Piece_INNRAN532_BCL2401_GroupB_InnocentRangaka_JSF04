import { ref } from 'vue'
import axios from 'axios'
import { decodeJWTUserData } from './useSecurity'

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

export const useCreateUser = async (userDataObject) => {
    const body = JSON.stringify(userDataObject)
    const { data, error, loading, fetchData } = useUserFetch('users', 'POST', body)
    await fetchData()
    
    return { data, error, loading }
}

export const useUpdateUser = async (userId, userDataObject) => {
    const body = JSON.stringify(userDataObject)
    const { data, error, loading, fetchData } = useUserFetch(`users/${userId}`, 'PUT', body)
    await fetchData()
    
    return { data, error, loading }
}

export const useDeleteUser = async (userId) => {
    const { data, error, loading, fetchData } = useUserFetch(`users/${userId}`, 'DELETE', null)
    await fetchData()
    
    return { data, error, loading }
}

export const useGetUserData = async (userId) => {
  const { data, error, loading } = useUserFetch(`users/${userId}`)
  
  return { data, error, loading }
}


export const fetchUserData = async (username, password) => {
  
    const { data, error, loading} = await useUserAuth(username, password)
  
    // **Assuming the response contains a JWT token property:**
    if (data.value.token) {
      const decodedToken = decodeJWTUserData(data.value.token);
      // console.log('Decoded JWT:', decodedToken);
      data.value.user = {
        id: decodedToken.sub,
        username: decodedToken.user,
      }
    } else {
      console.log('Login response did not contain a JWT token');
    }
  
    // Return the entire response data for further usage
    return { data, error, loading};
}