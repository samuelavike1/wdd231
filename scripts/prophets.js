const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Target containers
const cards = document.querySelector('#cards');
const statusEl = document.querySelector('#status');

// Kick off
getProphetData();

/**
 * Fetch + parse + render
 */
async function getProphetData() {
  showStatus('Loading prophet data…');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const data = await response.json();


    // Sort by "order" just to keep a predictable sequence
    const sorted = [...data.prophets].sort((a, b) => a.order - b.order);

    displayProphets(sorted);
    hideStatus();
  } catch (err) {
    showStatus(`There was a problem fetching the data: ${err.message}`);
  }
}


const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    // Elements
    const card = document.createElement('section');
    card.className = 'card';
    card.setAttribute('role', 'listitem');

    const fig = document.createElement('figure');
    const img = document.createElement('img');

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('h3'); // full name
    const meta = document.createElement('div');
    meta.className = 'meta';

    // Title (full name)
    const fullName = `${prophet.name} ${prophet.lastname}`;
    title.textContent = fullName;

    // Portrait
    img.className = 'portrait';
    img.setAttribute('src', prophet.imageurl);
    img.setAttribute('alt', `Portrait of ${fullName}`);
    img.setAttribute('loading', 'lazy');
    img.setAttribute('width', '340');
    img.setAttribute('height', '440');

    // Meta lines
    const dob = document.createElement('p');
    dob.innerHTML = `<b>Date of Birth:</b> <span class="muted">${prophet.birthdate}</span>`;

    const pob = document.createElement('p');
    pob.innerHTML = `<b>Place of Birth:</b> <span class="muted">${prophet.birthplace}</span>`;

    // Append
    fig.appendChild(img);
    content.appendChild(title);
    meta.appendChild(dob);
    meta.appendChild(pob);
    content.appendChild(meta);

    card.appendChild(fig);
    card.appendChild(content);

    cards.appendChild(card);
  });
};

/* ===== tiny helpers ===== */
function showStatus(msg) {
  statusEl.textContent = msg;
  statusEl.hidden = false;
}
function hideStatus() {
  statusEl.hidden = true;
  statusEl.textContent = '';
}
