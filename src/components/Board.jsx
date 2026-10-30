import Match, { L, T } from './Match.jsx';

const DW = 66; // largura de um dígito
const OW = 50; // largura de operador / igual
const POS = {
  d: { a: [33, 6, 0], g: [33, 56, 0], d: [33, 106, 0], f: [6, 31, 90], b: [60, 31, 90], e: [6, 81, 90], c: [60, 81, 90] },
  o: { h: [25, 56, 0], v: [25, 56, 90] },
  e: { t: [25, 45, 0], u: [25, 67, 0] },
};
const FLIP = new Set(['b', 'c', 'd']);
const eq = (a, b) => a && a[0] === b[0] && a[1] === b[1];

export default function Board({ glyphs, cur, lifted, solved, hint, onTap }) {
  const gap = glyphs.length > 8 ? 12 : 20;
  let x = 0;
  const placed = glyphs.map((g) => {
    const at = x;
    x += (g.t === 'd' ? DW : OW) + gap;
    return at;
  });
  const width = x - gap;
  const minWidth = glyphs.length > 7 ? glyphs.length * 38 : undefined;

  const onKey = (e, slot) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(slot); }
  };

  return (
    <div className="eqwrap">
      <svg
        id="eq"
        className={`${lifted ? 'holding' : ''} ${solved ? 'win' : ''}`}
        viewBox={`-10 -26 ${width + 20} 148`}
        style={{ minWidth }}
        role="group"
        aria-label="Equação de palitos"
      >
        <defs>
          <filter id="pencil" x="-10%" y="-40%" width="120%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {glyphs.map((g, gi) => (
          <g key={gi} transform={`translate(${placed[gi]},0)`}>
            {Object.entries(POS[g.t]).map(([s, [cx, cy, rot]]) => {
              const slot = [gi, s];
              const full = g.s.includes(s);
              const interactive = g.t !== 'e' && !solved;
              const hinted = hint && (eq(hint.from, slot) || (hint.stage > 1 && eq(hint.to, slot)));
              const cls = ['seg', full ? 'full' : 'empty', g.t === 'e' && 'fixed', lifted && eq(cur, slot) && 'lifted', hinted && 'hint']
                .filter(Boolean).join(' ');
              return (
                <g
                  key={s}
                  className={cls}
                  data-g={gi}
                  data-s={s}
                  transform={`translate(${cx},${cy}) rotate(${rot})`}
                  onClick={() => onTap(slot)}
                  onKeyDown={interactive ? (e) => onKey(e, slot) : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  role={interactive ? 'button' : undefined}
                  aria-label={interactive ? `${full ? 'Palito' : 'Espaço vazio'} no símbolo ${gi + 1}` : undefined}
                >
                  <rect className="hit" x={-L / 2 - 4} y={-12} width={L + 8} height={24} />
                  <rect className="slot" x={-L / 2} y={-T / 2} width={L} height={T} rx={3} />
                  {full && <Match flip={FLIP.has(s)} />}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
