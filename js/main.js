document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation
  const openBtn = document.querySelector('[data-nav-open]');
  const closeBtn = document.querySelector('[data-nav-close]');
  const panel = document.querySelector('[data-nav-panel]');
  const scrim = document.querySelector('[data-scrim]');

  if (openBtn && closeBtn && panel && scrim) {
    function openNav(){
      panel.classList.add('open');
      scrim.classList.add('open');
      openBtn.setAttribute('aria-expanded','true');
    }
    function closeNav(){
      panel.classList.remove('open');
      scrim.classList.remove('open');
      openBtn.setAttribute('aria-expanded','false');
    }
    openBtn.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);
    scrim.addEventListener('click', closeNav);
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  }

  // 2. Scroll Reveal (This is the trigger that fixes the blank screen!)
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // 3. CAD-Style Crosshair / Coordinate HUD
  const hero = document.querySelector('.hero');
  const crosshair = document.querySelector('.crosshair');
  const hud = document.querySelector('.hud');
  const hudX = document.querySelector('[data-hud-x]');
  const hudY = document.querySelector('[data-hud-y]');

  if (hero && crosshair && hud && window.matchMedia('(pointer: fine)').matches){
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      crosshair.style.left = (x - 9) + 'px';
      crosshair.style.top = (y - 9) + 'px';
      hud.style.left = (x + 18) + 'px';
      hud.style.top = (y - 22) + 'px';
      
      hudX.textContent = String(Math.round(x)).padStart(4,'0');
      hudY.textContent = String(Math.round(y)).padStart(4,'0');
      
      crosshair.classList.add('show');
      hud.classList.add('show');
    });
    
    hero.addEventListener('mouseleave', () => {
      crosshair.classList.remove('show');
      hud.classList.remove('show');
    });
  }
});
