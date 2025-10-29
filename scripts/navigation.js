const menuButton = document.getElementById('menuButton');
const siteNav = document.getElementById('siteNav');

if (menuButton && siteNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuButton.classList.toggle('show', isOpen); 
  });
}

// Wayfinding: ensure the current page is marked active
const navLinks = siteNav?.querySelectorAll('a') ?? [];
navLinks.forEach(a => {
  if (a.getAttribute('href') === './' || a.getAttribute('href') === '') {
    // home stays active as coded in HTML
    return;
  }
  // Basic heuristic: if location path contains the href folder, mark it
  if (location.pathname.includes(a.getAttribute('href'))) {
    a.classList.add('active');
    a.setAttribute('aria-current', 'page');
  }
});
