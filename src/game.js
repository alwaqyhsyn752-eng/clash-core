/* ============================================
   Clash of Armored - Game Loop (Full Integrated)
   ============================================ */
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ===== قراءة الإعدادات =====
  const cfg = window.GAME_CONFIG || { display: {}, performance: {} };
  const controls = window.CONTROLS_CONFIG || { sensitivity: {}, keyboard: {} };
  const mapCfg = (window.MAP_CONFIG && window.MAP_CONFIG.map_01) || {};

  // ===== ضبط الحجم ليملأ الشاشة =====
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ===== تطبيق حد DPR لأداء أفضل =====
  const dprCap = (cfg.display && cfg.display.pixelRatioCap) || 2;
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  ctx.scale(dpr, dpr);

  // ===== إنشاء الخريطة والمدرعة =====
  const map = new TestMap(canvas.width, canvas.height);

  // نقطة الظهور من map-config.js
  const spawn = mapCfg.playerSpawn || {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 35,
    rotation: 0
  };

  const tank = new Tank(spawn.x, spawn.y);
  tank.rotation = spawn.rotation || 0;

  // ===== حالة الإدخال =====
  const input = { up: false, down: false, left: false, right: false, fire: false };

  // ===== لوحة المفاتيح =====
  const kb = controls.keyboard || {
    up: ['ArrowUp', 'w', 'W'],
    down: ['ArrowDown', 's', 'S'],
    left: ['ArrowLeft', 'a', 'A'],
    right: ['ArrowRight', 'd', 'D'],
    fire: ['Space', ' ']
  };

  function matchKey(keys, key) {
    return Array.isArray(keys) && keys.includes(key);
  }

  window.addEventListener('keydown', e => {
    if (matchKey(kb.up, e.key))    input.up = true;
    if (matchKey(kb.down, e.key))  input.down = true;
    if (matchKey(kb.left, e.key))  input.left = true;
    if (matchKey(kb.right, e.key)) input.right = true;
    if (matchKey(kb.fire, e.key))  input.fire = true;
  });

  window.addEventListener('keyup', e => {
    if (matchKey(kb.up, e.key))    input.up = false;
    if (matchKey(kb.down, e.key))  input.down = false;
    if (matchKey(kb.left, e.key))  input.left = false;
    if (matchKey(kb.right, e.key)) input.right = false;
    if (matchKey(kb.fire, e.key))  input.fire = false;
  });

  // ===== أزرار اللمس على الشاشة =====
  document.querySelectorAll('[data-dir]').forEach(btn => {
    const dir = btn.getAttribute('data-dir');
    const set = (v) => (e) => {
      e.preventDefault();
      input[dir] = v;
      // اهتزاز عند الضغط
      if (v && controls.touch && controls.touch.vibrationMs &&
          navigator.vibrate) {
        navigator.vibrate(controls.touch.vibrationMs);
      }
    };
    btn.addEventListener('touchstart', set(true), { passive: false });
    btn.addEventListener('touchend', set(false), { passive: false });
    btn.addEventListener('mousedown', set(true));
    btn.addEventListener('mouseup', set(false));
    btn.addEventListener('mouseleave', set(false));
  });

  // ===== تطبيق الحساسية من الإعدادات =====
  if (controls.sensitivity) {
    if (controls.sensitivity.moveSpeed) tank.speed = controls.sensitivity.moveSpeed;
  }

  // ===== حلقة اللعبة =====
  let lastTime = performance.now();
  const maxDT = (cfg.performance && cfg.performance.maxDT) || 2;

  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 16.67, maxDT);
    lastTime = now;

    // تحديث
    tank.update(dt, input);

    // حدود الشاشة
    tank.x = Math.max(0, Math.min(canvas.width - tank.width, tank.x));
    tank.y = Math.max(0, Math.min(canvas.height - tank.height, tank.y));

    // رسم
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.draw(ctx);
    tank.draw(ctx);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);

  // ===== حفظ تلقائي دوري =====
  const autoSaveMs = (cfg.gameplay && cfg.gameplay.autoSaveInterval) || 30000;
  setInterval(() => {
    if (window.COA && window.COA.saves) {
      window.COA.saves.autoSave({
        tank: { x: tank.x, y: tank.y, rotation: tank.rotation, hp: tank.hp },
        mapId: mapCfg.id || 'map_01'
      });
    }
  }, autoSaveMs);

  console.log('🎮 Clash of Armored — Game initialized', {
    dpr,
    spawn,
    canvasSize: { w: canvas.width, h: canvas.height }
  });
});
