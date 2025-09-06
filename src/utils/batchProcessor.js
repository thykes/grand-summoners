// src/utils/batchProcessor.js

import { getFunctions, httpsCallable } from 'firebase/functions';
import { callWithRetry } from './retry';

/**
 * Processes a single batch of items by sending it to a Firebase Cloud Function.
 * This function assumes you have a callable function named 'analyzeUnitsBatch'.
 *
 * @param {Array<Object>} batchOfItems - An array of items (e.g., units) to process.
 * @returns {Promise<any>} The result from the cloud function.
 */
async function processBatch(batchOfItems) {
  // 1. Get a reference to the Firebase Cloud Function.
  const functions = getFunctions();
  const analyzeUnitsBatchCallable = httpsCallable(functions, 'analyzeUnitsBatch');

  // 2. The payload for the cloud function.
  // The batch is sent directly; the cloud function will handle JSON parsing.
  const payload = { batch: batchOfItems };

  // 3. Use the existing retry utility to call the function for analysis.
  console.log(`Processing a batch of ${batchOfItems.length} items...`);
  const result = await callWithRetry(analyzeUnitsBatchCallable, payload, 5);

  return result.data;
}

/**
 * Processes a large array of units in smaller chunks.
 *
 * @param {Array<Object>} allUnits - The entire array of units to process.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of all results.
 */
export async function processAllUnitsInBatches(allUnits) {
  const batchSize = 50;
  const allUnitResults = [];

  console.log(`Starting batch processing for ${allUnits.length} units...`);

  // Create a loop that processes the array in chunks of 50.
  for (let i = 0; i < allUnits.length; i += batchSize) {
    const chunk = allUnits.slice(i, i + batchSize);

    // Inside the loop, call the processBatch function with the current chunk.
    try {
      const batchResult = await processBatch(chunk);
      // Store the results from each call in the new array.
      allUnitResults.push(batchResult);
    } catch (error) {
      console.error(`Failed to process batch starting at index ${i}:`, error);
      // Optional: decide if you want to stop on failure or continue.
    }
  }

  console.log("Batch processing complete.");
  return allUnitResults;
}