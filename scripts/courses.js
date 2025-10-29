
const courses = [
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
  { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 3, completed: false },
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false },
];

const grid = document.getElementById('coursesGrid');
const creditEl = document.getElementById('creditsTotal');
const filterButtons = document.querySelectorAll('.controls .chip');

function render(list){
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = '';

  list.forEach(c => {
    const card = document.createElement('article');
    card.className = 'card' + (c.completed ? ' completed' : '');
    card.innerHTML = `
      <h3>${c.subject} ${c.number}</h3>
      <p>${c.title}</p>
      <div class="meta">
        <span class="badge" title="Credits">${c.credits} cr</span>
        <span class="badge" title="Subject">${c.subject}</span>
        <span class="badge" title="Status">${c.completed ? 'Completed' : 'In Progress'}</span>
      </div>
    `;
    grid.appendChild(card);
  });

  // Credits total 
  const total = list.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  creditEl.textContent = `Credits: ${total}`;
  grid.setAttribute('aria-busy', 'false');
}

function applyFilter(type){
  let list = courses;
  if (type === 'wdd') list = courses.filter(c => c.subject === 'WDD');
  if (type === 'cse') list = courses.filter(c => c.subject === 'CSE');
  render(list);
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

// Initial render (all)
render(courses);
