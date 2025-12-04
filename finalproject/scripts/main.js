// scripts/main.js
const navToggle = document.querySelector(".menu-toggle-btn");
const navLinks = document.querySelector(".navigation-menu");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
  });
}

// Wayfinding: mark current page link
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navigation-menu a").forEach(link => {
  const href = link.getAttribute("href");
  if (href && href.endsWith(currentPath)) {
    link.setAttribute("aria-current", "page");
  }
});

// Home page stats (if present)
const totalBooksSpan = document.querySelector("[data-stat='total-books']");
const finishedBooksSpan = document.querySelector("[data-stat='finished-books']");
const goalSpan = document.querySelector("[data-stat='goal']");

function loadTrackerFromStorage() {
  try {
    const raw = localStorage.getItem("readingTracker");
    return raw ? JSON.parse(raw) : { goal: 0, books: [] };
  } catch (e) {
    console.error("Error loading tracker from storage", e);
    return { goal: 0, books: [] };
  }
}

if (totalBooksSpan || finishedBooksSpan || goalSpan) {
  const tracker = loadTrackerFromStorage();
  const totalBooks = tracker.books.length;
  const finishedBooks = tracker.books.filter(b => b.status === "finished").length;

  if (totalBooksSpan) totalBooksSpan.textContent = String(totalBooks);
  if (finishedBooksSpan) finishedBooksSpan.textContent = String(finishedBooks);
  if (goalSpan) goalSpan.textContent = tracker.goal ? String(tracker.goal) : "Not set";
}
