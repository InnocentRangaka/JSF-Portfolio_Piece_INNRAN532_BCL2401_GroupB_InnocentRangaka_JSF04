import { jwtDecode } from "jwt-decode";

export function decodeJWToken(token) {
    // Decode the JWT token into its components using jwt-decode
    const decoded = jwtDecode(token);
    
    // Since jwt-decode returns the header and payload in one step, you don't need to manually split the token
    const decodedHeader = decoded.header;
    const decodedPayload = decoded;
  
    // The signature part can't be retrieved using jwt-decode, as it's primarily used for decoding the payload.
    const signature = token.split('.')[2]; // Manually extract the signature
    
    // console.log(decoded);
  
    return {
      header: decodedHeader,
      payload: decodedPayload,
      signature: signature // Signature is left encoded for security reasons
    };
  }
    
  export function decodeJWTUserData(token) {
    // Decode the JWT token and retrieve the payload
    const decoded = jwtDecode(token);
  
    // Extract user data from the decoded payload
    // console.log(decoded?.user);
  
    return decoded;
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