// progress.js

const DEFAULT_PROGRESS = {
  reading: {
    diagnosticScore: null, // 0–100
    currentLevel: "easy",  // easy | intermediate | advanced
    unlocked: {
      easy: true,
      intermediate: false,
      advanced: false
    },
    completedPassages: {
  easy: 0,
  intermediate: 0,
  advanced: 0
}
  }
};

function getProgress() {
  return JSON.parse(localStorage.getItem("progress")) || DEFAULT_PROGRESS;
}

function saveProgress(progress) {
  localStorage.setItem("progress", JSON.stringify(progress));
}

// Call after diagnostic / mini test
function setReadingLevel(score) {
  const progress = getProgress();
  progress.reading.diagnosticScore = score;

  if (score <= 50) {
    progress.reading.currentLevel = "easy";
    progress.reading.unlocked.easy = true;
  } else {
    progress.reading.currentLevel = "intermediate";
    progress.reading.unlocked.easy = true;
    progress.reading.unlocked.intermediate = true;
  }

  saveProgress(progress);
}

// Unlock next level manually (later use)
function unlockNextLevel() {
  const progress = getProgress();

  if (progress.reading.currentLevel === "easy") {
    progress.reading.unlocked.intermediate = true;
  } else if (progress.reading.currentLevel === "intermediate") {
    progress.reading.unlocked.advanced = true;
  }

  saveProgress(progress);
}
function markPassageCompleted(level) {
  const progress = getProgress();

  progress.reading.completedPassages[level]++;

  // AUTO UNLOCK LOGIC
  if (
    level === "intermediate" &&
    progress.reading.completedPassages.intermediate >= 5
  ) {
    progress.reading.unlocked.advanced = true;
  }

  saveProgress(progress);
}