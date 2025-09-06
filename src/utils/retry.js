// src/utils/retry.js

/**
 * A utility to wrap an async function call with a retry mechanism.
 * @param {Function} apiCall - The async function to call (e.g., a Firebase callable).
 * @param {any} payload - The payload to pass to the async function.
 * @param {number} maxRetries - The maximum number of times to retry on failure.
 * @returns {Promise<any>} - A promise that resolves with the result of the apiCall.
 * @throws Will throw an error if all retry attempts fail.
 */
export async function callWithRetry(apiCall, payload, maxRetries = 5) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await apiCall(payload); // Success, return the result
    } catch (error) {
      attempt++;
      console.warn(`Attempt ${attempt} of ${maxRetries} failed:`, error.message);
      if (attempt >= maxRetries) {
        throw new Error(`All ${maxRetries} attempts failed. Last error: ${error.message}`);
      }
    }
  }
}