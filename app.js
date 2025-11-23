// ===========================
// Reveal on Scroll Animation
// ===========================
const reveals = document.querySelectorAll(".reveal, .reveal-up, .reveal-scale");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay =
        el.dataset.delay ||
        parseInt(getComputedStyle(el).getPropertyValue("--delay")) ||
        0;

      setTimeout(() => el.classList.add("is-revealed"), delay);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

for (const r of reveals) {
  observer.observe(r);
}

// ===========================
// Smooth Anchor Scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ===========================
// Mobile Navigation Toggle
// ===========================
const navToggle = document.getElementById("navToggle");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("open");
    navToggle.classList.toggle("open");
  });
}

// ===========================
// Floating Decorative Icons
// ===========================
document.querySelectorAll(".floating-icons .icon").forEach((el) => {
  const x = el.style.getPropertyValue("--x") || Math.random() * 60 - 30;
  const y = el.style.getPropertyValue("--y") || Math.random() * 60 - 30;

  el.style.transform = translate(${x}px, ${y}px);
});