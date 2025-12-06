const booksContainer = document.getElementById("booksContainer");
const genreFilter = document.getElementById("genreFilter");
const searchInput = document.getElementById("searchInput");
const errorEl = document.getElementById("booksError");

const modalBackdrop = document.getElementById("bookModalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalDescription = document.getElementById("modalDescription");
const modalCloseBtn = document.querySelector(".close-button");

let allBooks = [];

// Local storage tracker
function loadTracker() {
  try {
    const raw = localStorage.getItem("readingTracker");
    return raw ? JSON.parse(raw) : { goal: 0, books: [] };
  } catch (e) {
    console.error("Error parsing tracker storage", e);
    return { goal: 0, books: [] };
  }
}
function saveTracker(tracker) {
  localStorage.setItem("readingTracker", JSON.stringify(tracker));
}
function addBookToTracker(book) {
  const tracker = loadTracker();
  const exists = tracker.books.some(b => b.id === book.id);
  if (!exists) {
    tracker.books.push({
      id: book.id,
      title: book.title,
      author: book.author,
      status: "to-read",
      notes: ""
    });
    saveTracker(tracker);
  }
}

// Fetch books
async function fetchBooks() {
  try {
    const response = await fetch("data/books.json");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    allBooks = data;
    populateGenreOptions(data);
    renderBooks();
  } catch (error) {
    console.error("Error fetching books:", error);
    if (errorEl) {
      errorEl.textContent = "Sorry, we could not load the book list. Please try again later.";
      errorEl.classList.remove("hidden");
    }
  }
}

function populateGenreOptions(books) {
  const genres = Array.from(new Set(books.map(b => b.genre))).sort();
  genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

// Render books
function renderBooks() {
  if (!booksContainer) return;
  booksContainer.innerHTML = "";

  const searchTerm = (searchInput?.value || "").toLowerCase();
  const selectedGenre = genreFilter?.value || "all";

  const filtered = allBooks.filter(book => {
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    const matchesSearch =
      !searchTerm ||
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm);
    return matchesGenre && matchesSearch;
  });

  if (filtered.length === 0) {
    booksContainer.innerHTML = "<p>No books match your filters yet.</p>";
    return;
  }

  filtered.forEach(book => {
    const card = document.createElement("article");
    card.className = "feature-box book-item";

    const img = document.createElement("img");
    img.src = book.cover;
    img.alt = `Cover of ${book.title}`;
    img.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const meta = document.createElement("p");
    meta.className = "book-meta";
    meta.textContent = `${book.author} • ${book.genre} • ${book.year} • ${book.pages} pages`;

    const rating = document.createElement("span");
    rating.className = "badge";
    rating.textContent = `Rating: ${book.rating.toFixed(1)}`;

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const detailsBtn = document.createElement("button");
    detailsBtn.className = "button button-secondary";
    detailsBtn.type = "button";
    detailsBtn.textContent = "View details";
    detailsBtn.addEventListener("click", () => openModal(book));

    const addBtn = document.createElement("button");
    addBtn.className = "button button-primary";
    addBtn.type = "button";
    addBtn.textContent = "Add to tracker";
    addBtn.addEventListener("click", () => {
      addBookToTracker(book);
      addBtn.textContent = "Added!";
      setTimeout(() => { addBtn.textContent = "Add to tracker"; }, 1500);
    });

    actions.append(detailsBtn, addBtn);

    card.append(img, title, meta, rating, actions);
    booksContainer.appendChild(card);
  });
}

// Modal functions
function openModal(book) {
  if (!modalBackdrop) return;
  modalTitle.textContent = book.title;
  modalMeta.textContent = `${book.author} • ${book.genre} • ${book.year} • ${book.pages} pages • Rating ${book.rating.toFixed(1)}`;
  modalDescription.textContent = book.description;
  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  modalCloseBtn?.focus();
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

modalCloseBtn?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalBackdrop?.classList.contains("open")) {
    closeModal();
  }
});

// Filters
genreFilter?.addEventListener("change", renderBooks);
searchInput?.addEventListener("input", renderBooks);

// Init
fetchBooks();
