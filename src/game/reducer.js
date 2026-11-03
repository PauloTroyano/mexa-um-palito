import { LEVELS, livesFor } from './levels.js';
import { parse, evaluate, move, has, solutions } from './logic.js';

const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
// msg: { em: trecho destacado, text: resto }
const m = (text, em = '') => ({ em, text });

export function initState(saved = {}) {
  const level = Number.isInteger(saved.level) && LEVELS[saved.level] ? saved.level : 0;
  return loadLevel({ done: saved.done ?? [], shake: 0 }, level, false);
}

function loadLevel(state, level, keepLives) {
  const lv = LEVELS[level];
  const max = livesFor(level);
  const lives = keepLives && state.lives > 0 ? Math.min(state.lives, max) : max;
  return {
    ...state,
    level,
    glyphs: parse(lv.p),
    orig: null,
    cur: null,
    lifted: false,
    solved: false,
    hint: null,
    lives,
    lostNow: false,
    msg: lv.boss ? m('Um palito só. Pense antes de largar.') : m('Toque num palito para pegá-lo.'),
  };
}

function check(state) {
  const ok = evaluate(state.glyphs);
  const lv = LEVELS[state.level];
  if (ok) {
    const last = state.level === LEVELS.length - 1;
    const done = state.done.includes(state.level) ? state.done : [...state.done, state.level];
    return {
      ...state, solved: true, hint: null, done,
      msg: last ? m(' Fechou todas as 15 fases.', 'Você venceu o último chefão!')
        : lv.boss ? m('', 'Chefão derrotado!') : m(' A conta fechou.', 'Acertou!'),
    };
  }
  const why = ok === null ? 'Assim um dos símbolos não forma número.' : 'A conta não fechou.';
  const shake = state.shake + 1;
  const lives = state.lives - 1;
  if (lives <= 0) {
    const max = livesFor(state.level);
    const label = lv.boss ? 'O chefão venceu desta vez.' : 'Suas vidas acabaram.';
    return { ...state, shake, lives: 0, lostNow: true,
      msg: m(' Toque em Recomeçar do zero para voltar à fase 1.', label) };
  }
  return { ...state, shake, lives, lostNow: true, msg: m(`${why} Você perdeu uma vida. Toque em Tentar de novo.`) };
}

function tap(state, slot) {
  if (state.solved) return state;
  const g = state.glyphs[slot[0]];
  const shake = state.shake + 1;
  if (g.t === 'e') return { ...state, shake, msg: m(' fica fixo.', 'O sinal de =') };
  const full = has(state.glyphs, slot);

  if (state.lifted) {
    if (same(slot, state.cur)) {
      return { ...state, lifted: false, orig: null, cur: null, msg: m('Toque num palito para pegá-lo.') };
    }
    if (full) return { ...state, shake, msg: m('Esse espaço já tem palito. Escolha um tracejado.') };
    const glyphs = move(state.glyphs, state.cur, slot);
    return check({ ...state, glyphs, cur: slot, lifted: false, lostNow: false });
  }
  if (!full) return { ...state, msg: m('Primeiro pegue um palito.') };
  if (state.orig) return { ...state, shake, msg: m('Você já usou sua jogada. Toque em Tentar de novo.') };
  return { ...state, orig: slot, cur: slot, lifted: true, lostNow: false, msg: m('Agora toque num espaço tracejado.') };
}

function hint(state) {
  if (state.solved || LEVELS[state.level].boss) return state;
  if (state.lives <= 0) return state;
  const [sol] = solutions(parse(LEVELS[state.level].p));
  if (!sol) return state;
  const stage = state.hint ? 2 : 1;
  const base = state.orig ? loadLevel(state, state.level, true) : state;
  const lives = base.lives - 1;
  return {
    ...base,
    lives,
    shake: base.shake + 1,
    hint: { ...sol, stage },
    msg: stage === 1
      ? m('O palito destacado é o que precisa sair. Toque em Dica de novo para ver o destino.')
      : m('Destacados: o palito e o espaço para onde ele vai.'),
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'load': return loadLevel(state, action.level, action.level === state.level);
    case 'restart': return loadLevel({ ...state, done: [] }, 0, false);
    case '_load_save': return initState(action.saved);
    case 'retry': return loadLevel(state, state.level, true);
    case 'next': return loadLevel(state, Math.min(state.level + 1, LEVELS.length - 1), true);
    case 'tap': return tap(state, action.slot);
    case 'hint': return hint(state);
    default: return state;
  }
}
