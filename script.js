const toggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const nodes = document.querySelectorAll("[data-i18n-id]");
const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let lang = "id";

const setLang = (next) => {
  lang = next;
  document.documentElement.lang = lang;
  nodes.forEach((node) => {
    const value = node.dataset[lang === "id" ? "i18nId" : "i18nEn"];
    if (value) {
      node.textContent = value;
    }
  });
  toggle.textContent = lang === "id" ? "EN" : "ID";
};

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  );
};

if (toggle) {
  toggle.addEventListener("click", () => {
    setLang(lang === "id" ? "en" : "id");
  });
}

if (themeToggle) {
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  setTheme(initialTheme);
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
