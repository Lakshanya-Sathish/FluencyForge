/* ======================================================
   ADAPTIVE ENGINE — Works for Reading, Listening, Writing, Speaking
   Stores: lastScore, levelStats, difficultyPath
   Difficulty scale: 1–100
   ====================================================== */

function getCurrentLevel() {
    return localStorage.getItem("ff_level") || "B"; // default beginner
}

function saveCurrentLevel(level) {
    localStorage.setItem("ff_level", level);
}

/* ---------------------------
   SCORE SAVING PER MODULE
----------------------------*/
function saveScore(section, moduleId, score) {
    const key = `score-${section}-${moduleId}`;
    localStorage.setItem(key, score);

    updateAdaptiveLevel(section, score);
}

/* ---------------------------
   ADAPTIVE LOGIC
----------------------------*/
function updateAdaptiveLevel(section, score) {
    let current = getCurrentLevel(); // B / I / A

    // Simple rule-based adaptivity
    if (score >= 85 && current === "B") saveCurrentLevel("I");
    else if (score >= 90 && current === "I") saveCurrentLevel("A");
    else if (score < 40 && current === "A") saveCurrentLevel("I");
    else if (score < 30 && current === "I") saveCurrentLevel("B");
}

/* ---------------------------
   GET NEXT MODULE BASED ON LEVEL
----------------------------*/
function getNextAdaptiveModule(section) {
    const level = getCurrentLevel(); // B I A

    const moduleCount = {
        reading: { B: 5, I: 5, A: 5 },
        listening: { B: 5, I: 5, A: 5 },
        writing: { B: 5, I: 5, A: 5 },
        speaking: { B: 5, I: 5, A: 5 }
    };

    const total = moduleCount[section][level];

    // find first incomplete module
    for (let i = 1; i <= total; i++) {
        const id = `${section[0].toUpperCase()}-${level}-${i}`;
        if (!localStorage.getItem(id)) return id;
    }

    // if everything done → repeat module 1
    return `${section[0].toUpperCase()}-${level}-1`;
}

export { saveScore, getNextAdaptiveModule, getCurrentLevel };