/* ============================================
   Clash of Armored - Game Loop
   ============================================ */
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ضبط الحجم ليملأ الشاشة
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // إنشاء الخريطة والمدرعة
  const map = new TestMap(canvas.width, canvas.height);
  const tank = new Tank(canvas.width / 2 - 25, canvas.height / 2 - 35);

  // حالة الإدخال
  const input = { up: false, down: false, left: false, right: false };

  // لوحة المفاتيح (للتجربة على الكمبيوتر)
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'w')    input.up = true;
    if (e.key === 'ArrowDown' || e.key === 's')  input.down = true;
    if (e.key === 'ArrowLeft' || e.key === 'a')  input.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') input.right = true;
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowUp' || e.key === 'w')    input.up = false;
    if (e.key === 'ArrowDown' || e.key === 's')  input.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a')  input.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') input.right = false;
  });

  // أزرار اللمس (للهاتف)
  document.querySelectorAll('[data-dir]').forEach(btn => {
    const dir = btn.getAttribute('data-dir');
    const set = (v) => (e) => { e.preventDefault(); input[dir] = v; };

    btn.addEventListener('touchstart', set(true), { passive: false });
    btn.addEventListener('touchend', set(false), { passive: false });
    btn.addEventListener('mousedown', set(true));
    btn.addEventListener('mouseup', set(false));
    btn.addEventListener('mouseleave', set(false));
  });

  // حلقة اللعبة
  let lastTime = performance.now();

  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 16.67, 2); // dt طبيعي
    lastTime = now;

    // تحديث
    tank.update(dt, input);

    // حدود الشاشة
    tank.x = Math.max(0, Math.min(canvas.width - tank.width, tank.x));
    tank.y = Math.max(0, Math.min(canvas.height - tank.height, tank.y));

    // رسم
    map.draw(ctx);
    tank.draw(ctx);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
});
