/* ============================================================
   GLOBAL THEME SYNC — WORKS ON *EVERY PAGE*
   - Immediately applies saved theme (no flash)
   - Auto-fixes missing attributes
   - Neon pulse only on pages with toggle button
===============================================================*/

// 1. Ensure theme exists in localStorage
if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "light");
}

// 2. Apply theme IMMEDIATELY (before page paints)
const savedTheme = localStorage.getItem("theme");
document.documentElement.setAttribute("data-theme", savedTheme);

// 3. Get toggle & icon (MAY not exist)
const toggle = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");

// 4. Update icon everywhere
function updateIcon(theme) {
    if (!icon) return;
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
}
updateIcon(savedTheme);

// 5. Neon animation ONLY if toggle exists
function neonPulse() {
    if (!toggle) return;
    toggle.classList.add("neon-pulse");
    setTimeout(() => toggle.classList.remove("neon-pulse"), 600);
}

// 6. Toggle handler ONLY on the homepage
if (toggle) {
    toggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        // update everywhere
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);

        updateIcon(next);
        neonPulse();
    });
}