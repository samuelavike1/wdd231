// scripts/tracker.js

const trackerContainer = document.getElementById("trackerContainer");
const statusFilter = document.getElementById("statusFilter");
const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const goalProgressText = document.getElementById("goalProgressText");

function loadTracker() {
  try {
    const raw = localStorage.getItem("readingTracker");
    return raw ? JSON.parse(raw) : { goal: 0, books: [] };
  } catch (e) {
    console.error("Error loading tracker from storage", e);
    return { goal: 0, books: [] };
  }
}

function saveTracker(tracker) {
  localStorage.setItem("readingTracker", JSON.stringify(tracker));
}

let trackerState = loadTracker();

function updateGoalProgressText() {
  const total = trackerState.goal || 0;
  const finishedCount = trackerState.books.filter(b => b.status === "finished").length;
  if (goalProgressText) {
    goalProgressText.textContent = `${finishedCount} of ${total} books finished`;
  }
}

function renderTracker() {
  if (!trackerContainer) return;
  trackerContainer.innerHTML = "";

  const selectedStatus = statusFilter?.value || "all";

  const booksToShow = trackerState.books.filter(book => {
    return selectedStatus === "all" || book.status === selectedStatus;
  });

  if (booksToShow.length === 0) {
    trackerContainer.innerHTML = "<p>No books in your tracker yet. Visit the Books page to add some.</p>";
    return;
  }

  booksToShow.forEach(book => {
    const item = document.createElement("article");
    item.className = "tracker-item";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "book-meta";
    author.textContent = `by ${book.author}`;

    const controls = document.createElement("div");
    controls.className = "tracker-controls";

    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Status:";
    const statusSelect = document.createElement("select");
    statusSelect.innerHTML = `
      <option value="to-read">To Read</option>
      <option value="in-progress">In Progress</option>
      <option value="finished">Finished</option>
    `;
    statusSelect.value = book.status;
    statusSelect.addEventListener("change", () => {
      book.status = statusSelect.value;
      saveTracker(trackerState);
      updateGoalProgressText();
    });

    statusLabel.appendChild(statusSelect);

    const notesLabel = document.createElement("label");
    notesLabel.textContent = "Notes:";
    const notesArea = document.createElement("textarea");
    notesArea.value = book.notes || "";
    notesArea.addEventListener("change", () => {
      book.notes = notesArea.value;
      saveTracker(trackerState);
    });
    notesLabel.appendChild(notesArea);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-outline";
    removeBtn.textContent = "Remove from tracker";
    removeBtn.addEventListener("click", () => {
      trackerState.books = trackerState.books.filter(b => b.id !== book.id);
      saveTracker(trackerState);
      renderTracker();
      updateGoalProgressText();
    });

    controls.append(statusLabel, notesLabel, removeBtn);

    item.append(title, author, controls);
    trackerContainer.appendChild(item);
  });
}

// Goal form
goalForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = Number(goalInput?.value || "0");
  trackerState.goal = value >= 0 ? value : 0;
  saveTracker(trackerState);
  updateGoalProgressText();
});

statusFilter?.addEventListener("change", renderTracker);

// Initialize
if (goalInput) {
  goalInput.value = trackerState.goal ? String(trackerState.goal) : "";
}
renderTracker();
updateGoalProgressText();
