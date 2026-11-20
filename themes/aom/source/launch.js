(() => {
  const screen = document.querySelector('#launch-screen');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return;
  try {
    if (sessionStorage.getItem('orbit-intro')) return;
    sessionStorage.setItem('orbit-intro','1');
  } catch { /* Storage may be disabled in a private tab. */ }
  screen.hidden = false;
  const dismiss = () => {
    screen.hidden = true;
    clearTimeout(timeout);
    document.removeEventListener('keydown', dismiss);
    preference.removeEventListener('change',dismiss);
  };
  const timeout = setTimeout(dismiss,1400);
  document.querySelector('#skip-launch').onclick = dismiss;
  document.addEventListener('keydown', dismiss);
  preference.addEventListener('change',dismiss);
})();
