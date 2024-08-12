import { ref } from 'vue'
import axios from 'axios'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

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


export const fetchUserData =async (username, password) => {
  
    const { data, error, loading} = await useUserAuth(username, password)

    if (data.value.token) {
      const decodedToken = await decodeJWT(data.value.token);
      console.log('Decoded JWT:', decodedToken);
    } else {
      console.log('Login response did not contain a JWT token');
    }
  
    // Return the entire response data for further usage
    return data;
}
  
/**
 * Creates and encodes a JWT token.
 *
 * @param {object} payload - The data you want to encode in the JWT.
 * @param {object} [options] - Optional settings such as expiresIn.
 * @returns {string} The encoded JWT token.
 */
function createJWT(payload, options = {}) {
    const secretKey = process.env.SECRET_KEY;

    // Sign the JWT with the given payload, secret key, and options
    const token = jwt.sign(payload, secretKey, options);

    return token;
}

  /**
 * Decodes and verifies a JWT token.
 *
 * @param {string} token - The JWT token to decode and verify.
 * @returns {object} The decoded header, payload, and signature.
 */
function decodeJWT(token) {
    const secretKey = process.env.SECRET_KEY;
  
    try {
      // Verify the JWT with the secret key
      const verified = jwt.verify(token, secretKey);
  
      // Split the token into its parts (header, payload, signature)
      const [header, payload, signature] = token.split('.');
  
      // Decode the header and payload from base64Url to JSON
      const decodedHeader = JSON.parse(atob(header));
      const decodedPayload = JSON.parse(atob(payload));
  
      return {
        data: {
        header: decodedHeader,
        payload: decodedPayload,
        signature: signature, // Signature is left encoded for security reasons
        verified: verified // The verified payload
        },
        error: null
     };
    } catch (err) {
      return {
        data: null,
        error: null
     };
    }
}
  
  // Example usage
  (async () => {
    try {
      const username = 'mor_2314';
      const password = '83r5^_';
      const loginData = await fetchUserData(username, password);
      console.log('Login data:', loginData); // Contains response data, including JWT (if available)
    } catch (error) {
      console.error('Login error:', error);
    }
  })();
  