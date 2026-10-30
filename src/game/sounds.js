let ctx = null;
const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
};

function play(fn) {
  try { fn(getCtx()); } catch { /* sem suporte a áudio */ }
}

export const sounds = {
  pickup() {
    play((c) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(800, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.06);
      g.gain.setValueAtTime(0.3, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.1);
    });
  },

  place() {
    play((c) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(600, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.08);
      g.gain.setValueAtTime(0.3, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.12);
    });
  },

  correct() {
    play((c) => {
      [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3]].forEach(([freq, when]) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.connect(g); g.connect(c.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.25, c.currentTime + when);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + when + 0.18);
        o.start(c.currentTime + when);
        o.stop(c.currentTime + when + 0.2);
      });
    });
  },

  wrong() {
    play((c) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(300, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(150, c.currentTime + 0.3);
      g.gain.setValueAtTime(0.25, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.35);
    });
  },
};
