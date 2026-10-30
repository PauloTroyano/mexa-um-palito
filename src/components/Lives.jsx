const HEART = 'M13 21 C4 14 1 10 2 6.5 C3 2.5 8 1.5 10.5 4.5 L13 7 L15.5 4.5 C18 1.5 23 2.5 24 6.5 C25 10 22 14 13 21 Z';

export default function Lives({ lives, max, justLost }) {
  return (
    <div className="lives" aria-live="polite" aria-label={`${lives} de ${max} vidas`}>
      <span>{max === 1 ? 'Vida única:' : 'Vidas:'}</span>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 26 24" aria-hidden="true"
          className={`heart ${i >= lives ? 'lost' : ''} ${justLost && i === lives ? 'just' : ''}`}>
          <path d={HEART} />
        </svg>
      ))}
    </div>
  );
}
