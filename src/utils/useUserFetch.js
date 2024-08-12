import { ref } from 'vue'
import axios from 'axios'
import * as jose from 'jose';


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


export const fetchUserData = async (username, password) => {
  
    const { data, error, loading} = await useUserAuth(username, password)
  
    // **Assuming the response contains a JWT token property:**
    if (data.value.token) {
      const decodedToken = decodeJWTUserData(data.value.token);
    //   console.log('Decoded JWT:', decodedToken);
      data.value.user = decodedToken
    } else {
      console.log('Login response did not contain a JWT token');
    }
  
    // Return the entire response data for further usage
    return { data, error, loading};
  }

 export function decodeJWToken(token) {
    // Split the token into its parts (header, payload, signature)
    const [header, payload, signature] = token.split('.');
  
    // Decode the header and payload from base64Url to JSON
    const decodedHeader = JSON.parse(atob(header));
    const decodedPayload = JSON.parse(atob(payload));

    console.log( jose.decodeJwt(token))
  
    return {
      header: decodedHeader,
      payload: decodedPayload,
      signature: signature // Signature is left encoded for security reasons
    };
}

export function decodeJWTUserData(token) {
  const decoded = jose.decodeJwt(token)

  console.log(decoded?.user )

  return decoded?.user;
}


export function inputValueType(input) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if input matches email pattern
    if (emailRegex.test(input)) {
        return {
            type: 'email',
            value: input
        };
    }

    // Regular expression for username validation
    // Allows optional '@' at the start and supports alphanumeric characters, underscores, and hyphens
    const usernameRegex = /^@?[a-zA-Z0-9_-]+$/;

    if (usernameRegex.test(input)) {
        return {
            type: 'username',
            value: input
        };
    }

    // If neither, return 'invalid'
    return 'invalid';
}