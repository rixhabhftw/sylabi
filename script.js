/* ============================================
   THEME TOGGLE
   click the laptop OR the nav switch — both do the same thing.
   preference is remembered for the session via a JS variable
   (swap in localStorage.setItem('theme', mode) / getItem if you're
   hosting this for real and want it to persist across visits).
   ============================================ */
(function () {
  const root = document.documentElement;
  const desk = document.getElementById('deskToggle');
  const navSwitch = document.getElementById('themeSwitch');

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = prefersDark ? 'dark' : 'light';
  applyTheme(theme);

  function applyTheme(mode) {
    theme = mode;
    root.setAttribute('data-theme', mode);
    navSwitch.setAttribute('aria-pressed', mode === 'dark');
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }

  desk.addEventListener('click', toggleTheme);
  desk.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
  navSwitch.addEventListener('click', toggleTheme);
})();

/* ============================================
   SCRATCH CARD
   ============================================ */
(function () {
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  const resetBtn = document.getElementById('resetScratch');
  let isScratching = false;

  function sizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    paintCard();
  }

  function paintCard() {
    const w = canvas.width, h = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#FF5A36');
    grad.addColorStop(1, '#FFD23F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '600 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('scratch me ✦', w / 2, h / 2);

    ctx.globalCompositeOperation = 'source-over';
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top
    };
  }

  function scratch(e) {
    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
  canvas.addEventListener('mousemove', (e) => { if (isScratching) scratch(e); });
  window.addEventListener('mouseup', () => { isScratching = false; });

  canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: true });
  canvas.addEventListener('touchmove', (e) => { if (isScratching) scratch(e); }, { passive: true });
  window.addEventListener('touchend', () => { isScratching = false; });

  resetBtn.addEventListener('click', paintCard);
  window.addEventListener('resize', sizeCanvas);
  sizeCanvas();
})();

/* ============================================
   GUESTBOOK
   in-memory only for this demo (so it always works in a preview
   with no backend). to make entries persist across visits when you
   host this yourself, swap `entries` for reads/writes against
   localStorage, or better, a tiny backend / database (e.g. Supabase,
   Firebase) so everyone's signatures show up for every visitor.
   ============================================ */
(function () {
  const form = document.getElementById('guestbookForm');
  const wall = document.getElementById('guestbookWall');
  const nameInput = document.getElementById('gbName');
  const msgInput = document.getElementById('gbMessage');

  let entries = [
    { name: 'Rishabh', message: 'sign the guestbook — first one\'s free.' }
  ];

  function render() {
    wall.innerHTML = '';
    if (entries.length === 0) {
      wall.innerHTML = '<p class="gb-empty">no notes yet — be the first.</p>';
      return;
    }
    entries.forEach((entry) => {
      const note = document.createElement('div');
      note.className = 'gb-note';
      const rotation = (Math.random() * 4 - 2).toFixed(2);
      note.style.transform = `rotate(${rotation}deg)`;
      const strong = document.createElement('strong');
      strong.textContent = entry.name;
      const p = document.createElement('p');
      p.style.margin = '0';
      p.textContent = entry.message;
      note.appendChild(strong);
      note.appendChild(p);
      wall.appendChild(note);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    if (!name || !message) return;
    entries.unshift({ name, message });
    render();
    form.reset();
    nameInput.focus();
  });

  render();
})();

/* footer year */
document.getElementById('year').textContent = new Date().getFullYear();