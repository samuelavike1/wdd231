const membersEl = document.getElementById('members');
const countEl = document.getElementById('memberCount');
const viewBtns = document.querySelectorAll('.viewBtn');

async function loadMembers(){
  try{
    const res = await fetch('data/members.json', {cache:'no-store'});
    const data = await res.json();
    render(data);
  }catch(err){
    membersEl.innerHTML = `<p>Failed to load members. Please try again.</p>`;
    membersEl.setAttribute('aria-busy','false');
    console.error(err);
  }
}

function render(members){
  membersEl.innerHTML = members.map(toCard).join('');
  membersEl.setAttribute('aria-busy','false');
  countEl.textContent = `${members.length} members`;
}

function toCard(m){
  const levelClass = m.membership === 3 ? 'gold' : m.membership === 2 ? 'silver' : '';
  const levelLabel = m.membership === 3 ? 'Gold' : m.membership === 2 ? 'Silver' : 'Member';

  return `
  <article class="card">
    <img src="images/members/${m.logo}" alt="${m.name} logo" width="64" height="64" loading="lazy">
    <div>
      <h3>${m.name}</h3>
      <p class="meta">${m.address}<br>${m.phone}</p>
      <div class="badges">
        <span class="badge ${levelClass}" title="Membership level">${levelLabel}</span>
        ${m.tags?.map(t=>`<span class="badge">${t}</span>`).join('') ?? ''}
      </div>
    </div>
    <a href="${m.website}" target="_blank" rel="noopener">${m.website}</a>
  </article>`;
}

// view toggle
viewBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    viewBtns.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed','true');

    const view = btn.dataset.view; // 'grid' or 'list'
    membersEl.classList.toggle('grid', view === 'grid');
    membersEl.classList.toggle('list', view === 'list');
  });
});

loadMembers();
