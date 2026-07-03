(function () {
  const diploma = document.querySelector('.diploma');
  const viewport = document.querySelector('.carrusel');
  if (!diploma || !viewport) return;

  const slides = Array.from(viewport.children);
  const dotsWrap = document.querySelector('.progreso');
  const hint = document.querySelector('.pista-deslizar');
  const btnPrev = document.querySelector('.nav-prev');
  const btnNext = document.querySelector('.nav-next');

  let idx = 0;
  let interactuado = false;

  // crea los puntitos de progreso
  slides.forEach((_, i) => {
    const p = document.createElement('span');
    p.className = 'punto' + (i === 0 ? ' activo' : '');
    dotsWrap && dotsWrap.appendChild(p);
  });
  const puntos = dotsWrap ? Array.from(dotsWrap.children) : [];

  function marcaInteraccion() {
    if (!interactuado) {
      interactuado = true;
      hint && hint.classList.add('oculto');
    }
  }

  function ir(nuevo) {
    idx = Math.max(0, Math.min(slides.length - 1, nuevo));
    viewport.style.transform = `translateX(-${idx * 100}%)`;
    puntos.forEach((p, j) => p.classList.toggle('activo', j === idx));
    if (btnPrev) btnPrev.setAttribute('data-oculto', idx === 0 ? '1' : '0');
    if (btnNext) btnNext.setAttribute('data-oculto', idx === slides.length - 1 ? '1' : '0');
  }

  function siguiente() { marcaInteraccion(); ir(idx + 1); }
  function anterior() { marcaInteraccion(); ir(idx - 1); }

  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); siguiente(); });
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); anterior(); });

  // toque / clic / deslizar sobre la tarjeta
  let startX = null, startY = null, moved = false;

  diploma.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a') || e.target.closest('.nav-btn')) { startX = null; return; }
    startX = e.clientX;
    startY = e.clientY;
    moved = false;
  });

  diploma.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) moved = true;
  });

  diploma.addEventListener('pointerup', (e) => {
    if (e.target.closest('a') || e.target.closest('.nav-btn')) return;
    if (startX === null) return;

    const dx = e.clientX - startX;

    if (moved && Math.abs(dx) > 40) {
      dx < 0 ? siguiente() : anterior();
    } else if (!moved) {
      const rect = diploma.getBoundingClientRect();
      const x = e.clientX - rect.left;
      x > rect.width / 2 ? siguiente() : anterior();
    }
    startX = null;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') siguiente();
    if (e.key === 'ArrowLeft') anterior();
  });

  ir(0);
})();
