import { LEVELS } from '../game/levels.js';

export default function LevelPicker({ current, done, onPick }) {
  const unlocked = (i) => (i === 0 || done.includes(i - 1)) && !done.includes(i);
  return (
    <nav className="levels" aria-label="Escolher fase">
      {LEVELS.map((lv, i) => (
        <button
          key={i}
          className={[lv.boss && 'boss', done.includes(i) && 'done', i === current && 'cur', !unlocked(i) && 'locked'].filter(Boolean).join(' ')}
          aria-label={`Fase ${i + 1}${lv.boss ? ', chefão' : ''}${done.includes(i) ? ' (feita)' : ''}${!unlocked(i) ? ' (bloqueada)' : ''}`}
          disabled={!unlocked(i)}
          onClick={() => onPick(i)}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );
}
