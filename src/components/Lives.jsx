function Match({ alive, justLost }) {
  return (
    <svg viewBox="0 0 14 40" aria-hidden="true"
      className={`match-life ${!alive ? 'burned' : ''} ${justLost ? 'just' : ''}`}>
      {alive ? (
        <>
          {/* stick */}
          <rect x="5.5" y="8" width="3" height="30" rx="1.2"
            fill="var(--wood)" stroke="var(--lead)" strokeWidth="1" />
          {/* grain lines */}
          <line x1="6.5" y1="12" x2="6.5" y2="36" stroke="var(--lead-soft)" strokeWidth="0.6" opacity="0.5" />
          {/* head */}
          <ellipse cx="7" cy="8" rx="4.5" ry="5"
            fill="var(--red)" stroke="var(--lead)" strokeWidth="1" />
          <line x1="5" y1="6" x2="9" y2="10" stroke="#8f2019" strokeWidth="0.8" opacity="0.6" />
        </>
      ) : (
        <>
          {/* burned stick — darker, thinner */}
          <rect x="5.8" y="10" width="2.4" height="28" rx="1"
            fill="#5a3a1a" stroke="#3a2010" strokeWidth="0.8" opacity="0.7" />
          {/* burned head — ash gray blob */}
          <ellipse cx="7" cy="9" rx="4" ry="4.5"
            fill="#aaa" stroke="#888" strokeWidth="0.8" opacity="0.8" />
          {/* ash crack lines */}
          <line x1="5.5" y1="7.5" x2="8.5" y2="11" stroke="#777" strokeWidth="0.7" opacity="0.6" />
          <line x1="8" y1="7" x2="5.5" y2="10.5" stroke="#777" strokeWidth="0.7" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

export default function Lives({ lives, max, justLost }) {
  return (
    <div className="lives" aria-live="polite" aria-label={`${lives} de ${max} vidas`}>
      {Array.from({ length: max }, (_, i) => {
        const alive = i < lives;
        const isJustLost = justLost && i === lives;
        return <Match key={i} alive={alive} justLost={isJustLost} />;
      })}
    </div>
  );
}
