// Footer dynamic values
document.getElementById('currentyear').textContent = new Date().getFullYear();

// name and location is set here and displayed in the footer
document.getElementById('footerName').textContent = 'Samuel Apusiyine Avike';
document.getElementById('footerLocation').textContent = 'Ghana';

// Last modified date
const lastMod = document.lastModified;
document.getElementById('lastModified').textContent = `Last Modified: ${lastMod}`;
