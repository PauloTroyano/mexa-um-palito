// Display de 7 segmentos: a=topo, b=sup. dir., c=inf. dir., d=base, e=inf. esq., f=sup. esq., g=meio
export const DIGITS = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc',
  5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
};
const key = (segs) => [...segs].sort().join('');
const SEGS_TO_DIGIT = Object.fromEntries(Object.entries(DIGITS).map(([d, s]) => [key(s), d]));

// Slots possíveis por tipo de símbolo: d=dígito, o=operador (h=traço, v=palito em pé), e=sinal de igual (fixo)
export const SLOTS = { d: 'abcdefg', o: 'hv', e: 'tu' };

/** "1+2=4" -> [{t:'d', s:'bc'}, {t:'o', s:'hv'}, ...] */
export function parse(str) {
  return [...str].map((ch) => {
    if (/\d/.test(ch)) return { t: 'd', s: DIGITS[ch] };
    if (ch === '=') return { t: 'e', s: 'tu' };
    return { t: 'o', s: ch === '+' ? 'hv' : 'h' };
  });
}

export function readGlyph(g) {
  const k = key(g.s);
  if (g.t === 'd') return SEGS_TO_DIGIT[k] ?? '?';
  if (g.t === 'o') return k === 'h' ? '-' : k === 'hv' ? '+' : '?';
  return '=';
}

export const readAll = (glyphs) => glyphs.map(readGlyph).join('');

/** true = conta certa, false = errada, null = algum símbolo não forma número/sinal */
export function evaluate(glyphs) {
  const r = readAll(glyphs);
  if (r.includes('?')) return null;
  const [left, res] = r.split('=');
  const nums = left.split(/[+-]/).concat([res]);
  if (nums.some((n) => n === '' || (n.length > 1 && n[0] === '0'))) return null;
  const ops = left.match(/[+-]/g) ?? [];
  let v = Number(nums[0]);
  ops.forEach((o, i) => { v = o === '+' ? v + Number(nums[i + 1]) : v - Number(nums[i + 1]); });
  return v === Number(res);
}

export const has = (glyphs, [gi, s]) => glyphs[gi].s.includes(s);

/** Move o palito de `from` para `to`, devolvendo uma nova lista (imutável). */
export function move(glyphs, [fg, fs], [tg, ts]) {
  return glyphs.map((g, i) => {
    let s = g.s;
    if (i === fg) s = s.replace(fs, '');
    if (i === tg) s = s + ts;
    return s === g.s ? g : { ...g, s };
  });
}

/** Todas as jogadas de um palito que deixam a conta certa. */
export function solutions(glyphs) {
  const out = [];
  glyphs.forEach((g, i) => {
    if (g.t === 'e') return;
    for (const s of g.s) {
      glyphs.forEach((h, j) => {
        if (h.t === 'e') return;
        for (const t of SLOTS[h.t]) {
          if (h.s.includes(t)) continue;
          if (evaluate(move(glyphs, [i, s], [j, t]))) out.push({ from: [i, s], to: [j, t] });
        }
      });
    }
  });
  return out;
}
