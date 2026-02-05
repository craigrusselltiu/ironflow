/**
 * Fetch ALL exercises from ExerciseDB API and merge with existing
 * Run with: node scripts/fetch-all-exercises.cjs
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'https://exercisedb.dev/api/v1/exercises';
const EXERCISES_PATH = path.join(__dirname, '../src/data/exercises.json');
const BATCH_SIZE = 100;
const DELAY_MS = 5000; // 5 second delay to avoid rate limits

function transformExercise(apiExercise) {
  return {
    id: apiExercise.exerciseId,
    name: apiExercise.name,
    bodyPart: apiExercise.bodyParts?.[0] || '',
    target: apiExercise.targetMuscles?.[0] || '',
    equipment: apiExercise.equipments?.[0] || '',
    gifUrl: apiExercise.gifUrl || '',
    secondaryMuscles: apiExercise.secondaryMuscles || [],
    instructions: apiExercise.instructions || [],
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchBatch(offset, limit) {
  const url = `${API_BASE}?offset=${offset}&limit=${limit}`;
  console.log(`Fetching offset ${offset}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    exercises: data.data || [],
    total: data.metadata?.totalExercises || 0
  };
}

async function main() {
  // Load existing exercises
  const existingExercises = JSON.parse(fs.readFileSync(EXERCISES_PATH, 'utf-8'));
  const existingIds = new Set(existingExercises.map(e => e.id));

  console.log(`Existing exercises: ${existingExercises.length}`);

  // First fetch to get total count
  const { exercises: firstBatch, total } = await fetchBatch(0, BATCH_SIZE);
  console.log(`API reports ${total} total exercises`);

  const newExercises = [];

  // Process first batch
  for (const apiExercise of firstBatch) {
    const transformed = transformExercise(apiExercise);
    if (!existingIds.has(transformed.id)) {
      newExercises.push(transformed);
      existingIds.add(transformed.id);
    }
  }
  console.log(`  Batch 0: ${newExercises.length} new exercises found`);

  // Fetch remaining batches
  for (let offset = BATCH_SIZE; offset < total; offset += BATCH_SIZE) {
    await sleep(DELAY_MS);

    try {
      const { exercises: batch } = await fetchBatch(offset, BATCH_SIZE);

      if (batch.length === 0) {
        console.log('No more exercises');
        break;
      }

      const prevCount = newExercises.length;
      for (const apiExercise of batch) {
        const transformed = transformExercise(apiExercise);
        if (!existingIds.has(transformed.id)) {
          newExercises.push(transformed);
          existingIds.add(transformed.id);
        }
      }
      console.log(`  Batch ${offset}: ${newExercises.length - prevCount} new (${newExercises.length} total new)`);
    } catch (error) {
      console.error(`Error at offset ${offset}:`, error.message);
      console.log('Stopping due to error. Saving progress...');
      break;
    }
  }

  if (newExercises.length === 0) {
    console.log('No new exercises to add');
    return;
  }

  // Append new exercises
  const allExercises = [...existingExercises, ...newExercises];
  fs.writeFileSync(EXERCISES_PATH, JSON.stringify(allExercises, null, 2));

  console.log(`\nAdded ${newExercises.length} new exercises`);
  console.log(`Total exercises: ${allExercises.length}`);
}

main().catch(console.error);
