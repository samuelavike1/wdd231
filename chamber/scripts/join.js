// timestamp hidden field (set when page loads)
const ts = document.getElementById('timestamp');
if (ts) ts.value = new Date().toISOString();

// open/close level modals
const buttons = document.querySelectorAll('.level-more');
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-target');
    const dlg = document.getElementById(id);
    if (dlg?.showModal) dlg.showModal();
    else dlg?.setAttribute('open',''); // basic fallback
  });
});
