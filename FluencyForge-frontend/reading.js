// reading.js

const progress = getProgress();

// LOCK / UNLOCK LEVEL CARDS
document.querySelectorAll("[data-level]").forEach(card => {
  const level = card.dataset.level;

  if (!progress.reading.unlocked[level]) {
    card.classList.add("locked");
    card.onclick = () => alert("Complete previous level to unlock");
  }
});

// OPTIONAL: show current level
console.log("Current reading level:", progress.reading.currentLevel);