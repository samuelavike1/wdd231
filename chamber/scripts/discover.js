import { places } from '../data/places.mjs';

const grid = document.getElementById('discoverGrid');
const msg = document.getElementById('visitMsg');

// Render cards
function cardHTML(p){
  return `
    <article class="place" id="${p.id}">
      <h2>${p.name}</h2>
      <figure>
        <img src="images/discover/${p.image}" alt="${p.name}" width="300" height="200" loading="lazy">
        <figcaption class="visually-hidden">${p.name}</figcaption>
      </figure>
      <address>${p.address}</address>
      <p>${p.desc}</p>
      <button class="more" type="button" aria-label="Learn more about ${p.name}">Learn more</button>
    </article>
  `;
}

function render(){
  grid.innerHTML = places.map(cardHTML).join('');
  grid.setAttribute('aria-busy','false');
}
render();

// Learn more (simple demo action)
grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.more');
  if (!btn) return;
  const art = btn.closest('.place');
  if (!art) return;
  const title = art.querySelector('h2')?.textContent ?? 'Location';
  alert(`Learn more: ${title}`);
});

// ===== Last-visit message using localStorage =====
const KEY = 'discover_last_visit';
const now = Date.now();

try{
  const prev = localStorage.getItem(KEY);
  if (!prev){
    msg.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const diffMs = now - Number(prev);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1){
      msg.textContent = 'Back so soon! Awesome!';
    } else {
      msg.textContent = `You last visited ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago.`;
    }
  }
  localStorage.setItem(KEY, String(now));
} catch(err){
  // Fallback if storage blocked
  msg.textContent = 'Welcome! Let us know if you have any questions.';
}
