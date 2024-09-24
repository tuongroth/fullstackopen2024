interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises(dailyHours: number[], target: number): ExerciseResult {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(day => day > 0).length;
  const totalHours = dailyHours.reduce((total, hours) => total + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  // Simple rating system
  if (average >= target) {
    rating = 3;
    ratingDescription = 'Great job! You met your target!';
  } else if (average >= target * 0.7) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'You need to improve your consistency';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
}

// Test the function with hardcoded values
const result = calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2);
console.log(result);
