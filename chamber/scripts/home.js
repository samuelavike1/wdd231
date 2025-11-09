// ===== Weather (Accra) =====
const weatherBox = document.getElementById('weather');

const API_KEY = '6e6444dae9881789beee9db59eafd651'; // from your example
const CITY = 'Accra';
const CURRENT_URL =
  `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&appid=${API_KEY}&units=metric`;

async function getWeather() {
  try {
    // 1) Current weather
    const curRes = await fetch(CURRENT_URL);
    if (!curRes.ok) throw new Error('Current weather request failed');
    const current = await curRes.json();

    const { lat, lon } = current.coord;
    const icon = current.weather?.[0]?.icon ?? '01d';
    const desc = current.weather?.[0]?.description ?? '—';
    const temp = Math.round(current.main?.temp ?? 0);

    // 2) Forecast (use same coords to ensure city match)
    const FORECAST_URL =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const fcRes = await fetch(FORECAST_URL);
    if (!fcRes.ok) throw new Error('Forecast request failed');
    const forecastData = await fcRes.json();

    // pick the next 3 *midday* entries; fallback to 8-step slices if needed
    let daily = forecastData.list.filter(x => x.dt_txt?.endsWith('12:00:00')).slice(0, 3);
    if (daily.length < 3) daily = forecastData.list.filter((_, i) => i % 8 === 0).slice(1, 4);

    const fcHTML = daily.map(d => {
      const day = new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      const t = Math.round(d.main.temp);
      return `<div><b>${day}:</b> ${t}°C</div>`;
    }).join('');

    weatherBox.innerHTML = `
      <div class="current">
        <div style="display:flex;align-items:center;gap:.5rem;">
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" width="48" height="48">
          <div>
            <p style="margin:.1rem 0;"><b>${CITY}</b></p>
            <p style="margin:.1rem 0;">${temp}°C — ${desc}</p>
          </div>
        </div>
      </div>
      <div class="forecast">${fcHTML}</div>
    `;
  } catch (err) {
    console.error(err);
    weatherBox.textContent = 'Weather data unavailable.';
  }
}

// ===== Member Spotlights (unchanged) =====
const spotlightsEl = document.getElementById('spotlights');

async function loadSpotlights() {
  try {
    const res = await fetch('data/members.json', { cache: 'no-store' });
    const data = await res.json();
    const premium = data.filter(m => m.membership >= 2); // silver/gold
    const picks = premium.sort(() => 0.5 - Math.random()).slice(0, 3);

    spotlightsEl.innerHTML = picks.map(m => `
      <article class="card">
        <img src="images/members/${m.logo}" alt="${m.name} logo" width="64" height="64" loading="lazy">
        <div>
          <h3>${m.name}</h3>
          <p class="meta">${m.address}<br>${m.phone}</p>
          <p class="meta">${m.membership === 3 ? 'Gold Member' : 'Silver Member'}</p>
        </div>
      </article>
    `).join('');
    spotlightsEl.setAttribute('aria-busy', 'false');
  } catch (e) {
    console.error(e);
    spotlightsEl.textContent = 'Unable to load spotlights.';
  }
}

// init
getWeather();
loadSpotlights();
