// Palito de fósforo desenhado a lápis. Comprimento L, espessura T; `flip` põe a cabeça na outra ponta.
export const L = 44;
export const T = 7;

export default function Match({ flip }) {
  const h = L / 2;
  const hx = flip ? h - 5 : -h + 5;
  return (
    <g className="m" filter="url(#pencil)">
      <rect className="stick" x={-h} y={-T / 2} width={L} height={T} rx={1.5} />
      <path className="grain" d={`M${flip ? -h + 8 : -h + 14} -0.5 L${flip ? h - 14 : h - 8} 0.8`} />
      <ellipse className="head" cx={hx} cy={0} rx={6.8} ry={5.6} />
      {[-2, -1, 0, 1, 2].map((k) => (
        <line key={k} className="hatch" x1={hx - 4 + k * 2} y1={4} x2={hx + k * 2 + 2} y2={-4} />
      ))}
    </g>
  );
}
