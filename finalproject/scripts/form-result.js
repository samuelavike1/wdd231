const container = document.getElementById("resultContainer");

function displayFormData() {
  const params = new URLSearchParams(window.location.search);

  const name = params.get("name") || "(not provided)";
  const email = params.get("email") || "(not provided)";
  const booktitle = params.get("booktitle") || "(not provided)";
  const bookauthor = params.get("bookauthor") || "(not provided)";
  const genre = params.get("genre") || "(not provided)";
  const frequency = params.get("frequency") || "(not provided)";
  const notes = params.get("notes") || "(none)";

  container.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Book Title:</strong> ${booktitle}</p>
    <p><strong>Book Author:</strong> ${bookauthor}</p>
    <p><strong>Genre:</strong> ${genre}</p>
    <p><strong>Reading Frequency:</strong> ${frequency}</p>
    <p><strong>Why you recommend this book:</strong><br>${notes}</p>
  `;
}

displayFormData();
