// timestamp hidden field
const ts = document.getElementById('timestamp');
if (ts) ts.value = new Date().toISOString();

// open modals
document.querySelectorAll('.level-more').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-target');
    const dlg = document.getElementById(id);
    dlg?.showModal?.();
  });
});

// close modals (no <form method="dialog"> anymore)
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-close');
    const dlg = document.getElementById(id);
    dlg?.close?.();
  });
});
