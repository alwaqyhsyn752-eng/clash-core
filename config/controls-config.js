/* ============================================
   Clash of Armored - Controls Configuration
   ============================================ */
window.CONTROLS_CONFIG = {
  // حساسية الحركة الافتراضية
  sensitivity: {
    rotation: 0.05,   // سرعة الدوران
    moveSpeed: 3,     // سرعة الحركة للأمام/الخلف
    acceleration: 0.8, // تسريع سلس
    deadZone: 0.1     // منطقة ميتة للعصا الافتراضية
  },

  // نطاقات التعديل (للإعدادات في الواجهة)
  ranges: {
    sensitivity: { min: 1, max: 10, default: 5 },
    rotation:    { min: 0.01, max: 0.15, default: 0.05 },
    moveSpeed:   { min: 1, max: 8, default: 3 }
  },

  // إعدادات اللمس
  touch: {
    enabled: true,
    joystickSize: 120,
    buttonSize: 70,
    vibrationMs: 30      // اهتزاز عند الضغط
  },

  // لوحة المفاتيح (للتطوير على الكمبيوتر)
  keyboard: {
    up:    ['ArrowUp', 'w', 'W'],
    down:  ['ArrowDown', 's', 'S'],
    left:  ['ArrowLeft', 'a', 'A'],
    right: ['ArrowRight', 'd', 'D'],
    fire:  ['Space', ' ']
  },

  // أزرار التحكم في الواجهة
  buttons: {
    showRotateLeft:  true,
    showRotateRight: true,
    showForward:     true,
    showBackward:    true,
    showFire:        true
  }
};
