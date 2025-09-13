/**
 * Environment variable validation utility
 */

// List of required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
];

/**
 * Validate required environment variables
 * @returns {boolean} True if all required env vars are present, false otherwise
 */
export const validateEnvVariables = () => {
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    return false;
  }
  
  console.log('✅ All required environment variables are present');
  return true;
};

/**
 * Get API base URL with validation
 * @returns {string|null} API base URL or null if invalid
 */
export const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('❌ NEXT_PUBLIC_API_URL is not defined');
    return null;
  }
  
  // Basic URL validation
  try {
    new URL(apiUrl);
    return apiUrl;
  } catch (error) {
    console.error('❌ Invalid NEXT_PUBLIC_API_URL:', apiUrl);
    return null;
  }
};